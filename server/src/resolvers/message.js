import { PubSub, withFilter } from "graphql-subscriptions";
import { Op } from "sequelize";

const pubsub = new PubSub();

const NEW_PRIVATE_MESSAGE = "NEW_PRIVATE_MESSAGE";

export default {
  Subscription: {
    newPrivateMessage: {
      // Listen to all incoming & outgoing messages
      subscribe: withFilter(
        () => pubsub.asyncIterator(NEW_PRIVATE_MESSAGE),
        (payload, args, context) =>
          // I'm the sender
          payload.newPrivateMessage.senderId ===
            payload.newPrivateMessage.myId ||
          // Or I'm the receiver
          payload.newPrivateMessage.recipientId ===
            payload.newPrivateMessage.myId
      ),
    },
  },
  Query: {
    /**
     * Get all conversations with users, including their info.
     * @returns an array of objects containing an user object
     * with their info and an array of messages of said user.
     */
    getConversations: async (_, __, { models, req }) => {
      const myId = req.session.userId;

      // Get only messages not archived by me
      const messages = await models.Message.findAll({
        where: {
          [Op.and]: [
            {
              // sender_id = myId OR recipient_id = myId
              [Op.or]: [{ senderId: myId }, { recipientId: myId }],
            },
            {
              // archived_by = null OR archived_by DOES NOT CONTAIN myId
              [Op.or]: [
                {
                  archivedBy: null,
                },
                {
                  [Op.not]: {
                    archivedBy: {
                      [Op.contains]: [myId],
                    },
                  },
                },
              ],
            },
          ],
        },
        order: [["created_at", "DESC"]],
      });

      // Get Ids of users associated with message (excluding me)
      const ids = messages.map(({ senderId, recipientId }) => {
        // If I'm the sender, user is recipientId
        if (senderId === myId) return recipientId;
        // If I'm the recipient, user is the senderId
        else return senderId;
      });

      // Get unique users
      const userIds = [...new Set(ids)];

      // Get their profiles
      const users = await models.User.findAll({
        where: { id: userIds },
      });

      // Only get needed values
      const profiles = users.map(({ id, name, picture }) => ({
        id,
        name,
        picture,
      }));

      const conversations = userIds.map((userId) => {
        // Get user's profile
        const user = profiles.find(({ id }) => userId === id);
        // Get every message associated with user
        const conversation = messages.filter(
          ({ senderId, recipientId }) =>
            senderId === userId || recipientId === userId
        );
        return { user, messages: conversation };
      });

      return conversations;
    },
  },
  Mutation: {
    /**
     * Create a message directed towards a user.
     * @param {string} senderId - ID of the sender.
     * @param {string} recipientId - ID of the recipient.
     * @param {string} body - Text message body.
     * @returns a success response in the form of { success: true }
     */
    createMessage: async (
      _,
      { input: { senderId, recipientId, body } },
      { models, req }
    ) => {
      // For testing purposes, replace myId with `senderId || myId`
      const myId = req.session.userId;

      const message = await models.Message.create({
        // senderId: senderId || myId,
        senderId: myId,
        recipientId,
        body,
      });

      // Create websocket that listens to any messages by or for you
      pubsub.publish(NEW_PRIVATE_MESSAGE, {
        newPrivateMessage: { ...message.dataValues, myId },
      });

      return {
        success: true,
      };
    },
    archiveConversation: async (_, { userId }, { models, req }) => {
      const myId = req.session.userId;

      const conversation = await models.Message.findAll({
        where: {
          [Op.or]: [
            {
              [Op.and]: [{ senderId: myId }, { recipientId: userId }],
            },
            {
              [Op.and]: [{ senderId: userId }, { recipientId: myId }],
            },
          ],
        },
        order: [["created_at", "DESC"]],
      });

      if (!conversation.length) {
        return {
          errors: [
            {
              field: "messages",
              message: "No conversation found with this user.",
            },
          ],
        };
      }

      // Archive conversation for me
      conversation.map((message) => {
        const {
          dataValues: { archivedBy },
        } = message;

        // Not previously archived
        if (!archivedBy) {
          message.update({ archivedBy: [myId] });
        }
        // If conversation already archived
        else {
          const archivedByMe = archivedBy.includes(myId);

          if (!archivedByMe) {
            message.update({ archivedBy: [...archivedBy, myId] });
          }

          // If archived by me, continue
        }

        // // Set archivedBy back to null (testing)
        // message.update({ archivedBy: null });
      });

      return {
        success: true,
      };
    },
    /**
     * Update all messages sent to you by user, NOT yours sent to them.
     * @param {string} userId - User ID.
     * @returns a success response in the form of { success: true }
     */
    updateSeenStatus: async (_, { userId }, { models, req }) => {
      const myId = req.session.userId;

      // Get all messages sent from user to me
      const messages = await models.Message.findAll({
        where: {
          [Op.and]: [{ senderId: userId }, { recipientId: myId }],
        },
        order: [["created_at", "DESC"]],
      });

      // Update every message and change to seen
      messages.map((message) => {
        const {
          dataValues: { seen },
        } = message;

        // Skip seen messages
        if (!seen) {
          message.update({ seen: true });
        }
      });

      return {
        success: true,
      };
    },
  },
};

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
     * This is the entry point of the messages page
     * @returns an ordered array of the unique IDs of users you
     * have interacted with (newest to oldest)
     */

    // TODO ?? :     // Check for possible archived conversations to prevent passed Id
    // of archived messages

    getUniqueMessageUserIds: async (_, __, { models, req }) => {
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

      // Return id of user other than self
      const ids = messages.map((message) => {
        const {
          dataValues: { senderId, recipientId },
        } = message;

        // If I'm the sender, return recipientId
        if (senderId === myId) return recipientId;
        // If I'm the recipient, return senderId
        else return senderId;
      });

      return [...new Set(ids)];
    },
    /**
     * Get users' profile information
     *
     * @param {[string]} userIds - Ordered array of users you have messages with (newest to oldest)
     *
     * @returns an array of user profiles.
     */
    getMessageUserProfiles: async (_, { userIds }, { models }) => {
      const users = await models.User.findAll({
        where: { id: userIds },
      });

      if (!users) return [];

      // Only get needed profile values
      const profiles = users.map(({ id, name, picture }) => ({
        userId: id,
        name,
        picture,
      }));

      return profiles;
    },

    /**
     * Get newest message for every user.
     *
     * @param {[string]} userIds - Ordered array of users you have messages with (newest to oldest)
     *
     * @returns an array of messages.
     */

    getNewestMessageByUsers: async (_, { userIds }, { models, req }) => {
      const myId = req.session.userId;

      const messages = userIds.map(async (userId) => {
        // Get the latest message between two users
        const newest = await models.Message.findOne({
          where: {
            [Op.or]: [
              {
                // sender_id = myId AND recipient_id = userId
                [Op.and]: [{ senderId: myId }, { recipientId: userId }],
              },
              {
                // OR sender_id = userId AND recipient_id = myId
                [Op.and]: [{ senderId: userId }, { recipientId: myId }],
              },
            ],
          },
          // Newest message
          order: [["created_at", "DESC"]],
        });

        return {
          userId,
          message: newest,
        };
      });

      return messages;
    },

    /**
     * Get the recent conversations between you and users for caching purposes.
     *
     * @param {int} last - Number of conversations to query
     * @param {[string]} userIds - Ordered array of users you have messages with (newest to oldest)
     *
     * @returns an array of conversations with message data.
     */

    getRecentConversations: async (_, { last, userIds }, { models, req }) => {
      const myId = req.session.userId;

      // Get only the last (x) conversations
      const usersToFetch = userIds.slice(0, last);

      const conversations = usersToFetch.map(async (userId) => {
        const messages = await models.Message.findAll({
          where: {
            // sender_id = myId OR recipient_id = myId
            [Op.or]: [
              {
                // sender_id = myId AND recipient_id = userId
                [Op.and]: [{ senderId: myId }, { recipientId: userId }],
              },
              {
                // OR sender_id = userId AND recipient_id = myId
                [Op.and]: [{ senderId: userId }, { recipientId: myId }],
              },
            ],
          },
          order: [["created_at", "ASC"]],
        });

        return {
          userId,
          messages,
        };
      });

      return conversations;
    },

    /**
     * Get conversation with user.
     *
     * @param {string} userId - User ID.
     *
     * @returns an array of messages.
     */

    getUserConversation: async (_, { userId }, { models, req }) => {
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
        order: [["created_at", "ASC"]],
      });

      return conversation;
    },
  },
  Mutation: {
    /**
     * Create a message directed towards a user.
     *
     * @param {string} senderId - ID of the sender.
     * @param {string} recipientId - ID of the recipient.
     * @param {string} body - Text message body.
     *
     * @returns a success response in the form of { success: true }
     */

    createMessage: async (
      _,
      { input: { senderId, recipientId, body } },
      { models, req }
    ) => {
      // TODO: REMOVE senderId arg and line 191 "senderId ||"
      // This is just for trial without having to log into account
      const myId = req.session.userId;

      const message = await models.Message.create({
        senderId: senderId || myId,
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
        order: [["created_at", "ASC"]],
      });

      if (!conversation.length) {
        console.log("howdy");
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
     *
     * @param {string} userId - User ID.
     *
     * @returns a success response in the form of { success: true }
     */
    updateSeenStatus: async (_, { userId }, { models, req }) => {
      const myId = req.session.userId;

      // Get all messages sent from user to me
      const messages = await models.Message.findAll({
        where: {
          [Op.and]: [{ senderId: userId }, { recipientId: myId }],
        },
        order: [["created_at", "ASC"]],
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

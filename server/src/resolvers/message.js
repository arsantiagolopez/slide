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
    getUniqueMessageUserIds: async (_, args, { models, req }) => {
      // This is the entry point of the messages page
      // Returns unique ids array of users you have messages with (newest to oldest)
      // Check for possible archived conversations to prevent passed Id
      // of archived messages

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

      // Return the right id of user other than self
      const userIds = messages.map((message) => {
        const {
          dataValues: { senderId, recipientId },
        } = message;

        // If I'm the sender, return recipientId
        if (senderId === myId) return recipientId;
        // If I'm the recipient, return senderId
        else return senderId;
      });

      return [...new Set(userIds)];
    },
    getMessageUserProfiles: async (_, { userIds }, { models }) => {
      const users = await models.User.findAll({
        where: { id: userIds },
        include: { model: models.UserProfile },
      });

      if (!users) {
        return [];
      }

      // Only get needed profile values
      const userProfiles = users.map((user) => {
        const { userId, name, picture } = user.UserProfile;

        return { userId, name, picture };
      });

      return userProfiles;
    },
    getNewestMessageByUsers: async (_, { userIds }, { models, req }) => {
      const myId = req.session.userId;

      // TODO: Make sure this async/await inside of map works, it seems to work with small data
      const messages = userIds.map(async (userId) => {
        // Get the latest message between a two user conversation
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
    getRecentConversations: async (_, { last, userIds }, { models, req }) => {
      // Last is the number of conversations to be queried
      // userIds is the ordered array of users you have messages with (newest to oldest)
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
    // Mark all messages from user as seen
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

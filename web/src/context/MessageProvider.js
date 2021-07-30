import { withUrqlClient } from "next-urql";
import now from "performance-now";
import React, { useContext, useEffect, useState } from "react";
import { useClient, useMutation, useSubscription } from "urql";
import { UpdateSeenStatus as UpdateSeenStatusMutation } from "../graphql/mutations/message";
import {
  GetMessageUserProfiles as GetMessageUserProfilesQuery,
  GetNewestMessageByUsers as GetNewestMessageByUsersQuery,
  GetRecentConversations as GetRecentConversationsQuery,
  GetUniqueMessageUserIds as GetUniqueMessageUserIdsQuery,
  GetUserConversation as GetUserConversationQuery,
} from "../graphql/queries/message";
import { NewPrivateMessage as NewPrivateMessageSubscription } from "../graphql/subscriptions/message";
import { createUrqlClient } from "../utils/createUrqlClient";
import { MessageContext } from "./MessageContext";
import { UserContext } from "./UserContext";

// messageList is the one source of truth
// Update all components based on messageList updates

const MessageProvider = withUrqlClient(createUrqlClient)(({ children }) => {
  const [activeMessage, setActiveMessage] = useState(null);
  const [activeConversation, setActiveConversation] = useState(null);
  const [previews, setPreviews] = useState(null);
  const [previewsCopy, setPreviewsCopy] = useState(null);
  const [messageList, setMessageList] = useState(null);
  const [recipientId, setRecipientId] = useState(null);
  const [loadedConversations, setLoadedConversations] = useState(null);
  const [activeTimestamp, setActiveTimestamp] = useState(null);

  const { user } = useContext(UserContext);

  const [, updateSeenStatus] = useMutation(UpdateSeenStatusMutation);

  const myId = user?.me?.id;

  // Number of full conversation histories to fetch on mount
  const NUM_OF_RECENT_CONVERSATIONS = 3;

  // Execution time debugging
  let start = now();

  // useQuery promise alternative
  const client = useClient();

  // Promisify query & return data
  const queryPromise = async (query, variables) => {
    const { data } = await client.query(query, variables).toPromise();
    return data;
  };

  // All queries ran, pass down previews & last 3 conversations
  const compressMessages = (users, previews, recentConversations) => {
    // Iterate through message previews
    const messages = previews.map((preview) => {
      let conversation;

      const { userId } = preview;

      // Associate recipient info
      const recipientInfo = users.find((user) => user.userId === userId);

      // Associate conversation
      const conversationExists = recentConversations.find(
        (conversation) => conversation.userId === userId
      );

      if (conversationExists) {
        // Populate conversation
        const { messages } = conversationExists;
        conversation = messages;
      } else {
        // Populate conversation
        const { message } = preview;

        // Conversation must always be an array of messages
        conversation = [message];
      }

      return {
        recipientInfo,
        conversation,
      };
    });

    return messages;
  };

  // Fetch all queries
  const fetchMessages = async (userIds) => {
    // Get user profiles (Query)
    // Returns array of unique ids you have interacted with
    const { getMessageUserProfiles: userProfiles } = await queryPromise(
      GetMessageUserProfilesQuery,
      {
        userIds,
      }
    );

    // Get newest message by users (Query)
    // Returns array of most recent message by users
    const { getNewestMessageByUsers: newestMessageByUsers } =
      await queryPromise(GetNewestMessageByUsersQuery, {
        userIds,
      });

    // Get last 3 recent conversations (Query)
    // Returns array of the x most recent full conversations
    const { getRecentConversations: recentConversations } = await queryPromise(
      GetRecentConversationsQuery,
      {
        last: NUM_OF_RECENT_CONVERSATIONS,
        userIds,
      }
    );

    // All queries ran, pass down previews & last 3 conversations
    const messages = compressMessages(
      userProfiles,
      newestMessageByUsers,
      recentConversations
    );

    setMessageList(messages);

    // Must return messageList
    return messages;
  };

  // Set active conversation, timestamp and mark as seen
  const updateActiveConversation = (conversation) => {
    // Set current conversation
    setActiveConversation(conversation);

    // Update active timestamp
    const lastItem = conversation.length - 1;
    const newestMessage = conversation[lastItem];
    setActiveTimestamp(newestMessage?.id);

    // Set conversation to seen
    setToSeen(conversation);
  };

  // Update user conversation to seen if unseen
  const setToSeen = (conversation) => {
    const lastItem = conversation.length - 1;
    const newestMessage = conversation[lastItem];
    const { senderId, recipientId } = newestMessage || {};
    const userId = myId === senderId ? recipientId : senderId;

    // Only run if any message sent by user in conversation is unseen
    const someUnseen = conversation.some((message) => {
      const { senderId, seen } = message;

      // If message by user and unseen
      if (senderId === userId && !seen) {
        return true;
      }
    });

    // Change all messages with user as seen
    if (someUnseen) {
      // Update user in messageList for live refresh
      const updatedList = messageList.map((user) => {
        const { conversation, ...otherUserProps } = user;

        // Only update active user conversation
        if (user.recipientInfo.userId === userId) {
          // Set all messages sent by user to seen
          const updatedConversation = conversation.map((message) => {
            const { senderId, seen, ...otherMessageProps } = message;

            if (senderId === userId) {
              return {
                senderId,
                seen: true,
                ...otherMessageProps,
              };
            } else {
              return message;
            }
          });

          // Return updated user object
          return {
            conversation: updatedConversation,
            ...otherUserProps,
          };
        }

        // Return unchanged users
        return user;
      });

      setMessageList(updatedList);

      // Update all messages sent by user to seen
      updateSeenStatus({ userId });
    }
  };

  /***********************************************************************
   *
   *    Main
   *
   ***********************************************************************/

  // Run on mount
  useEffect(async () => {
    if (user?.me) {
      console.log("should go in here on login/signup");
      // Fetch conversations (Query)
      // Array is returned from newest to oldest interactions
      const { getUniqueMessageUserIds: userIds } = await queryPromise(
        GetUniqueMessageUserIdsQuery
      );

      if (!userIds) return;

      // Fetch all queries
      await fetchMessages(userIds);

      let end = now();
      // console.log(`TIME QUERY All took ${end - start} ms`);
    }
  }, [user]);

  // Toggle seen & fetch conversation if not cached
  useEffect(async () => {
    if (activeMessage) {
      const { recipientInfo, newestMessage } = activeMessage;

      // If active message is temp preview, skip loading conversations
      const isTempPreview = !newestMessage.senderId === true;
      if (isTempPreview) {
        return setActiveConversation(null);
      }

      const conversationLoaded = loadedConversations.find(
        (conversation) => conversation.recipientId === recipientInfo.userId
      );

      if (conversationLoaded) {
        const {
          messageData: { conversation },
        } = conversationLoaded;

        // Set active conversation, timestamp & seen
        updateActiveConversation(conversation);
      }
      // Fetch user conversation
      else {
        // Get user conversation (Query)
        // Returns array of your full history of conversation with the user
        const { getUserConversation: userConversation } = await queryPromise(
          GetUserConversationQuery,
          {
            userId: recipientInfo.userId,
          }
        );

        // Update messageList with new fetched conversation
        const updatedMessageList = messageList.map((user) => {
          const { conversation, ...otherProps } = user;

          // Only update active user
          if (user.recipientInfo.userId === recipientInfo.userId) {
            return {
              conversation: userConversation,
              ...otherProps,
            };
          }
          // Return unchanged users
          return user;
        });

        setMessageList(updatedMessageList);

        // Set active conversation, timestamp & seen
        updateActiveConversation(userConversation);
      }
    }
  }, [activeMessage]);

  /***********************************************************************
   *
   *    Live subscriptions
   *
   ***********************************************************************/

  const handlePrivateMessageSubscription = (
    messages = [],
    { newPrivateMessage }
  ) => {
    return [newPrivateMessage, ...messages];
  };

  const [{ data: liveMessages }] = useSubscription(
    {
      query: NewPrivateMessageSubscription,
    },
    handlePrivateMessageSubscription
  );

  // Update messageList if new live message
  useEffect(() => {
    if (liveMessages) {
      // Set newMessage to the message object if there is one,
      // Set to null if message already has preview

      // First element is always the newest
      const incomingMessage = liveMessages[0];
      const { senderId, recipientId } = incomingMessage;
      const userId = myId === senderId ? recipientId : senderId;

      // messageList is null if incomingMessage is the first message
      if (!messageList) {
        // Fetch all queries with new userId
        return fetchMessages([userId]);
      }

      // Update messageList
      // Check if user associated with message has a preview
      const hasPreview = messageList.find(
        (user) => user.recipientInfo.userId === userId
      );

      if (hasPreview) {
        // Check if message exists in conversation
        const { conversation, ...otherProps } = hasPreview;

        const newMessageExistsInConversation = conversation.find(
          (message) => message.id === incomingMessage.id
        );

        // Add incomingMessage to user conversation
        if (!newMessageExistsInConversation) {
          const updatedConversation = [...conversation, ...[incomingMessage]];

          // Update messageList with new message
          const updatedList = messageList.map((user) => {
            // Only update user
            if (user.recipientInfo.userId === hasPreview.recipientInfo.userId) {
              return {
                conversation: updatedConversation,
                ...otherProps,
              };
            }
            // Return unchanged users
            return user;
          });

          setMessageList(updatedList);

          // If conversation open, update activeConversation live
          const conversationOpen =
            userId === activeMessage?.recipientInfo.userId;

          if (conversationOpen) {
            // Conversation is updated per individual message
            // Active conversation must have ALL live messages

            // Get messages sent or received by active user
            const incomingMessages = liveMessages.filter(
              ({ recipientId, senderId }) => {
                if (userId === recipientId || userId === senderId) return true;
              }
            );

            // Filter out multiple messages
            const uniqueMessages = conversation.filter(
              ({ id }) =>
                !liveMessages.some((liveMsg) => id.includes(liveMsg.id))
            );

            // Add to user conversation
            const updatedConversationMultipleMessages = [
              ...uniqueMessages,
              ...incomingMessages.reverse(),
            ];

            updateActiveConversation(updatedConversationMultipleMessages);
          }
        }
      }
      // No data stored from incoming message, fetch info
      else {
        const userIds = messageList.map(
          (message) => message.recipientInfo.userId
        );

        // Pass old userIds array with new userId
        const newUserIds = [...userIds, ...[userId]];

        // Fetch all info
        fetchMessages(newUserIds);
      }
    }
  }, [liveMessages]);

  /***********************************************************************
   *
   *    Side effects
   *
   ***********************************************************************/

  // Create & maintain user conversations cache
  useEffect(() => {
    // Create cache
    if (!loadedConversations) {
      return setLoadedConversations([]);
    }

    // If messageList changes, update cache
    if (messageList) {
      let cachedConversations = messageList;

      // If more than initially fetched, get subsequently cached users
      if (messageList.length > NUM_OF_RECENT_CONVERSATIONS) {
        // Only store full conversations on cache
        cachedConversations = messageList.filter((user, index) => {
          const { conversation } = user;

          // First NUM_OF_RECENT_CONVERSATIONS always cached
          if (index < NUM_OF_RECENT_CONVERSATIONS) return user;

          // Best tell of what users have been cached is number of messages
          if (conversation.length > 1) return user;
        });
      }

      // Store into array
      const conversationsArr = cachedConversations.map((conversation) => {
        const {
          recipientInfo: { userId },
        } = conversation;
        return {
          recipientId: userId,
          messageData: conversation,
        };
      });

      // Update state
      setLoadedConversations(conversationsArr);
    }
  }, [messageList]);

  return (
    <MessageContext.Provider
      value={{
        myId,
        previews,
        previewsCopy,
        messageList,
        activeMessage,
        activeConversation,
        recipientId,
        loadedConversations,
        activeTimestamp,
        setActiveTimestamp,
        setLoadedConversations,
        setRecipientId,
        setActiveConversation,
        setActiveMessage,
        setPreviewsCopy,
        setPreviews,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
});

export { MessageProvider };

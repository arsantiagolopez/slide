import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import now from "performance-now";
import React, { useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useSubscription } from "urql";
import { UpdateSeenStatus as UpdateSeenStatusMutation } from "../graphql/mutations/message";
import { GetConversations as GetConversationsQuery } from "../graphql/queries/message";
import { NewPrivateMessage as NewPrivateMessageSubscription } from "../graphql/subscriptions/message";
import { createUrqlClient } from "../utils/createUrqlClient";
import { MessageContext } from "./MessageContext";
import { UserContext } from "./UserContext";

const MessageProvider = withUrqlClient(createUrqlClient)(({ children }) => {
  const [activeMessage, setActiveMessage] = useState(null);
  const [previews, setPreviews] = useState(null);
  const [previewsCopy, setPreviewsCopy] = useState(null);
  const [messageList, setMessageList] = useState(null);
  const [recipientId, setRecipientId] = useState(null);
  const [activeTimestamp, setActiveTimestamp] = useState(null);

  const { user } = useContext(UserContext);
  const router = useRouter();

  const [, updateSeenStatus] = useMutation(UpdateSeenStatusMutation);

  const myId = user?.me?.id;

  // Execution time debugging
  let start = now();

  // Set active conversation, timestamp and mark as seen
  const updateActiveConversation = (conversation) => {
    const { messages } = conversation;
    // Update active timestamp
    const newestMessage = messages[0];
    setActiveTimestamp(newestMessage?.id);
    // Set conversation to seen
    setToSeen(messages);
  };

  // Update user conversation to seen if unseen
  const setToSeen = (conversation) => {
    const { senderId, recipientId } = conversation[0] || {};
    const userId = myId === senderId ? recipientId : senderId;

    // Only run if any message sent by user in conversation is unseen
    const someUnseen = conversation.some(({ senderId, seen }) => {
      // If message by user and unseen
      if (senderId === userId && !seen) {
        return true;
      }
    });

    // Change all messages with user as seen
    if (someUnseen) {
      // Update all messages sent by user to seen
      updateSeenStatus({ userId });
      // Update list by refetching conversations
      refetchConversations();
    }
  };

  /***********************************************************************
   *
   *    Main
   *
   ***********************************************************************/

  // Fetch conversations (Query)
  // Array is returned from newest to oldest interactions
  // Refetch queries on "/" load
  const [{ data: conversations }, refetchConversations] = useQuery({
    query: GetConversationsQuery,
    requestPolicy: "cache-and-network",
  });

  // Run on mount
  useEffect(() => {
    if (user && conversations) {
      const { getConversations } = conversations;
      // Get and store conversations
      setMessageList(getConversations);
      let end = now();
      // console.log(`TIME QUERY All took ${end - start} ms`);
    }
  }, [user, conversations]);

  // Toggle seen & fetch conversation
  useEffect(async () => {
    if (activeMessage) {
      const { user, newestMessage } = activeMessage;

      // If active message is temp preview, skip loading conversations
      const isTempPreview = !newestMessage.senderId === true;

      if (isTempPreview) return;

      const conversation = messageList.find(
        ({ user: { id } }) => id === user?.id
      );

      // Set active conversation, timestamp & seen
      updateActiveConversation(conversation);
    }
  }, [activeMessage]);

  /***********************************************************************
   *
   *    Live subscriptions
   *
   ***********************************************************************/

  // Return incoming message
  const handlePrivateMessageSubscription = (_, { newPrivateMessage }) =>
    newPrivateMessage;

  const [{ data: liveMessage }] = useSubscription(
    {
      query: NewPrivateMessageSubscription,
    },
    handlePrivateMessageSubscription
  );

  // Handle new messages
  useEffect(() => {
    if (liveMessage) {
      const { pathname, query } = router;
      const inboxOpen = pathname === "/messages";
      // Remove query to allow new messages to move to top of previews
      if (query && inboxOpen) {
        router.replace("/messages", undefined, { shallow: true });
      }
      refetchConversations();
    }
  }, [liveMessage]);

  return (
    <MessageContext.Provider
      value={{
        myId,
        previews,
        previewsCopy,
        messageList,
        activeMessage,
        recipientId,
        activeTimestamp,
        liveMessage,
        refetchConversations,
        setActiveTimestamp,
        setRecipientId,
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

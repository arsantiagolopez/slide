import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { useClient } from "urql";
import { MessageContext } from "../context/MessageContext";
import { GetUserProfileById as GetUserProfileByIdQuery } from "../graphql/queries/user";

const getPreviews = (myId, list, queryUser, setActiveMessage) => {
  let previews = list.map(({ conversation, ...otherUserProps }) => {
    const lastItem = conversation.length - 1;
    const { createdAt, seen, senderId, ...newestMessageProps } =
      conversation[lastItem];

    return {
      ...otherUserProps,
      newestMessage: {
        // If last message sent by me, automatically seen
        seen: senderId === myId ? true : seen,
        timestamp: createdAt,
        senderId,
        ...newestMessageProps,
      },
    };
  });

  if (queryUser) {
    const queryHasPreview = previews.find(
      ({ recipientInfo: { userId } }) =>
        userId === queryUser.recipientInfo?.userId
    );

    // If query has preview: Move to top & set active
    if (queryHasPreview) {
      let previewsWithoutQueryUser = previews.filter(
        ({ recipientInfo: { userId } }) =>
          userId !== queryUser.recipientInfo.userId
      );

      // Sort other previews
      previewsWithoutQueryUser.sort((a, b) =>
        a.newestMessage.timestamp < b.newestMessage.timestamp ? 1 : -1
      );

      // Set queryHasPreview as activeMessage
      setActiveMessage(queryHasPreview);

      return [queryHasPreview, ...previewsWithoutQueryUser];
    }

    // Query doesn't have preview: create temp preview, move to top & set active
    const tempPreview = {
      recipientInfo: {
        userId: queryUser.id,
        picture: queryUser.picture,
        name: queryUser.name,
      },
      newestMessage: {
        timestamp: new Date(),
        seen: true,
      },
    };

    // Sort messages from newest to oldest
    previews.sort((a, b) =>
      a.newestMessage.timestamp < b.newestMessage.timestamp ? 1 : -1
    );

    // Set tempPreview as activeMessage
    setActiveMessage(tempPreview);

    return [tempPreview, ...previews];
  }

  // Sort messages from newest to oldest
  previews.sort((a, b) =>
    a.newestMessage.timestamp < b.newestMessage.timestamp ? 1 : -1
  );

  return previews;
};

const usePreviews = () => {
  const [previews, setPreviews] = useState(null);
  const { myId, messageList, setPreviewsCopy, setActiveMessage } =
    useContext(MessageContext);

  const { query } = useRouter();

  const client = useClient();

  // Create & update lighter previews object with only newest message
  useEffect(async () => {
    if (messageList) {
      let users;
      // No query in URL
      if (!query?.user) {
        users = getPreviews(myId, messageList);
      }

      // Query in URL
      else {
        let queryUser = messageList.find(
          ({ recipientInfo: { userId } }) => userId === query?.user
        );

        // User exists: move to top & set active
        if (queryUser) {
          users = getPreviews(myId, messageList, queryUser, setActiveMessage);

          // Update previews & copy (for search functionality)
          setPreviews(users);
          setPreviewsCopy(users);
        }

        // User doesn't exist: Create preview, move to top & set active
        else {
          const {
            data: { getUserProfileById },
          } = await client
            .query(GetUserProfileByIdQuery, { id: query?.user })
            .toPromise();

          queryUser = getUserProfileById;
          users = getPreviews(myId, messageList, queryUser, setActiveMessage);

          // Update previews & copy (for search functionality)
          setPreviews(users);
          setPreviewsCopy(users);
        }
      }

      // Update previews & copy (for search functionality)
      setPreviews(users);
      setPreviewsCopy(users);
    }
  }, [messageList, query]);

  return { previews, setPreviews };
};

export { usePreviews };

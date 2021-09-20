import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { useClient } from "urql";
import { MessageContext } from "../context/MessageContext";
import { GetUserProfileById as GetUserProfileByIdQuery } from "../graphql/queries/user";

// messageList: { user: {...}, messages: {...} }

const getPreviews = (myId, list, queryUser, setActiveMessage, router) => {
  let previews = list.map(({ user, messages }) => {
    // Get the newest message to display in preview
    const { createdAt, seen, senderId, ...newestMessageProps } = messages[0];

    return {
      user,
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
      ({ user: { id } }) => id === queryUser.user?.id
    );

    // If query has preview: Move to top & set active
    if (queryHasPreview) {
      let previewsWithoutQueryUser = previews.filter(
        ({ user: { id } }) => id !== queryUser.user?.id
      );

      // Sort other previews
      previewsWithoutQueryUser.sort((a, b) =>
        a.newestMessage.timestamp < b.newestMessage.timestamp ? 1 : -1
      );

      // Set queryHasPreview as activeMessage
      setActiveMessage(queryHasPreview);

      // Remove after message active
      router.replace("/messages", undefined, { shallow: true });

      return [queryHasPreview, ...previewsWithoutQueryUser];
    }

    // Query doesn't have preview: create temp preview, move to top & set active
    const { id, name, picture } = queryUser;
    const tempPreview = {
      user: { id, name, picture },
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

  const router = useRouter();
  const { query } = router || {};

  const client = useClient();

  // Create & update lighter previews object with only newest message
  useEffect(async () => {
    if (messageList) {
      let users, queryUser;

      // No query in URL
      if (!query?.user) {
        users = getPreviews(myId, messageList);
      }
      // Query in URL
      else {
        queryUser = messageList.find(({ user: { id } }) => id === query?.user);

        // User exists: move to top & set active
        if (queryUser) {
          users = getPreviews(
            myId,
            messageList,
            queryUser,
            setActiveMessage,
            router
          );
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

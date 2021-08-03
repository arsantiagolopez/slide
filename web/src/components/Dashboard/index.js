import { Flex } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React, { useEffect, useState } from "react";
import { useClient, useQuery } from "urql";
import {
  GetMessageUserProfiles as GetMessageUserProfilesQuery,
  GetNewestMessageByUsers as GetNewestMessageByUsersQuery,
  GetUniqueMessageUserIds as GetUniqueMessageUserIdsQuery,
} from "../../graphql/queries/message";
import {
  GetAllFollowingById as GetAllFollowingByIdQuery,
  GetNewestUsers as GetNewestUsersQuery,
} from "../../graphql/queries/user";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { useDimensions } from "../../utils/useDimensions";
import { useUser } from "../../utils/useUser";
import { NewUsers } from "../NewUsers";
import { UserList } from "../UserList";

const Dashboard = withUrqlClient(createUrqlClient)(() => {
  const [conversations, setConversations] = useState(null);
  const [friends, setFriends] = useState(null);
  const [newUsers, setNewUsers] = useState(null);
  const [active, setActive] = useState(null);

  const { user } = useUser({ redirectTo: "/login" });

  const [screenHeight, setScreenHeight] = useState(null);

  const { height } = useDimensions();

  useEffect(() => setScreenHeight(height), [height]);

  // useQuery promise alternative
  const client = useClient({ requestPolicy: "cache-and-network" });

  // Refetch queries on "/" load
  // Get user IDs
  const [{ data: userIdsData }] = useQuery({
    query: GetUniqueMessageUserIdsQuery,
    requestPolicy: "cache-and-network",
  });

  // Get following
  const [{ data: friendsData }] = useQuery({
    query: GetAllFollowingByIdQuery,
    variables: { id: user?.me?.id },
    requestPolicy: "cache-and-network",
  });

  // Get newest users
  const [{ data: newestUsersData }] = useQuery({
    query: GetNewestUsersQuery,
    requestPolicy: "cache-and-network",
  });

  // Get profile data
  const [{ data: userProfiles }] = useQuery({
    query: GetMessageUserProfilesQuery,
    variables: {
      userIds: userIdsData?.getUniqueMessageUserIds,
    },
    pause: !userIdsData,
    requestPolicy: "cache-and-network",
  });

  // Get latest message
  const [{ data: newestMessageByUsers }] = useQuery({
    query: GetNewestMessageByUsersQuery,
    variables: {
      userIds: userIdsData?.getUniqueMessageUserIds,
    },
    pause: !userIdsData,
    requestPolicy: "cache-and-network",
  });

  // Fetch conversations
  useEffect(async () => {
    const dataLoaded = userIdsData && userProfiles && newestMessageByUsers;
    if (user?.me && dataLoaded) {
      const { getNewestMessageByUsers } = newestMessageByUsers;
      const { getMessageUserProfiles } = userProfiles;

      // Turn new messages to map for fastest search
      const newMessagesMap = new Map(
        getNewestMessageByUsers?.map((item) => [item.userId, item])
      );

      let withIdAndNewMessage = getMessageUserProfiles.map(
        ({ userId, ...otherProps }) => ({
          id: userId,
          newestMessage: newMessagesMap.get(userId).message,
          ...otherProps,
        })
      );

      setConversations(withIdAndNewMessage);
    }
  }, [user, userIdsData, userProfiles, newestMessageByUsers]);

  // Fetch friends
  useEffect(async () => {
    if (user?.me && friendsData) {
      const { getAllFollowingById } = friendsData || {};

      // Add isFriend prop
      let withRelations = getAllFollowingById?.map((friend) => ({
        isFriend: true,
        ...friend,
      }));

      setFriends(withRelations);
    }
  }, [user, friendsData]);

  // Fetch new users
  useEffect(async () => {
    if (user?.me && friends && newestUsersData) {
      const { getNewestUsers } = newestUsersData || {};

      // Filter me out of users
      const otherUsers = getNewestUsers.filter(
        (item) => item.id !== user?.me?.id
      );

      // Turn friends to map for fastest search
      const friendsMap = new Map(friends?.map((item) => [item.id, item]));

      // Update newUsers
      const withRelations = otherUsers?.map((user) => {
        const isFriend = friendsMap.get(user.id);
        if (isFriend) {
          return { isFriend: true, ...user };
        }
        return { isFriend: false, ...user };
      });

      setNewUsers(withRelations);
    }
  }, [user, friends, newestUsersData]);

  // Update new users on new friend interactions
  useEffect(() => {
    if (newUsers && friends) {
      // Turn friends to map for fastest search
      const friendsMap = new Map(friends?.map((item) => [item.id, item]));

      // Update newUsers
      const withRelations = newUsers?.map((user) => {
        const isFriend = friendsMap.get(user.id);

        if (isFriend) {
          return { ...user, isFriend: true };
        }
        return { ...user, isFriend: false };
      });

      setNewUsers(withRelations);
    }
  }, [friends]);

  const listProps = {
    active,
    setActive,
    friends,
    setFriends,
  };

  return (
    <Flex {...styles.wrapper}>
      <Flex {...styles.left}>
        <UserList
          users={conversations}
          title="My conversations"
          messageIfEmpty="You haven't started any conversations yet. Spark one up with any newcomers on the side bar!"
          type="CONVERSATIONS"
          {...listProps}
        />
        <UserList
          users={friends}
          title="My friends"
          messageIfEmpty="Life's better with friends. You my friend, have none. Add one from the side bar!"
          type="FRIENDS"
          {...listProps}
        />
      </Flex>

      <Flex {...styles.right}>
        <NewUsers users={newUsers} height={screenHeight} {...listProps} />
      </Flex>
    </Flex>
  );
});

export { Dashboard };

// Styles

const styles = {
  wrapper: {
    direction: { base: "column", md: "row" },
    width: "100%",
    justify: "space-between",
  },
  left: {
    order: { base: 2, md: 1 },
    direction: "column",
    width: "100%",
    overflowX: "hidden",
    paddingTop: { base: "2em", md: "2em" },
  },
  right: {
    order: { base: 1, md: 2 },
  },
};

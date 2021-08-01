import { Flex } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React, { useEffect, useState } from "react";
import { useClient } from "urql";
import {
  GetMessageUserProfiles as GetMessageUserProfilesQuery,
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
  const client = useClient();

  // Fetch conversations
  useEffect(async () => {
    if (user?.me) {
      console.log("in hea");
      const {
        data: { getUniqueMessageUserIds: userIds },
      } = await client.query(GetUniqueMessageUserIdsQuery).toPromise();

      const {
        data: { getMessageUserProfiles },
      } = await client
        .query(GetMessageUserProfilesQuery, { userIds })
        .toPromise();

      const withIdProp = getMessageUserProfiles.map(
        ({ userId, ...otherProps }) => ({ id: userId, ...otherProps })
      );

      setConversations(withIdProp);
    }
  }, [user]);

  // Fetch friends
  useEffect(async () => {
    if (!friends && user?.me) {
      const {
        data: { getAllFollowingById },
      } = await client
        .query(GetAllFollowingByIdQuery, { id: user?.me?.id })
        .toPromise();

      // Add isFriend prop
      const withRelations = getAllFollowingById?.map((friend) => ({
        isFriend: true,
        ...friend,
      }));

      setFriends(withRelations);
    }
  }, [user]);

  // Fetch new users
  useEffect(async () => {
    if (!newUsers && user?.me && friends) {
      const {
        data: { getNewestUsers },
      } = await client.query(GetNewestUsersQuery).toPromise();

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
  }, [user, friends]);

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
          type="conversations"
          {...listProps}
        />
        <UserList
          users={friends}
          title="My friends"
          messageIfEmpty="Life's better with friends. You my friend, have none. Add one from the side bar!"
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

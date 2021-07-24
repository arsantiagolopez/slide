import { Flex } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React, { useContext, useEffect, useState } from "react";
import { useClient } from "urql";
import { UserContext } from "../../context/UserContext";
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
import { NewUsers } from "../NewUsers";
import { UserList } from "../UserList";

const Dashboard = withUrqlClient(createUrqlClient)(() => {
  const [conversations, setConversations] = useState(null);
  const [friends, setFriends] = useState(null);
  const [newUsers, setNewUsers] = useState(null);
  const [active, setActive] = useState(null);

  const [screenHeight, setScreenHeight] = useState(null);

  const { height } = useDimensions();

  useEffect(() => setScreenHeight(height), [height]);

  const { user } = useContext(UserContext);

  // useQuery promise alternative
  const client = useClient();

  // Fetch conversations
  useEffect(async () => {
    if (!conversations) {
      const {
        data: { getUniqueMessageUserIds: userIds },
      } = await client.query(GetUniqueMessageUserIdsQuery).toPromise();

      const {
        data: { getMessageUserProfiles },
      } = await client
        .query(GetMessageUserProfilesQuery, {
          userIds,
        })
        .toPromise();

      // Get newest message by user
      const {
        data: { getNewestMessageByUsers },
      } = await client
        .query(GetNewestMessageByUsersQuery, { userIds })
        .toPromise();

      // Create new conversation object where newMessage is included
      const users = getMessageUserProfiles?.map(
        ({ userId: id, name, picture }) => {
          const hasNewMessage = getNewestMessageByUsers?.find(
            ({ message: { senderId, seen } }) => {
              // If I sent the last message, no new messages
              if (senderId === user?.me?.id) return false;
              // If they sent the last message, and unseen, new message
              if (seen === false) return true;
            }
          );

          return { id, name, picture, hasNewMessage };
        }
      );

      setConversations(users);
    }
  }, []);

  // Fetch friends
  useEffect(async () => {
    if (!friends && user?.me) {
      const {
        data: { getAllFollowingById },
      } = await client
        .query(GetAllFollowingByIdQuery, { id: user?.me?.id })
        .toPromise();

      setFriends(getAllFollowingById);
    }
  }, [user]);

  // Fetch new users
  useEffect(async () => {
    if (!newUsers && user?.me) {
      const {
        data: { getNewestUsers },
      } = await client.query(GetNewestUsersQuery).toPromise();

      // Filter me out of users
      const otherUsers = getNewestUsers.filter(
        (item) => item.id !== user?.me?.id
      );

      setNewUsers(otherUsers);
    }
  }, [user]);

  // Update lists anytime a relationship changes
  useEffect(() => {
    // if (friends && ) {
    // }
  }, [friends, conversations, newUsers]);

  const listProps = { active, setActive };

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
          messageIfEmpty="Life's better with friends. You my friend, have none."
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

// const testUsers = [
//   {
//     id: "1",
//     name: "Devin",
//     picture:
//       "https://images.unsplash.com/photo-1546456073-92b9f0a8d413?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzN8fGZhY2V8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
//   },

//   {
//     id: "2",
//     name: "Andrea",
//     picture:
//       "https://images.unsplash.com/photo-1554151228-14d9def656e4?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFjZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
//     email: "andreadesmoineaux@gmail.com",
//   },
//   {
//     id: "3",
//     name: "Mateo Pannizardi",
//     picture:
//       "https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8ZmFjZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
//   },
//   {
//     id: "4",
//     name: "Stefania",
//     picture:
//       "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mjl8fGZhY2V8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
//   },
//   {
//     id: "5",
//     name: "Jack Pearson My babies",
//     picture:
//       "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=668&q=80",
//     email: "jackthereaper@gmail.com",
//   },
//   {
//     id: "6",
//     name: "Conor",
//     picture:
//       "https://images.unsplash.com/photo-1594819047050-99defca82545?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDZ8fGZhY2V8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
//   },
//   {
//     id: "7",
//     name: "Martha",
//     picture:
//       "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NTF8fGZhY2V8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
//   },
//   {
//     id: "8",
//     name: "Andrea",
//     picture:
//       "https://images.unsplash.com/photo-1554151228-14d9def656e4?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFjZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
//   },
//   {
//     id: "9",
//     name: "Jack Pearson",
//     picture:
//       "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=668&q=80",
//   },
//   {
//     id: "10",
//     name: "Andrea",
//     picture:
//       "https://images.unsplash.com/photo-1554151228-14d9def656e4?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFjZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
//   },
//   {
//     id: "11",
//     name: "Jack Pearson",
//     picture:
//       "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=668&q=80",
//   },
//   {
//     id: "12",
//     name: "Andrea",
//     picture:
//       "https://images.unsplash.com/photo-1554151228-14d9def656e4?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFjZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
//   },
// ];

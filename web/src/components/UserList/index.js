import { Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { Card } from "../Card";
import { SortBy } from "../SortBy";

const UserList = ({
  users,
  active,
  setActive,
  title,
  type,
  messageIfEmpty,
  friends,
  setFriends,
}) => {
  const [sortedUsers, setSortedUsers] = useState(null);
  const { user, sortConversationsBy, sortFriendsBy } = useContext(UserContext);

  const myId = user?.me?.id;

  // Corresponding sorting choice for dynamic list
  const rightfulSort =
    type === "CONVERSATIONS" ? sortConversationsBy : sortFriendsBy;

  useEffect(() => {
    if (users && rightfulSort) {
      // Sort messages from newest to oldest (default)
      if (rightfulSort === "DATE") {
        setSortedUsers([
          ...users?.sort(
            // Dates in epoch format
            (a, b) =>
              b?.newestMessage?.createdAt?.toString() -
              a?.newestMessage?.createdAt?.toString()
          ),
        ]);
      }

      // Sort users alphabetically
      if (rightfulSort === "NAME") {
        setSortedUsers([
          ...users?.sort((a, b) =>
            a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
          ),
        ]);
      }

      // Filter out only unread messages
      if (rightfulSort === "UNREAD") {
        setSortedUsers([
          ...users?.filter(({ newestMessage: { seen, senderId } }) =>
            seen === true || senderId === myId ? false : true
          ),
        ]);
      }
    }
  }, [users, rightfulSort]);

  const cardProps = {
    active,
    setActive,
    type,
    friends,
    setFriends,
    myId,
  };

  const sortByProps = { type };

  return (
    <Flex {...styles.wrapper}>
      <Flex {...styles.bar}>
        <Heading {...styles.heading}>{title}</Heading>
        <SortBy {...sortByProps} />
      </Flex>

      {sortedUsers ? (
        <Flex {...styles.content}>
          {sortedUsers?.length ? (
            <Flex {...styles.cards}>
              <Flex {...styles.spaceBlock} />
              {sortedUsers?.map((user) => (
                <Card key={user.id} user={user} {...cardProps} />
              ))}
              <Flex {...styles.spaceBlock} />
            </Flex>
          ) : (
            <Flex {...styles.emptyList}>
              <Text>{messageIfEmpty}</Text>
            </Flex>
          )}
        </Flex>
      ) : (
        <Spinner {...styles.spinner} />
      )}
    </Flex>
  );
};

export { UserList };

// Styles

const styles = {
  wrapper: {
    zIndex: "0",
    direction: "column",
    // bg: "yellow",
    paddingTop: { base: "0", md: "1em" },
    minHeight: { base: "11vh", md: "20vh" },
  },
  bar: {
    position: "sticky",
    justify: "space-between",
    paddingX: { base: "1.5em", md: "15vw" },
  },
  heading: {
    fontSize: { base: "3xl", md: "4xl" },
  },
  content: {
    zIndex: "-1",
    justify: "center",
    marginX: "auto",
    width: "100%",
  },
  spaceBlock: {
    display: { base: "none", md: "flex" },
    minWidth: "15vw",
    height: "100%",
    pointerEvents: "none",
  },
  cards: {
    overflowX: "auto",
    paddingX: { base: "1em", md: "0" },
  },
  emptyList: {
    direction: "row",
    align: "center",
    justify: "center",
    background: "white",
    width: "100%",
    height: { base: "9em", md: "11em" },
    marginX: { base: "1.5em", md: "15vw" },
    marginTop: { base: "1em", md: "2em" },
    marginBottom: "2em",
  },
  spinner: {
    alignSelf: "center",
    color: "yellow.200",
  },
};

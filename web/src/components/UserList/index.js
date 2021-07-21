import { Flex, Heading, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { Card } from "../Card";
import { SortBy } from "../SortBy";

const UserList = ({ users, title, messageIfEmpty }) => {
  const [active, setActive] = useState(null);

  const cardProps = { active, setActive };

  return (
    <Flex {...styles.wrapper}>
      <Flex {...styles.bar}>
        <Heading {...styles.heading}>{title}</Heading>
        <SortBy />
      </Flex>

      <Flex {...styles.content}>
        {users?.length ? (
          <Flex {...styles.cards}>
            <Flex {...styles.spaceBlock} />
            {users?.map((user) => (
              <Card key={user.id} user={user} {...cardProps} />
            ))}
            <Flex {...styles.spaceBlock} />
          </Flex>
        ) : (
          <Text {...styles.emptyMessage}>{messageIfEmpty}</Text>
        )}
      </Flex>
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
  emptyMessage: {},
};

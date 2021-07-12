import { Avatar, Flex, Heading, Icon, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import {
  IoChevronBackSharp,
  IoChevronForwardSharp,
  IoPeopleSharp,
} from "react-icons/io5";

const NewUsers = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const users = [
    {
      id: "1",
      email: "pearson@pearson.com",
      name: "Jack Pearson",
      picture:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=668&q=80",
    },
    {
      id: "2",
      email: "pearson@pearson.com",
      name: "Andrea",
      picture:
        "https://images.unsplash.com/photo-1554151228-14d9def656e4?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFjZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    },
    {
      id: "3",
      email: "pearson@pearson.com",
      name: "Jack Pearson",
      picture:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=668&q=80",
    },
    {
      id: "4",
      email: "pearson@pearson.com",
      name: "Jack Pearson",
      picture:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=668&q=80",
    },
    {
      id: "5",
      email: "pearson@pearson.com",
      name: "Jack Pearson",
      picture:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=668&q=80",
    },
    {
      id: "6",
      email: "pearson@pearson.com",
      name: "Jack Pearson",
      picture:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=668&q=80",
    },
    {
      id: "7",
      email: "pearson@pearson.com",
      name: "Jack Pearson",
      picture:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=668&q=80",
    },
    {
      id: "8",
      email: "pearson@pearson.com",
      name: "Jack Pearson",
      picture:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=668&q=80",
    },
    {
      id: "9",
      email: "pearson@pearson.com",
      name: "Jack Pearson",
      picture:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=668&q=80",
    },
    {
      id: "10",
      email: "pearson@pearson.com",
      name: "Jack Pearson",
      picture:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=668&q=80",
    },
    {
      id: "11",
      email: "pearson@pearson.com",
      name: "Andrea",
      picture:
        "https://images.unsplash.com/photo-1554151228-14d9def656e4?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFjZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    },
    {
      id: "12",
      email: "pearson@pearson.com",
      name: "Jack Pearson",
      picture:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=668&q=80",
    },
    {
      id: "13",
      email: "pearson@pearson.com",
      name: "Jack Pearson",
      picture:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=668&q=80",
    },
    {
      id: "14",
      email: "pearson@pearson.com",
      name: "Jack Pearson",
      picture:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=668&q=80",
    },
    {
      id: "15",
      email: "pearson@pearson.com",
      name: "Jack Pearson",
      picture:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=668&q=80",
    },
    {
      id: "16",
      email: "pearson@pearson.com",
      name: "Jack Pearson",
      picture:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=668&q=80",
    },
    {
      id: "17",
      email: "pearson@pearson.com",
      name: "Jack Pearson",
      picture:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=668&q=80",
    },
    {
      id: "18",
      email: "pearson@pearson.com",
      name: "Jack Pearson",
      picture:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=668&q=80",
    },
  ];

  return (
    <Flex
      {...styles.wrapper}
      width={{ base: "100%", md: !isCollapsed ? "20vw" : "5vw" }}
      minWidth={!isCollapsed ? "15em" : "5em"}
    >
      <Flex {...styles.bar} onClick={() => setIsCollapsed(!isCollapsed)}>
        {isCollapsed ? (
          <Icon as={IoPeopleSharp} {...styles.icon} />
        ) : (
          <Heading {...styles.heading}>New users</Heading>
        )}

        {isCollapsed ? (
          <Icon as={IoChevronBackSharp} {...styles.icon} />
        ) : (
          <Icon
            as={IoChevronForwardSharp}
            onClick={() => setIsCollapsed(true)}
            {...styles.icon}
          />
        )}
      </Flex>

      <Flex {...styles.content}>
        {users.map(({ id, email, name, picture }) => {
          return (
            <Flex
              key={id}
              paddingX={{ base: "0.5em", md: isCollapsed ? "22%" : "2em" }}
              {...styles.card}
            >
              <Avatar src={picture} />
              {!isCollapsed && (
                <Flex {...styles.meta}>
                  <Text {...styles.name}>{name}</Text>
                  <Text {...styles.email}>{email}</Text>
                </Flex>
              )}
            </Flex>
          );
        })}
      </Flex>
    </Flex>
  );
};

export { NewUsers };

// Styles

const styles = {
  wrapper: {
    zIndex: "0",
    marginTop: { base: "0", md: "-3.5em" },
    direction: "column",
    height: { base: "5em", md: "100vh" },
    paddingTop: { base: "0", md: "1.25em" },
    bg: "gray.800",
    transition: "all 0.2s",
    boxShadow: { base: "none", md: "-3vw 0 10vw 5vw white" },
    minHeight: "calc(100% + 3.5em)",
  },
  bar: {
    display: { base: "none", md: "flex" },
    justify: "space-between",
    align: "center",
    width: "100%",
    paddingX: "1.5em",
    paddingY: "0.5em",
    cursor: "pointer",
  },
  icon: {
    color: "white",
    fontSize: "1.5em",
  },
  heading: {
    color: "white",
    size: "lg",
    letterSpacing: "tighter",
    isTruncated: true,
  },
  content: {
    direction: { base: "row", md: "column" },
    overflowX: "scroll",
    paddingTop: "1em",
    paddingLeft: { base: "0.5em", md: "0" },
  },
  card: {
    direction: "row",
    align: "center",
    paddingY: { base: "0", md: "0.5em" },
    width: "100%",
    cursor: "pointer",
    _hover: {
      background: { base: "transparent", md: "gray.700" },
    },
  },
  meta: {
    display: { base: "none", md: "block" },
    direction: "column",
    isTruncated: true,
    marginLeft: "1em",
  },
  name: {
    isTruncated: true,
    color: "white",
    // marginLeft: "1em",
    fontWeight: "600",
    letterSpacing: "tighter",
  },
  email: {
    isTruncated: true,
    color: "gray.300",
    fontWeight: "400",
    fontSize: "10pt",
    letterSpacing: "normal",
  },
};

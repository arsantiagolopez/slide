import { Flex, Heading, Icon, Image, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import {
  IoChevronBackSharp,
  IoChevronForwardSharp,
  IoPeopleSharp,
} from "react-icons/io5";
import { DetailedProfile } from "../DetailedProfile";

const NewUsers = ({
  users,
  height,
  active,
  setActive,
  friends,
  setFriends,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <Flex
      {...styles.wrapper}
      width={{ base: "100%", md: !isCollapsed ? "20vw" : "5vw" }}
      minWidth={!isCollapsed ? "15em" : "5em"}
      height={height}
    >
      <Flex {...styles.bar} onClick={() => setIsCollapsed(!isCollapsed)}>
        {isCollapsed ? (
          <Icon as={IoPeopleSharp} {...styles.icon} />
        ) : (
          <Heading {...styles.heading}>New Users</Heading>
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
        {users?.map((user) => {
          const detailedProfileProps = {
            user,
            active,
            setActive,
            friends,
            setFriends,
          };

          const isPictureGradient = user.picture.includes("linear-gradient");

          return (
            <Flex
              key={user.id}
              paddingX={{ base: "0.5em", md: isCollapsed ? "22%" : "2em" }}
              onClick={() => setActive(user.id)}
              {...styles.card}
            >
              {isPictureGradient ? (
                <Flex background={user.picture} {...styles.avatar} />
              ) : (
                <Image src={user.picture} {...styles.avatar} />
                // <Avatar src={user.picture} />
              )}

              {!isCollapsed && (
                <Flex {...styles.meta}>
                  <Text {...styles.name}>{user.name}</Text>
                  <Text {...styles.email}>{user.email}</Text>
                </Flex>
              )}
              <DetailedProfile {...detailedProfileProps} />
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
    display: { base: "none", md: "flex" },
    zIndex: 1,
    direction: "column",
    marginTop: "-3.5em",
    paddingTop: "1.25em",
    background: "gray.800",
    transition: "all 0.2s",
    boxShadow: "-3vw 0 10vw 5vw white",
    minHeight: "calc(100% + 3.5em)",
  },
  bar: {
    justify: "space-between",
    align: "center",
    width: "100%",
    height: "3em",
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
    isTruncated: true,
  },
  content: {
    overflow: "auto",
    direction: "column",
  },
  card: {
    direction: "row",
    align: "center",
    paddingY: "0.5em",
    height: "4em",
    width: "100%",
    cursor: "pointer",
    _hover: {
      background: "gray.700",
    },
  },
  avatar: {
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    borderRadius: "50%",
    objectFit: "cover",
    boxSize: "3em",
    minWidth: "3em",
  },
  meta: {
    direction: "column",
    isTruncated: true,
    marginLeft: "1em",
  },
  name: {
    isTruncated: true,
    color: "white",
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

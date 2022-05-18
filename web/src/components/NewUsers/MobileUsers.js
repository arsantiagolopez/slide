import {
  Drawer,
  DrawerContent,
  Flex,
  Icon,
  Image,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { IoArrowForwardSharp, IoPeopleSharp } from "react-icons/io5";
import { DetailedProfile } from "../DetailedProfile";

const MobileUsers = ({ users, active, setActive, friends, setFriends }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Flex {...styles.wrapper}>
      {/* Drawer trigger */}
      <Icon as={IoPeopleSharp} onClick={onToggle} {...styles.icon} />

      <Drawer isOpen={isOpen} onClose={onToggle} {...styles.drawer}>
        <DrawerContent {...styles.content}>
          {/* Header */}
          <Flex onClick={onToggle} {...styles.bar}>
            <Flex {...styles.header}>New Users</Flex>

            <Icon as={IoArrowForwardSharp} {...styles.icon} />
          </Flex>

          <Flex {...styles.users}>
            {users?.map((user) => {
              const detailedProfileProps = {
                user,
                active,
                setActive,
                friends,
                setFriends,
              };

              const isPictureGradient =
                user.picture.includes("linear-gradient");

              return (
                <Flex
                  key={user.id}
                  onClick={() => setActive(user.id)}
                  {...styles.card}
                >
                  {isPictureGradient ? (
                    <Flex background={user.picture} {...styles.avatar} />
                  ) : (
                    <Image src={user.picture} {...styles.avatar} />
                  )}

                  <Flex {...styles.meta}>
                    <Text {...styles.name}>{user.name}</Text>
                    <Text {...styles.email}>{user.email}</Text>
                  </Flex>

                  <DetailedProfile {...detailedProfileProps} />
                </Flex>
              );
            })}
          </Flex>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};

export { MobileUsers };

// Styles

const styles = {
  wrapper: {
    zIndex: 10,
    display: { base: "block", md: "none" },
    position: "absolute",
    right: 0,
    marginTop: "-3.5em",
    transition: "all 0.2s",
  },
  drawer: {
    placement: "right",
  },
  content: {
    maxWidth: "100%",
    background: "white",
    paddingX: "1em",
    paddingTop: "5vh",
  },
  bar: {
    justify: "space-between",
    width: "100%",
    paddingX: "0.5em",
    paddingBottom: "1em",
  },
  icon: {
    fontSize: "1.5em",
    margin: "0.6em",
    color: "gray.800",
  },
  header: {
    direction: "row",
    justify: "space-between",
    align: "center",
    width: "100%",
    fontSize: "2em",
    fontWeight: "bold",
    letterSpacing: "-1px",
    color: "gray.800",
    isTruncated: true,
  },
  body: {
    zIndex: 1000,
    direction: "column",
    justify: "flex-start",
    align: "center",
    height: "100%",
    width: "100%",
    paddingX: "2em",
  },
  users: {
    overflow: "auto",
    direction: "column",
    paddingBottom: "2em",
  },
  card: {
    direction: "row",
    align: "center",
    paddingY: "0.5em",
    paddingX: "0.5em",
    height: "4em",
    width: "100%",
    cursor: "pointer",
    _hover: {
      background: "gray.100",
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
    color: "gray.800",
    fontWeight: "600",
    letterSpacing: "tighter",
  },
  email: {
    isTruncated: true,
    color: "gray.400",
    fontWeight: "400",
    fontSize: "10pt",
    letterSpacing: "normal",
  },
};

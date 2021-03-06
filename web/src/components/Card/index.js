import { Avatar, Flex, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { DetailedProfile } from "../DetailedProfile";

const Card = ({ user, active, setActive, type, friends, setFriends, myId }) => {
  const { id, name, picture, newestMessage } = user || {};

  const isPictureGradient = picture?.includes("linear-gradient");

  const getFirstName = (name) => name?.split(" ")[0];

  const router = useRouter();

  // Navigate to messages if clicked,
  // open detailed preview otherwise
  const handleClick = () => {
    if (type === "CONVERSATIONS") {
      return router.push({
        pathname: "/messages",
        query: { user: id },
      });
    }
    return setActive(id);
  };

  const hasNewMessage =
    type === "CONVERSATIONS" &&
    newestMessage?.seen === false &&
    newestMessage?.senderId !== myId;

  const detailedProfileProps = {
    user,
    active,
    setActive,
    friends,
    setFriends,
  };

  return (
    <Flex
      onClick={handleClick}
      transform={active === id && "scale(1.1)"}
      {...styles.cardWrapper}
    >
      {isPictureGradient ? (
        <Flex background={picture} {...styles.avatar} />
      ) : (
        <Avatar src={picture} {...styles.avatar} />
      )}

      <Flex {...styles.nameContainer}>
        <Heading {...styles.name}>{getFirstName(name)}</Heading>
      </Flex>

      {
        // Don't open the modal for conversations
        type !== "conversations" && (
          <DetailedProfile {...detailedProfileProps} />
        )
      }

      {
        // Show new message notification only on conversations
        hasNewMessage && <Flex {...styles.newMessageNotification} />
      }
    </Flex>
  );
};

export { Card };

// Styles

const styles = {
  // Card
  cardWrapper: {
    direction: "column",
    justify: "center",
    align: "center",
    background: "white",
    width: { base: "120px", md: "140px" },
    height: { base: "9em", md: "11em" },
    paddingX: "1em",
    marginTop: { base: "1em", md: "2em" },
    marginBottom: "2em",
    marginX: { base: "0.25em", md: "0.5em" },
    borderRadius: "1.5em",
    boxShadow: "lg",
    cursor: "pointer",
    transition: "all 0.3s",
    _hover: {
      transform: "scale(1.1)",
    },
    style: {
      backdropFilter: "blur(5px)",
    },
  },
  avatar: {
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    borderRadius: "50%",
    objectFit: "cover",
    boxSize: { base: "4em", md: "5em" },
    width: { base: "5em", md: "6em" },
    height: { base: "5em", md: "6em" },
  },
  nameContainer: {
    maxWidth: { base: "5em", md: "6em" },
    isTruncated: true,
  },
  name: {
    isTruncated: true,
    fontSize: { base: "1.25em", md: "1.5em" },
    paddingY: "0.5rem",
    paddingRight: "1",
    borderBottom: "3px solid black",
  },
  newMessageNotification: {
    position: "absolute",
    top: "1em",
    right: "0.5em",
    boxSize: "3",
    borderRadius: "full",
    bg: "green.400",
  },
};

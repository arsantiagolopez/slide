import { Avatar, Flex, Heading } from "@chakra-ui/react";
import React from "react";
import { DetailedProfile } from "../DetailedProfile";

const Card = ({ user, active, setActive }) => {
  const { id, email, name, picture } = user;

  const getFirstName = (name) => name.split(" ")[0];

  const detailedProfileProps = { user, active, setActive, getFirstName };

  return (
    <Flex
      onClick={() => setActive(id)}
      transform={active === id && "scale(1.1)"}
      {...styles.wrapper}
    >
      <Avatar src={picture} {...styles.avatar} />

      <Flex {...styles.nameContainer}>
        <Heading {...styles.name}>{getFirstName(name)}</Heading>
      </Flex>

      <DetailedProfile {...detailedProfileProps} />
    </Flex>
  );
};

export { Card };

// Styles

const styles = {
  wrapper: {
    background: "white",
    direction: "column",
    justify: "center",
    align: "center",
    width: { base: "9em", md: "9em" },
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
    boxSize: { base: "4em", md: "5em" },
  },
  nameContainer: {
    maxWidth: { base: "5em", md: "6em" },
    isTruncated: true,
  },
  name: {
    isTruncated: true,
    fontSize: { base: "1.25em", md: "1.5em" },
    paddingY: "0.5rem",
    borderBottom: "3px solid black",
  },
};

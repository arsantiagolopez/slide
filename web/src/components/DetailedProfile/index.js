import {
  Button,
  Flex,
  Heading,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { FaUserCheck } from "react-icons/fa";
import { SiMinutemailer } from "react-icons/si";

const DetailedProfile = ({
  user: { id, email, name, picture },
  active,
  setActive,
  getFirstName,
}) => {
  return (
    <Modal
      isCentered
      isOpen={active === id}
      onClose={() => setActive(null)}
      {...styles.wrapper}
    >
      <ModalOverlay />
      <ModalContent {...styles.content} backgroundImage={`url(${picture})`}>
        <ModalCloseButton {...styles.closeButton} />

        <ModalBody {...styles.body}>
          <Flex {...styles.meta}>
            <Heading {...styles.title}>{name}</Heading>

            <Text {...styles.email}>{email}</Text>

            {/* Action control */}
            <Flex {...styles.actions}>
              {
                // TODO: isFollowing ? show +user : show -user
              }
              <IconButton
                aria-label="Add/remove friend"
                icon={<FaUserCheck />}
                {...styles.button}
                {...styles.interactButton}
              />
              <Button
                leftIcon={<SiMinutemailer />}
                {...styles.button}
                {...styles.messageButton}
              >
                Send a message
              </Button>
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export { DetailedProfile };

// Styles

const styles = {
  wrapper: {},
  content: {
    height: { base: "100%", md: "70vh" },
    borderRadius: { base: "0", md: "1.5em" },
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  closeButton: {
    color: "white",
  },
  body: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    boxShadow: "inset 0 -30vh 30vh -15vh black",
    borderRadius: { base: "0", md: "1.5em" },
  },
  title: {
    isTruncated: true,
    color: "white",
    letterSpacing: "tighter",
    size: "3xl",
  },
  meta: {
    direction: "column",
    maxWidth: "100%",
    paddingY: { base: "2em", md: "1em" },
  },
  email: {
    isTruncated: true,
    color: "white",
    size: "lg",
  },
  actions: {
    direction: "row",
    height: "4em",
    marginTop: "1em",
  },
  button: {
    borderRadius: "0.75em",
    background: "rgba(230,230,230,0.1)",
    style: {
      backdropFilter: "blur(3px)",
    },
  },
  interactButton: {
    width: { base: "3em", md: "4em" },
  },
  messageButton: {
    marginX: "3",
    width: "100%",
  },
};

import { Button, Flex, Heading, Icon, Image, Textarea } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoArrowBackSharp } from "react-icons/io5";
import { useMutation } from "urql";
import { MessageContext } from "../../context/MessageContext";
import { CreateMessage as CreateMessageMutation } from "../../graphql/mutations/message";
import { useDelay } from "../../utils/useDelay";
import { Bubbles } from "./Bubbles";

/***********************************************************************
 *
 *    Main
 *
 ***********************************************************************/

const Messages = () => {
  const [isBoardOpen, setIsBoardOpen] = useState(true);

  const {
    activeMessage,
    setActiveMessage,
    recipientId,
    setRecipientId,
    liveMessage,
    refetchConversations,
  } = useContext(MessageContext);

  // Set active recipient & handle mobile animation
  useEffect(() => {
    if (activeMessage) {
      const { user } = activeMessage;
      setRecipientId(user?.id);
      // Opens mobile message board full screen
      setIsBoardOpen(true);
    }
  }, [activeMessage]);

  const topSectionProps = { activeMessage, setActiveMessage, setIsBoardOpen };
  const bottomSectionProps = { recipientId, liveMessage, refetchConversations };

  return (
    <Flex {...styles.wrapper}>
      {/* 
          Hide content on null activeMessage &
          custom transition/animation on mobile
       */}
      <Flex
        {...styles.content}
        display={{
          base: "flex",
          md: activeMessage ? "flex" : "none",
        }}
        transform={{
          base: isBoardOpen ? "translateX(0%)" : "translateX(100%)",
          md: "none",
        }}
      >
        {/* Recipient info (top section) */}
        <TopSection {...topSectionProps} />

        {/* Message bubbles (middle section) */}
        <Bubbles />

        {/* Message input (bottom section) */}
        <BottomSection {...bottomSectionProps} />
      </Flex>
    </Flex>
  );
};

/***********************************************************************
 *
 *    Top Section
 *
 ***********************************************************************/

const TopSection = ({ activeMessage, setActiveMessage, setIsBoardOpen }) => {
  const { user } = activeMessage || {};
  const { name, picture } = user || {};
  const firstName = name?.split(" ")[0];

  // Custom mobile slideIn & out animation
  const handleBoardDisplay = async () => {
    setIsBoardOpen(false);
    // Wait for screen to slide out, then set display to none
    await useDelay(100);
    // 100 miliseconds is congruent with boardContent transition duration
    setActiveMessage(null);
  };

  const isPictureGradient = picture?.includes("linear-gradient");

  return (
    <Flex {...styles.userContainer}>
      <Flex {...styles.nameContainer}>
        <Button
          {...styles.returnButton}
          _hover={{ bg: "none" }}
          onClick={handleBoardDisplay}
          display={{ base: "flex", md: "none" }}
        >
          <Icon as={IoArrowBackSharp} boxSize={{ base: "7", md: "10" }} />
        </Button>

        <Heading {...styles.name}>{firstName}</Heading>
      </Flex>

      <Flex {...styles.avatar}>
        {isPictureGradient ? (
          <Flex background={picture} {...styles.picture} />
        ) : (
          <Image src={picture} {...styles.picture} />
        )}
      </Flex>
    </Flex>
  );
};

/***********************************************************************
 *
 *    Bottom Section
 *
 ***********************************************************************/

const BottomSection = ({ recipientId, liveMessage, refetchConversations }) => {
  const [inputValue, setInputValue] = useState("");
  const [{ data }, createMessageMutation] = useMutation(CreateMessageMutation);

  const { setError } = useForm();

  const handleChange = (event) => setInputValue(event.target.value);

  const handleCreateMessage = async () => {
    if (!inputValue) return;

    const { data } = await createMessageMutation({
      input: {
        recipientId,
        body: inputValue,
      },
    });

    // Reset input field
    setInputValue("");

    // If no errors, data will be undefined
    if (data?.createMessage.errors) {
      // Set custom errors based on backend
      const createMessageErrors = data.createMessage.errors;
      createMessageErrors.map((error) => {
        const { field, message } = error;
        setError(field, { type: "manual", message });
      });
    }
  };

  // Refetch on initial subscription
  useEffect(() => {
    if (data?.createMessage?.success && !liveMessage) {
      refetchConversations();
    }
  }, [liveMessage, data]);

  // Listen & send message when the enter key is pressed
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleCreateMessage();
    }
  };

  return (
    <Flex {...styles.textareaContainer}>
      <Textarea
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Type something"
        {...styles.messageTextarea}
      />

      <Button
        type="submit"
        onClick={handleCreateMessage}
        {...styles.sendButton}
      >
        Send
      </Button>
    </Flex>
  );
};

export { Messages };

// Styles

const styles = {
  wrapper: {
    direction: "column",
    width: "100%",
    background: {
      base: "none",
      md: "linear-gradient(90deg, rgba(0,0,0,0.02) 0%, transparent 20%)",
    },
    marginBottom: "0",
    overflow: "hidden",
  },
  content: {
    direction: "column",
    width: "100%",
    height: "100%",
    transition: "transform 0.2s ease-in-out",
  },
  textareaContainer: {
    width: "100%",
    minHeight: { base: "7em", md: "min(8em, 20vh)" },
    maxHeight: "25vh",
    borderTop: "1px solid rgba(150,150,150,0.1)",
  },
  messageTextarea: {
    resize: "none",
    border: "none",
    paddingX: { base: "1em", md: "2em" },
    paddingY: "1em",
    maxHeight: "100%",
    _focus: {
      border: "none",
      borderTop: "2px solid gray.800",
    },
  },
  sendButton: {
    variant: "ghost",
    marginY: { base: "2", md: "1" },
    height: "40%",
  },
  userContainer: {
    justify: "space-between",
    align: "center",
    minHeight: { base: "4em", md: "min(6em, 20vh)" },
    paddingX: { base: "1em", md: "2em" },
    marginTop: "3em",
  },
  nameContainer: {
    align: "center",
    marginLeft: { base: "-1em", md: "0" },
  },
  returnButton: {
    variant: "ghost",
    padding: "0",
    justify: "center",
  },
  name: {
    fontSize: { base: "26pt", md: "min(42pt, 3.5em)" },
    noOfLines: 1,
    paddingRight: "2",
  },
  avatar: {
    minWidth: "2em",
  },
  picture: {
    zIndex: "99",
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    borderRadius: "50%",
    objectFit: "cover",
    width: { base: "4em", md: "5em" },
    height: { base: "4em", md: "5em" },
  },
};

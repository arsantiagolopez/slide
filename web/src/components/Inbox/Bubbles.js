import { Flex, Text } from "@chakra-ui/react";
import moment from "moment";
import React, { useContext, useEffect, useRef, useState } from "react";
import { MessageContext } from "../../context/MessageContext";

const Bubbles = () => {
  const [activeConversation, setActiveConversation] = useState(null);
  const [lastMessage, setLastMessage] = useState(null);
  const { activeMessage, messageList, activeTimestamp, setActiveTimestamp } =
    useContext(MessageContext);

  const scrollBoardRef = useRef(null);

  let days = [];

  // Keep newest message on screen
  const scrollToEnd = () => {
    let scrollRef = scrollBoardRef.current;
    if (scrollRef) {
      scrollRef.scrollTop = scrollRef.scrollHeight;
    }
  };

  // Update conversation on list update
  useEffect(() => {
    if (activeMessage && messageList) {
      const { id } = activeMessage?.user;

      const conversation = messageList?.find(({ user }) => user.id === id);

      // Return if user doesn't have messages with active user
      if (!conversation) {
        return setActiveConversation([]);
      }

      const { messages } = conversation;
      setActiveConversation(messages);

      // Update active message timestamp
      const { id: messageId } = messages[0];
      setActiveTimestamp(messageId);

      // Store last message of conversation
      const last = messages[messages.length - 1];
      setLastMessage(last);
    } else {
      setActiveConversation(null);
      setLastMessage(null);
    }
  }, [activeMessage, messageList]);

  // Keep list scrolled to bottom
  useEffect(() => {
    scrollToEnd();
  }, [activeMessage, activeConversation]);

  // Toggle timestamp
  const handleBubbleClick = (messageId) => {
    // On first bubble click, show timestamp, on second, hide
    if (activeTimestamp === messageId) setActiveTimestamp(null);
    else setActiveTimestamp(messageId);
  };

  // Categorize messages by days, only show date once
  const isNewDay = (timestamp) => {
    // Convert timestamp to date format mm/dd/yyyy
    const timestampToDate = moment(timestamp).format("L");

    if (days.length < 1) {
      days.push(timestampToDate);
      return false;
    }

    if (!days.includes(timestampToDate)) return days.push(timestampToDate);
    else return false;
  };

  return (
    <Flex {...styles.messageBoard} ref={scrollBoardRef}>
      {/* Message bubbles container */}
      <Flex {...styles.messagesWrapper}>
        {activeMessage &&
          activeConversation?.map((message) => {
            const {
              id: messageId,
              senderId,
              createdAt: timestamp,
              body,
            } = message;
            const recipientId = activeMessage?.user.id;
            const isRecipient = recipientId === senderId ? true : false;
            const isTimestampActive = activeTimestamp === messageId;
            const parsedTimestamp = parseInt(timestamp);
            const formattedTimestamp = moment(parsedTimestamp).format("LL");
            const isLastMessage = message === lastMessage;
            return (
              // Text horizontal full with container
              <Flex key={messageId} direction="column" width="100%">
                {
                  // Last messages always display the date
                  isLastMessage && (
                    <Text {...styles.newDayDivider}>{formattedTimestamp}</Text>
                  )
                }

                {/* Possible new day divider */}
                {isNewDay(parsedTimestamp) && (
                  <Text {...styles.newDayDivider}>{formattedTimestamp}</Text>
                )}

                {/* Message bubble */}
                <Flex
                  {...styles.messageBubble}
                  background={isRecipient ? "brand" : "gray.100"}
                  color={isRecipient ? "white" : "gray.800"}
                  marginLeft={isRecipient ? "0" : "auto"}
                  marginRight={isRecipient ? "auto" : "0"}
                  borderRadius={isRecipient ? "1em 1em 1em 0" : "1em 1em 0 1em"}
                  onClick={() => handleBubbleClick(messageId)}
                >
                  <Text>{body}</Text>
                </Flex>

                {/* Timestamp (show/hide on click) */}
                {isTimestampActive && (
                  <Text
                    {...styles.messageTimestamp}
                    marginLeft={isRecipient ? "0" : "auto"}
                    marginRight={isRecipient ? "auto" : "0"}
                  >
                    {moment(parsedTimestamp).format("LT")}
                  </Text>
                )}
              </Flex>
            );
          })}
      </Flex>
    </Flex>
  );
};

export { Bubbles };

// Styles
const styles = {
  messageBoard: {
    direction: "row",
    align: "center",
    justify: "space-between",
    flex: "auto",
    width: "100%",
    overflowY: "scroll",
    paddingLeft: { base: "none", md: "2em" },
    paddingBottom: { base: "2", md: "1em" },
  },
  messagesWrapper: {
    direction: "column-reverse",
    marginTop: "auto",
    width: "100%",
    // bg: "yellow.100",
  },
  newDayDivider: {
    marginX: "auto",
    color: "gray.700",
    fontSize: "10pt",
    marginY: "2",
  },
  messageBubble: {
    align: "center",
    justify: "center",
    minHeight: "2em",
    paddingY: "2",
    paddingX: "1em",
    marginY: { base: "1", md: "2" },
    maxWidth: "80%",
    // animation: "fadeSlideUp 0.2s ease-in-out",
  },
  messageTimestamp: {
    fontSize: "8pt",
    textTransform: "uppercase",
    color: "gray.300",
    marginTop: "-1",
    animation: "fadeSlideUp 0.2s ease-in-out",
  },
};

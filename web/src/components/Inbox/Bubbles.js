import { Flex, Text } from "@chakra-ui/react";
import moment from "moment";
import React, { useContext, useEffect, useRef } from "react";
import { MessageContext } from "../../context/MessageContext";
import { useDelay } from "../../utils/useDelay";

const Bubbles = ({ timestampDaysArr }) => {
  const {
    activeMessage,
    activeConversation,
    activeTimestamp,
    setActiveTimestamp,
  } = useContext(MessageContext);

  const scrollBoardRef = useRef(null);

  // Keep newest message on screen
  const scrollToEnd = () => {
    let scrollRef = scrollBoardRef.current;
    if (scrollRef) {
      scrollRef.scrollTop = scrollRef.scrollHeight;
    }
  };

  // Keep list scrolled to bottom
  useEffect(async () => {
    await useDelay(50);
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

    const dayInArr = timestampDaysArr.find((date) => date === timestampToDate);

    if (dayInArr) return false;
    else return timestampDaysArr.push(timestampToDate);
  };

  return (
    <Flex {...styles.messageBoard} ref={scrollBoardRef}>
      {/* Message bubbles container */}
      <Flex {...styles.messagesWrapper}>
        {activeMessage &&
          activeConversation?.map(
            ({ id: messageId, senderId, createdAt: timestamp, body }) => {
              const recipientId = activeMessage?.recipientInfo.userId;

              const isRecipient = recipientId === senderId ? true : false;

              const isTimestampActive = activeTimestamp === messageId;
              const parsedTimestamp = parseInt(timestamp);
              const formattedTimestamp = moment(parsedTimestamp).format("LL");

              return (
                // Text horizontal full with container
                <Flex key={messageId} direction="column" width="100%">
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
                    borderRadius={
                      isRecipient ? "1em 1em 1em 0" : "1em 1em 0 1em"
                    }
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
            }
          )}
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
    direction: "column",
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
    paddingY: "3",
    paddingX: "1em",
    marginY: "2",
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

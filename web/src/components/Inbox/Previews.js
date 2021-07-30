import { Button, Flex, Image, Text } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { MessageContext } from "../../context/MessageContext";
import { formatTimestamp } from "../../utils/formatTimestamp";
import { Draggable } from "../Draggable";
import { SwipeToDelete } from "../SwipeToDelete";
import { SwipeToDeleteDndContext } from "../SwipeToDeleteDndContext";

const Previews = () => {
  const [activeDelete, setActiveDelete] = useState(null);
  const [activeTransform, setActiveTransform] = useState(null);

  const {
    myId,
    messageList,
    activeMessage,
    setActiveMessage,
    previews,
    setPreviews,
    setPreviewsCopy,
  } = useContext(MessageContext);

  // Create & update lighter previews object with only newest message
  useEffect(async () => {
    if (messageList) {
      let previews = messageList.map(({ conversation, ...otherUserProps }) => {
        const lastItem = conversation.length - 1;
        const { createdAt, seen, senderId, ...newestMessageProps } =
          conversation[lastItem];

        return {
          ...otherUserProps,
          newestMessage: {
            // If last message sent by me, automatically seen
            seen: senderId === myId ? true : seen,
            timestamp: createdAt,
            senderId,
            ...newestMessageProps,
          },
        };
      });

      // Sort messages from newest to oldest
      previews.sort((a, b) =>
        a.newestMessage.timestamp < b.newestMessage.timestamp ? 1 : -1
      );

      // Update previews
      setPreviews(previews);

      // Update previews copy (for search functionality)
      setPreviewsCopy(previews);
    }
  }, [messageList]);

  const swipeToDeleteDndContextProps = { setActiveDelete, setActiveTransform };

  return (
    <Flex {...styles.wrapper}>
      <SwipeToDeleteDndContext {...swipeToDeleteDndContextProps}>
        {previews?.map((item) => {
          const {
            recipientInfo: {
              userId: recipientId,
              picture: recipientImg,
              name: recipientName,
            },
            newestMessage: { body, timestamp, seen },
          } = item;

          const isPictureGradient = recipientImg.includes("linear-gradient");

          const formattedTimestamp = formatTimestamp(timestamp, "fromNow");

          const swipeToDeleteProps = {
            recipientId,
            activeDelete,
            setActiveDelete,
            activeTransform,
            previews,
            setPreviews,
          };

          const handleToggleActive = () => {
            // Set to active if no current active
            if (!activeMessage) setActiveMessage(item);
            // Set to null if same preview clicked
            else if (activeMessage === item) setActiveMessage(null);
            // Update clicked to active
            else setActiveMessage(item);
          };

          return (
            // Delete logic in SwipeToDelete component
            <SwipeToDelete key={recipientId} {...swipeToDeleteProps}>
              <Draggable
                key={recipientId}
                id={recipientId}
                styles={styles.draggablePreview}
                activeTransform={activeTransform}
              >
                <Button
                  onClick={handleToggleActive}
                  background={
                    activeMessage?.recipientInfo?.userId === recipientId
                      ? "gray.100"
                      : "white"
                  }
                  {...styles.button}
                >
                  {/* Contact image */}
                  <Flex {...styles.imageContainer}>
                    {isPictureGradient ? (
                      <Flex
                        background={recipientImg}
                        boxShadow={
                          seen
                            ? "none"
                            : {
                                base: "0 0 0 3px #48BB78",
                                md: "0 0 0 2px #48BB78",
                              }
                        }
                        {...styles.image}
                      />
                    ) : (
                      <Image
                        src={recipientImg}
                        boxShadow={
                          seen
                            ? "none"
                            : {
                                base: "0 0 0 3px #48BB78",
                                md: "0 0 0 2px #48BB78",
                              }
                        }
                        {...styles.image}
                      />
                    )}
                  </Flex>

                  {/* Contact metadata */}
                  <Flex {...styles.meta}>
                    {/* Name, message preview & timestamp */}
                    <Flex {...styles.previewContainer}>
                      {/* Name & timestamp */}
                      <Flex {...styles.topLineContainer}>
                        <Text {...styles.contactName}>{recipientName}</Text>
                        <Text {...styles.timestamp}>{formattedTimestamp}</Text>
                      </Flex>

                      {/* Message preview */}
                      <Text {...styles.preview} isTruncated>
                        {body}
                      </Text>
                    </Flex>
                  </Flex>
                </Button>
              </Draggable>
            </SwipeToDelete>
          );
        })}
      </SwipeToDeleteDndContext>
    </Flex>
  );
};

export { Previews };

// Styles
const styles = {
  wrapper: {
    direction: "column",
    align: "center",
    height: "100%",
    width: "100%",
    overflowY: "auto",
    overflowX: "hidden",
    paddingY: { base: "1em", md: "1" },
  },
  draggablePreview: {
    minWidth: "100%",
    padding: "0",
  },
  button: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    variant: "ghost",
    paddingX: "0",
    height: { base: "5em", md: "4em" },
    minHeight: { base: "5em", md: "4em" },
    width: "100%",
    overflow: "hidden",
  },
  meta: {
    width: { base: "73%", md: "70%" },
    minWidth: { base: "73%", md: "70%" },
    maxWidth: { base: "73%", md: "70%" },
    direction: "row",
    justify: "space-between",
    height: "100%",
    marginX: { base: "4", md: "1em" },
    marginLeft: { base: "3", md: "4" },
    paddingY: "3",
    fontWeight: "normal",
  },
  previewContainer: {
    direction: "column",
    justify: "space-around",
    align: "flex-start",
    width: "100%",
    overflowX: "hidden",
  },
  topLineContainer: {
    direction: "row",
    align: "center",
    justify: "space-between",
    width: "100%",
  },
  contactName: {
    fontSize: "12pt",
    fontWeight: "500",
    color: "gray.700",
  },
  timestamp: {
    fontSize: "9pt",
    letterSpacing: "-0.5px",
    color: "lightgray",
  },
  preview: {
    fontSize: "10pt",
    color: "lightgray",
    maxWidth: "100%",
  },
  imageContainer: {
    justify: "center",
    align: "center",
    width: { base: "4em", md: "3em" },
    minWidth: { base: "4em", md: "3em" },
    marginLeft: { base: "1", md: "2" },
  },
  image: {
    objectFit: "cover",
    width: { base: "4em", md: "3em" },
    height: { base: "4em", md: "3em" },
    borderRadius: "full",
  },
};

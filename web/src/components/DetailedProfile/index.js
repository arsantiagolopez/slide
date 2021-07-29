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
import { useRouter } from "next/router";
import React from "react";
import { FaUserPlus, FaUserTimes } from "react-icons/fa";
import { SiMinutemailer } from "react-icons/si";
import { useMutation } from "urql";
import {
  FollowUser as FollowUserMutation,
  UnfollowUser as UnfollowUserMutation,
} from "../../graphql/mutations/user";
import { showToast } from "../../utils/showToast";

const DetailedProfile = ({ user, active, setActive, friends, setFriends }) => {
  const { id, email, name, picture, isFriend } = user;
  const [, followUserMutation] = useMutation(FollowUserMutation);
  const [, unfollowUserMutation] = useMutation(UnfollowUserMutation);

  const isPictureGradient = picture.includes("linear-gradient");

  const router = useRouter();

  /**
   * Show toast based on error or success response.
   * @param {object} data - follow/unfollow mutation response.
   * @param {boolean} isFriend - true if isFriend, false if not.
   * @returns true if successful, false if any error thrown.
   */
  const handleResponse = (data, isFriend) => {
    const secondLevel = isFriend ? "unfollowUser" : "followUser";
    const errors = data?.[secondLevel]?.errors;
    const successMessage = isFriend
      ? `${name} is no longer your friend.`
      : `${name} is now your friend!`;

    // Errors all show red toasts
    if (errors) {
      const errorMessage = errors[0]?.message;
      showToast({
        status: "error",
        title: errorMessage,
      });

      return false;
    }

    // Show red toast on unfriend, green on befriend
    showToast({
      status: isFriend ? "error" : "success",
      title: successMessage,
    });

    return true;
  };

  // Add or Remove friend
  const handleFriendAction = async () => {
    // Follow if they aren't friends
    if (!isFriend) {
      const { data } = await followUserMutation({ id });
      const success = handleResponse(data, isFriend);

      if (!success) return;

      // Add friend
      const updatedFriends = [...friends, { ...user, isFriend: true }];

      setFriends(updatedFriends);
    }
    // Unfollow if they are
    else {
      const { data } = await unfollowUserMutation({ id });
      const success = handleResponse(data, isFriend);

      if (!success) return;

      // Remove friend
      const updatedFriends = friends?.filter((friend) => friend.id !== id);

      setFriends(updatedFriends);

      // Close modal
      setActive(null);
    }
  };

  // Navigate to message panel with user clicked
  const handleSendMessage = () =>
    router.push({
      pathname: "/messages",
      query: { user: id },
    });

  return (
    <Modal
      isCentered
      isOpen={active === id}
      onClose={() => setActive(null)}
      {...styles.wrapper}
    >
      <ModalOverlay />
      <ModalContent
        {...styles.content}
        backgroundImage={isPictureGradient ? picture : `url(${picture})`}
      >
        <ModalCloseButton {...styles.closeButton} />

        <ModalBody {...styles.body}>
          <Flex {...styles.meta}>
            <Heading {...styles.title}>{name}</Heading>

            <Text {...styles.email}>{email}</Text>

            {/* Action control */}
            <Flex {...styles.actions}>
              {isFriend ? (
                <IconButton
                  onClick={handleFriendAction}
                  aria-label={`Unfriend ${name}`}
                  icon={<FaUserTimes />}
                  _hover={{ bg: "red.400" }}
                  _active={{ bg: "red.500" }}
                  {...styles.button}
                  {...styles.interactButton}
                />
              ) : (
                <IconButton
                  onClick={handleFriendAction}
                  aria-label="Add friend"
                  icon={<FaUserPlus />}
                  _hover={{ bg: "green.500" }}
                  _active={{ bg: "green.200" }}
                  {...styles.button}
                  {...styles.interactButton}
                />
              )}

              <Button
                onClick={handleSendMessage}
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

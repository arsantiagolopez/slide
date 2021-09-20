import { Button, Flex, useDisclosure } from "@chakra-ui/react";
import React from "react";
import { IoTrashOutline } from "react-icons/io5";
import { useMutation } from "urql";
import { ArchiveConversation as ArchiveConversationMutation } from "../../graphql/mutations/message";
import { showToast } from "../../utils/showToast";
import { AlertDialog } from "../AlertDialog";

const SwipeToDelete = ({
  children,
  recipientId,
  activeDelete,
  setActiveDelete,
  activeTransform,
  previews,
  setPreviews,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [, archiveConversationMutation] = useMutation(
    ArchiveConversationMutation
  );

  // Get confirmation before committing to deletion
  const getDeleteConfirmation = () => onOpen();

  // Show success toast
  const handleSuccess = () =>
    showToast({
      status: "success",
      title: "Conversation was succesfully removed!",
    });

  const handleErrors = (error) => {
    // Manually set errors
    const { field, message } = error;
    setError(field, { type: "manual", message });

    // Show error warning
    showToast({ status: "error", title: message });
  };

  // Once confirmed, run
  const onConfirmedDelete = async () => {
    const { data } = await archiveConversationMutation({ userId: recipientId });

    // Handle errors & notifications
    if (data && data.archiveConversation.errors) {
      const error = data.archiveConversation.errors[0];
      handleErrors(error);
    } else {
      // Succesful removal
      handleSuccess();

      // Update active delete
      setActiveDelete(null);

      // Update message previews
      const nonArchivedPreviews = previews.filter(
        ({ user: { id } }) => id !== recipientId
      );

      setPreviews(nonArchivedPreviews);
    }
  };

  const isActivePreview = activeDelete === recipientId;
  const staysLeft = activeTransform && activeTransform.id === recipientId;

  return (
    <Flex {...styles.wrapper}>
      {children}

      {/* Delete logic */}
      <Flex
        {...styles.container}
        opacity={isActivePreview || staysLeft ? "100%" : "0"}
        zIndex={staysLeft ? "5" : "-5"}
      >
        <Button {...styles.button}>
          <IoTrashOutline {...styles.icon} onClick={getDeleteConfirmation} />
        </Button>
      </Flex>

      {/* Alert dialog modal */}
      <AlertDialog
        functionOnDelete={onConfirmedDelete}
        setActiveDelete={setActiveDelete}
        header="Are you sure?"
        body="Deleted conversations cannot later be retrieved."
        isOpen={isOpen}
        onClose={onClose}
      />
    </Flex>
  );
};

export { SwipeToDelete };

// Styles
const styles = {
  wrapper: {
    position: { base: "static", md: " relative" },
    width: "100%",
  },
  container: {
    position: "absolute",
    right: { base: "1", md: "0" },
    top: { base: "none", md: "1" },
    width: { base: "4.5em", md: "3.2em" },
    height: { base: "4.5em", md: "3.2em" },
    justify: "center",
    align: "center",
    bg: "linear-gradient(90deg, rgba(0,0,0,0.02) 0%, transparent 20%)",
    transition: "opacity 1s",
  },
  button: {
    variant: "ghost",
    paddingX: "0",
    cursor: "pointer",
  },
  icon: {
    color: "rgba(247, 74, 74, 1)",
    fontSize: "1.2em",
  },
};

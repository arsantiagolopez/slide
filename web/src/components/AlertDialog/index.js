import {
  AlertDialog as ChakraAlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  Button,
} from "@chakra-ui/react";
import React, { useRef } from "react";

const AlertDialog = ({
  functionOnDelete,
  setActiveDelete,
  header,
  body,
  cancelMessage,
  confirmMessage,
  isOpen,
  onClose,
}) => {
  const cancelRef = useRef();

  function handleConfirmation() {
    // Callback to parent function on delete
    functionOnDelete();

    // Close dialog
    onClose();
  }

  function handleCancel() {
    // Update active delete
    if (setActiveDelete) {
      setActiveDelete(null);
    }

    // Close dialog
    onClose();
  }

  cancelMessage = cancelMessage || "CANCEL";
  confirmMessage = confirmMessage || "DELETE";

  return (
    <ChakraAlertDialog
      isOpen={isOpen}
      onClose={onClose}
      leastDestructiveRef={cancelRef}
      {...styles.wrapper}
    >
      {/* Content */}
      <AlertDialogContent {...styles.content}>
        {/* Header */}
        <AlertDialogHeader {...styles.header}>
          {/* Delete {name}? */}
          {header}
        </AlertDialogHeader>

        {/* Body */}
        <AlertDialogBody {...styles.body}>
          {/* Are you sure? will be deleted for good. This action cannot be undone. */}
          {body}
        </AlertDialogBody>

        {/* Footer */}
        <AlertDialogFooter justifyContent="center">
          {/* Cancel button */}
          <Button
            ref={cancelRef}
            onClick={handleCancel}
            {...styles.button}
            {...styles.cancelButton}
          >
            {cancelMessage}
          </Button>

          {/* Confirm button */}
          <Button
            onClick={handleConfirmation}
            {...styles.button}
            {...styles.confirmButton}
          >
            {confirmMessage}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </ChakraAlertDialog>
  );
};

export { AlertDialog };

// Styles
const styles = {
  wrapper: {
    motionPreset: "slideInBottom",
    isCentered: true,
  },
  content: {
    display: "flex",
    minHeight: "200px",
    width: { base: "80vw", md: "400px" },
    color: "gray.700",
    borderRadius: "1em",
    padding: "1em",
    background: "rgba(250,250,250, 0.1)",
    style: { backdropFilter: "blur(10px)" },
  },
  header: {
    marginX: "auto",
  },
  body: {
    display: "flex",
    textAlign: "center",
    alignItems: "center",
    color: "gray.500",
    lineHeight: "1.2em",
    paddingY: "0",
  },
  button: {
    size: "sm",
    borderRadius: "1.5em",
    paddingX: "1em",
    width: "100px",
  },
  cancelButton: {
    bg: "white",
    color: "black",
  },
  confirmButton: {
    marginLeft: 1,
    bg: "gray.800",
    color: "white",
  },
};

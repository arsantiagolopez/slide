import { CheckIcon, CloseIcon, EditIcon } from "@chakra-ui/icons";
import {
  Editable as ChakraEditable,
  EditableInput,
  EditablePreview,
  Flex,
  useEditableControls,
} from "@chakra-ui/react";
import React from "react";

const EditableControls = () => {
  const {
    isEditing,
    getSubmitButtonProps,
    getCancelButtonProps,
    getEditButtonProps,
  } = useEditableControls();

  return isEditing ? (
    <Flex>
      <CheckIcon
        color="green.400"
        {...styles.button}
        {...getSubmitButtonProps()}
      />
      <CloseIcon
        color="red.400"
        {...styles.button}
        {...getCancelButtonProps()}
      />
    </Flex>
  ) : (
    <EditIcon {...styles.button} {...getEditButtonProps()} />
  );
};

const Editable = ({ defaultValue, handleUpdate }) => (
  <ChakraEditable
    defaultValue={defaultValue}
    isPreviewFocusable={false}
    submitOnBlur={false}
    onSubmit={(value) => handleUpdate(value)}
    {...styles.wrapper}
  >
    <EditablePreview {...styles.preview} />
    <EditableInput {...styles.input} />

    <Flex {...styles.controls}>
      <EditableControls />
    </Flex>
  </ChakraEditable>
);

export { Editable };

// Styles

const styles = {
  wrapper: {
    direction: "row",
    width: "100%",
    justify: "space-between",
    position: "relative",
  },
  preview: {
    fontSize: "1.25em",
    paddingY: "1rem",
    fontWeight: "600",
  },
  input: {
    width: "100%",
    fontSize: "1.25em",
    border: "1px solid lightgray",
    borderRadius: "0.5rem",
    padding: "0.5rem",
    paddingX: "0.75rem",
    marginY: "0.25rem",
    fontWeight: "600",
  },
  controls: {
    position: "absolute",
    top: "0",
    right: "0.25rem",
    height: "100%",
    align: "center",
    color: "gray",
  },
  button: {
    marginX: "2",
  },
};

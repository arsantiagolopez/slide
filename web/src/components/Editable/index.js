import { CheckIcon, CloseIcon, EditIcon } from "@chakra-ui/icons";
import {
  ButtonGroup,
  Editable as ChakraEditable,
  EditableInput,
  EditablePreview,
  Flex,
  IconButton,
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
    <ButtonGroup>
      <IconButton
        icon={<CheckIcon color="#48BB78" />}
        {...getSubmitButtonProps()}
      />
      <IconButton
        icon={<CloseIcon color="#F56565" />}
        {...getCancelButtonProps()}
      />
    </ButtonGroup>
  ) : (
    <IconButton icon={<EditIcon />} {...getEditButtonProps()} />
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
    paddingY: "0.5rem",
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
    color: "gray",
    top: "1.25rem",
    right: "1rem",
  },
};

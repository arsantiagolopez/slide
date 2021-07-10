import { createStandaloneToast } from "@chakra-ui/react";

/**
 *  Shows a custom toast notification.
 *  Required props: status, title.
 */

const showToast = ({
  position,
  status,
  title,
  description,
  duration,
  isClosable,
}) => {
  const toast = createStandaloneToast();

  return toast({
    position: position || "top",
    status,
    title,
    description: description || null,
    duration: duration || 3000,
    isClosable: isClosable || false,
  });
};

export { showToast };

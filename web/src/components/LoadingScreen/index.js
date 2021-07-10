import { Flex, Spinner } from "@chakra-ui/react";
import React from "react";

const LoadingScreen = () => (
  <Flex {...styles.wrapper}>
    <Spinner {...styles.spinner} />
  </Flex>
);

export { LoadingScreen };

// Styles

const styles = {
  wrapper: {
    direction: "column",
    minHeight: "100vh",
    justify: "center",
    align: "center",
  },
  spinner: {
    color: "yellow.200",
    size: "xl",
    thickness: "3px",
  },
};

import { Flex, IconButton } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { IoFileTrayOutline, IoHomeOutline } from "react-icons/io5";

const IconNavigation = () => (
  <Flex {...styles.wrapper}>
    <Flex {...styles.container}>
      <Link href="/">
        <IconButton
          aria-label="Go home"
          icon={<IoHomeOutline />}
          {...styles.icon}
        />
      </Link>
      <Link href="/messages">
        <IconButton
          aria-label="Go to messages"
          icon={<IoFileTrayOutline />}
          {...styles.icon}
        />
      </Link>
    </Flex>
  </Flex>
);

export { IconNavigation };

// Styles

const styles = {
  wrapper: {
    zIndex: 2,
    justify: "space-around",
    height: "2.5em",
    width: "100%",
    background: "#1A202C",
  },
  container: {
    width: "100%",
    maxWidth: "50em",
  },
  icon: {
    color: "white",
    fontSize: "14pt",
    width: "100%",
  },
  button: {
    bottom: "3em",
    alignSelf: "center",
    paddingY: "1em",
    paddingX: "3vh",
    borderRadius: "5em",
    minWidth: "12em",
    color: "white",
    fontSize: "1em",
    fontWeight: "bold",
    background: "#1A202C",
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  },
};

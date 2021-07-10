import { Flex, IconButton } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import {
  IoFileTrayOutline,
  IoHomeOutline,
  IoPricetagsOutline,
} from "react-icons/io5";

const IconNavigation = () => (
  <Flex {...styles.wrapper}>
    <Link href="/explore">
      <IconButton
        aria-label="Explore"
        icon={<IoHomeOutline />}
        {...styles.icon}
      />
    </Link>
    <Link href="/messages">
      <IconButton
        aria-label="Messages"
        icon={<IoFileTrayOutline />}
        {...styles.icon}
      />
    </Link>
    <Link href="/sell">
      <IconButton
        aria-label="Sell"
        icon={<IoPricetagsOutline />}
        {...styles.icon}
      />
    </Link>
  </Flex>
);

export { IconNavigation };

// Styles

const styles = {
  wrapper: {
    zIndex: 1000,
    justify: "space-around",
    position: "fixed",
    bottom: 0,
    height: "3em",
    width: "100%",
    background: "#1A202C",
  },
  icon: {
    color: "white",
    fontSize: "14pt",
    width: "100%",
  },
};

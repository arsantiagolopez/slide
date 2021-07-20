import { Box } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo = ({ isLogin }) => (
  <Box {...styles.wrapper} width={isLogin ? "40%" : "10%"}>
    <Link href="/">
      <a>
        <Image src="/word.png" {...styles.image} />
      </a>
    </Link>
  </Box>
);

export { Logo };

// Styles

const styles = {
  wrapper: {
    position: "relative",
    height: "100%",
    userSelect: "none",
  },
  image: {
    alt: "Slide",
    layout: "fill",
    objectFit: "contain",
  },
};

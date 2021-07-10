import { Box } from "@chakra-ui/react";
import Image from "next/image";
import React from "react";

const Logo = () => (
  <Box {...styles.wrapper}>
    <Image src="/word.png" {...styles.image} />
  </Box>
);

export { Logo };

// Styles

const styles = {
  wrapper: {
    position: "relative",
    height: "100%",
    width: "100%",
    userSelect: "none",
  },
  image: {
    alt: "Slide",
    layout: "fill",
    objectFit: "contain",
  },
};

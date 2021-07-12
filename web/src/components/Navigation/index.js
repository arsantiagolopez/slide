import { Flex } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Avatar } from "../../components/Avatar";
import { Logo } from "../../components/Logo";
import { useDimensions } from "../../utils/useDimensions";
import { IconNavigation } from "./IconNavigation";

const Navigation = ({ isLogin }) => {
  const [screenDimensions, setScreenDimensions] = useState(null);
  const dimensions = useDimensions();

  const isDesktop = screenDimensions?.width > screenDimensions?.height;

  useEffect(() => setScreenDimensions(dimensions), [dimensions.width]);

  const avatarProps = { isDesktop };

  return (
    <>
      {!isLogin && <IconNavigation />}
      <Flex
        {...styles.wrapper}
        height={isLogin ? "40vh" : "max(2vh, 1.5em)"}
        paddingTop={isLogin ? "25vh" : "none"}
      >
        {!isLogin && (
          <Flex {...styles.avatar} left={isDesktop ? "10vw" : "1em"}>
            <Avatar {...avatarProps} />
          </Flex>
        )}
        <Logo />
      </Flex>
    </>
  );
};

export { Navigation };

// Styles

const styles = {
  wrapper: {
    zIndex: 0,
    direction: "row",
    justify: "center",
    align: "center",
    width: "100%",
    transition: "height 0.5s ease-out, padding-top 0.5s ease-out",
    marginY: "1em",
    overflowX: "hidden",
  },
  avatar: {
    zIndex: 5,
    position: "absolute",
    boxSize: "max(2vh, 2em)",
  },
};

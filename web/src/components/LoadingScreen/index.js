import { Flex, Spinner } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDimensions } from "../../utils/useDimensions";

const LoadingScreen = () => {
  const [screenHeight, setScreenHeight] = useState(null);

  const { height } = useDimensions();

  useEffect(() => setScreenHeight(height), [height]);

  return (
    <Flex {...styles.wrapper} height={screenHeight}>
      <Spinner {...styles.spinner} />
    </Flex>
  );
};

export { LoadingScreen };

// Styles

const styles = {
  wrapper: {
    position: "absolute",
    top: "0",
    left: "0",
    direction: "column",
    justify: "center",
    align: "center",
    marginX: "auto",
    width: "100%",
  },
  spinner: {
    color: "yellow.200",
    size: "xl",
    thickness: "3px",
  },
};

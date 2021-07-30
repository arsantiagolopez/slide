import { Flex } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { MessageContext } from "../../context/MessageContext";
import { useDimensions } from "../../utils/useDimensions";
import { Messages } from "./Messages";
import { Previews } from "./Previews";
import { Search } from "./Search";

const Inbox = () => {
  const [screenHeight, setScreenHeight] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  const { height } = useDimensions();
  const { activeMessage } = useContext(MessageContext);

  // SSR strategy to make page occupy full height
  useEffect(() => setScreenHeight(height), [height]);

  const searchProps = { searchValue, setSearchValue };

  return (
    <Flex {...styles.wrapper} height={screenHeight}>
      <Flex
        {...styles.previews}
        display={{ base: activeMessage ? "none" : "flex", md: "flex" }}
      >
        <Search {...searchProps} />
        <Previews />
      </Flex>

      <Flex {...styles.messages}>
        <Messages />
      </Flex>
    </Flex>
  );
};

export { Inbox };

// Styles

const styles = {
  wrapper: {
    direction: { base: "column", md: "row" },
    overflowX: "hidden",
    paddingX: { base: "1em", md: "15vw" },
    // Navigation bar
    marginTop: "-3.5em",
  },
  previews: {
    direction: "column",
    align: "flex-start",
    flex: 2,
    overflowY: "auto",
    paddingRight: { base: "none", md: "5" },
    paddingLeft: { base: "none", md: "1" },
    minHeight: "100%",
    paddingTop: "3.5em",
  },
  heading: {
    fontSize: "3xl",
    paddingTop: "0.5em",
  },
  messages: {
    flex: 5,
    overflowY: "auto",
  },
};

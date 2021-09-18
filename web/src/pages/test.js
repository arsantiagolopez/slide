import { Flex } from "@chakra-ui/react";
import React, { useState } from "react";
import { getLayout } from "../components/Layout";

const Test = () => {
  const [test, setTest] = useState(null);

  return <Flex>Test</Flex>;
};

// Persistent layout
Test.getLayout = getLayout;

export default Test;

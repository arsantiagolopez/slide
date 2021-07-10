import { Flex } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import Head from "next/head";
import React from "react";
import { createUrqlClient } from "../utils/createUrqlClient";

const Messages = () => {
  return (
    <>
      <Head>
        <title>Slide - Messages</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex {...styles.wrapper}></Flex>
    </>
  );
};

export default withUrqlClient(createUrqlClient)(Messages);

// Styles

const styles = {
  wrapper: {},
};

import { withUrqlClient } from "next-urql";
import Head from "next/head";
import React from "react";
import { Inbox } from "../components/Inbox";
import { createUrqlClient } from "../utils/createUrqlClient";

const Messages = () => {
  return (
    <>
      <Head>
        <title>Slide - Messages</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Inbox />
    </>
  );
};

export default withUrqlClient(createUrqlClient)(Messages);

import Head from "next/head";
import React from "react";
import { Inbox } from "../components/Inbox";
import { getLayout } from "../components/Layout";
import { MessageProvider } from "../context/MessageProvider";
import { useUser } from "../utils/useUser";

const Messages = () => {
  const { user } = useUser({ redirectTo: "/login" });

  return (
    <>
      <Head>
        <title>Slide - Messages</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MessageProvider myId={user?.me.id}>
        <Inbox />
      </MessageProvider>
    </>
  );
};

// Persistent layout
Messages.getLayout = getLayout;

export default Messages;

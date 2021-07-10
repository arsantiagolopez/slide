import { withUrqlClient } from "next-urql";
import Head from "next/head";
import React from "react";
import { Dashboard } from "../components/Dashboard";
import { getLayout } from "../components/Layout";
import { LoadingScreen } from "../components/LoadingScreen";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useUser } from "../utils/useUser";

const Index = () => {
  const { user } = useUser({ redirectTo: "/login" });

  // Loading spinner until authentication
  if (!user?.me) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Head>
        <title>Slide - Messages</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Dashboard />
    </>
  );
};

// Persistent layout
Index.getLayout = getLayout;

export default withUrqlClient(createUrqlClient)(Index);

import { Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { Footer } from "../Footer";
import { Navigation } from "../Navigation";

const Layout = ({ children }) => {
  const { pathname } = useRouter();

  const isLogin = pathname === "/login";
  const isPhoto = pathname === "/photo";

  const navigationProps = { isLogin, isPhoto };

  return (
    <Flex {...styles.wrapper}>
      <Navigation {...navigationProps} />
      {children}
      <Footer hideFooter={!isLogin} />
    </Flex>
  );
};

// Persistent layout strategy
const getLayout = (page) => <Layout>{page}</Layout>;

export { Layout, getLayout };

// Styles

const styles = {
  wrapper: {
    minHeight: "100vh",
    direction: "column",
  },
};

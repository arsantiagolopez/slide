import { Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { Footer } from "../Footer";
import { Navigation } from "../Navigation";

const Layout = ({ children }) => {
  const { pathname } = useRouter();

  const isLogin = pathname === "/login";

  const navigationProps = { isLogin };
  const footerProps = { hideFooter: !isLogin };

  return (
    <Flex {...styles.wrapper}>
      <Navigation {...navigationProps} />
      {children}
      <Footer {...footerProps} />
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

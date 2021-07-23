import { Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDimensions } from "../../utils/useDimensions";
import { Footer } from "../Footer";
import { Navigation } from "../Navigation";

const Layout = ({ children }) => {
  const [screenHeight, setScreenHeight] = useState(null);
  const { height } = useDimensions();

  const { pathname } = useRouter();
  const isLogin = pathname === "/login";

  useEffect(() => setScreenHeight(height), [height]);

  const navigationProps = { isLogin, screenHeight, pathname };
  const footerProps = { hideFooter: !isLogin };

  return (
    <Flex {...styles.wrapper} minHeight={screenHeight}>
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
    direction: "column",
  },
};

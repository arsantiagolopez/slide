import { Flex } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { useDimensions } from "../../utils/useDimensions";
import { useUser } from "../../utils/useUser";
import { Footer } from "../Footer";
import { Navigation } from "../Navigation";

const Layout = withUrqlClient(createUrqlClient)(({ children }) => {
  const [screenHeight, setScreenHeight] = useState(null);
  const { height } = useDimensions();

  const { user } = useUser({ redirectTo: "/login" });
  const { pathname } = useRouter();
  const isLogin = pathname === "/login";

  useEffect(() => setScreenHeight(height), [height]);

  const navigationProps = { isLogin, user, pathname };
  const footerProps = { hideFooter: !isLogin };

  return (
    <Flex {...styles.wrapper} minHeight={screenHeight}>
      <Navigation {...navigationProps} />
      {children}
      <Footer {...footerProps} />
    </Flex>
  );
});

// Persistent layout strategy
const getLayout = (page) => <Layout>{page}</Layout>;

export { Layout, getLayout };

// Styles

const styles = {
  wrapper: {
    direction: "column",
  },
};

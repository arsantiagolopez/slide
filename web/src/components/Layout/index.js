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
  const [screen, setScreen] = useState({});
  const [user, setUser] = useState(null);

  const { pathname } = useRouter();

  const { width, height } = useDimensions();
  const { user: userInfo } = useUser({ redirectTo: "/login" });

  const isLogin = pathname === "/login";
  const isDesktop = screen.width > screen.height;

  // Global layout doesn't track remounts. Refresh
  useEffect(() => setScreen({ width, height }), [height]);
  useEffect(() => setUser(userInfo), [userInfo]);

  const navigationProps = { isLogin, isDesktop, user, pathname };
  const footerProps = { hideFooter: !isLogin };

  return (
    <Flex {...styles.wrapper} minHeight={screen.height}>
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

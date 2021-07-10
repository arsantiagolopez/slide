import { Flex } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React from "react";
import { getLayout } from "../components/Layout";
import { createUrqlClient } from "../utils/createUrqlClient";

const Profile = () => {
  return <Flex {...styles.wrapper}></Flex>;
};

// Persistent layout
Profile.getLayout = getLayout;

export default withUrqlClient(createUrqlClient)(Profile);

// Styles

const styles = {
  wrapper: {},
};

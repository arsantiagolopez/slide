import { Flex } from "@chakra-ui/react";
import React from "react";
import { getLayout } from "../components/Layout";

const Profile = () => {
  return <Flex {...styles.wrapper}></Flex>;
};

// Persistent layout
Profile.getLayout = getLayout;

export default Profile;

// Styles

const styles = {
  wrapper: {},
};

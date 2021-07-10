import { Flex, Icon, Link } from "@chakra-ui/react";
import React from "react";
import { FaGithub } from "react-icons/fa";
import Config from "../../config";

const PORTFOLIO_WEBSITE = Config.portfolio.website;
const PORTFOLIO_PICTURE = Config.portfolio.picture;
const GITHUB_LINK = Config.github.link;

const Footer = ({ hideFooter }) => (
  <Flex {...styles.wrapper} display={hideFooter ? "none" : "flex"}>
    <Link href={PORTFOLIO_WEBSITE} {...styles.link} isExternal>
      <img src={PORTFOLIO_PICTURE} style={styles.avatar} />
    </Link>
    <Link href={GITHUB_LINK} {...styles.link} isExternal>
      <Icon as={FaGithub} {...styles.icon} />
    </Link>
  </Flex>
);

export { Footer };

// Styles

const styles = {
  wrapper: {
    pointerEvents: "none",
    position: "absolute",
    bottom: "2em",
    left: "0",
    width: "100%",
    height: "5em",
    align: "center",
    justify: "center",
    paddingX: "10vw",
    paddingY: "2em",
  },
  avatar: {
    width: "2.5em",
    borderRadius: "50%",
    marginRight: "1em",
  },
  icon: {
    pointerEvents: "auto",
    boxSize: "2.5em",
    cursor: "pointer",
  },
  link: {
    variant: "ghost",
    fontWeight: "medium",
    _hover: {
      textDecoration: "none",
    },
  },
};

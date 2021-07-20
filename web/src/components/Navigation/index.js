import { Flex, IconButton } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { IoFileTrayFull, IoHome } from "react-icons/io5";
import { Avatar } from "../../components/Avatar";
import { Logo } from "../../components/Logo";

const Navigation = ({ isLogin, isDesktop, user, pathname }) => {
  const avatarProps = { isDesktop };
  const logoProps = { isLogin };

  const isMessages = pathname.includes("/messages");

  return (
    <Flex
      {...styles.wrapper}
      height={isLogin ? "40vh" : "max(2vh, 1.5em)"}
      paddingTop={isLogin ? "25vh" : "none"}
    >
      <Logo {...logoProps} />

      {
        // User links
        user?.me && !isLogin && (
          <Flex {...styles.avatar} left={isDesktop ? "10vw" : "1em"}>
            <Avatar {...avatarProps} />
            <>
              {
                // Conditional icon navigation
                !isMessages ? (
                  <Link href="/messages">
                    <IconButton
                      aria-label="Go to messages"
                      icon={<IoFileTrayFull />}
                      {...styles.icon}
                    />
                  </Link>
                ) : (
                  <Link href="/">
                    <IconButton
                      aria-label="Go home"
                      icon={<IoHome />}
                      {...styles.icon}
                    />
                  </Link>
                )
              }
            </>
          </Flex>
        )
      }
    </Flex>
  );
};

export { Navigation };

// Styles

const styles = {
  wrapper: {
    zIndex: 0,
    direction: "row",
    justify: "center",
    align: "center",
    width: "100%",
    transition: "height 0.5s ease-out, padding-top 0.5s ease-out",
    marginY: "1em",
    overflowX: "hidden",
  },
  avatar: {
    zIndex: 5,
    position: "absolute",
    boxSize: "max(2vh, 2em)",
  },
  icon: {
    fontSize: "1.25em",
    width: "100%",
    marginLeft: "max(1em, 2vw)",
  },
  button: {
    bottom: "3em",
    alignSelf: "center",
    paddingY: "1em",
    paddingX: "3vh",
    borderRadius: "5em",
    minWidth: "12em",
    color: "white",
    fontSize: "1em",
    fontWeight: "bold",
    background: "#1A202C",
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  },
};

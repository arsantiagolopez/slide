import { Flex, IconButton } from "@chakra-ui/react";
import Link from "next/link";
import React, { useContext } from "react";
import { IoFileTrayFull, IoHome } from "react-icons/io5";
import { Avatar } from "../../components/Avatar";
import { Logo } from "../../components/Logo";
import { UserContext } from "../../context/UserContext";

const Navigation = ({ isLogin, pathname }) => {
  const { user } = useContext(UserContext);

  const isMessages = pathname.includes("/messages");

  const logoProps = { isLogin };
  const avatarProps = { user };

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
          <Flex {...styles.avatar}>
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
    paddingLeft: { base: "1em", md: "15vw" },
    align: "center",
    justify: "flex-start",
    width: "100%",
  },
  icon: {
    variant: "unstyled",
    fontSize: "1.25em",
    // width: "100%",
    marginLeft: "max(1em, 2vw)",
  },
};

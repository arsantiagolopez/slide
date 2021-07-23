import { Flex } from "@chakra-ui/react";
import Head from "next/head";
import React, { useState } from "react";
import { getLayout } from "../components/Layout";
import { Login as LoginComponent } from "../components/Login";
import { Signup } from "../components/Signup";

const Login = (props) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [email, setEmail] = useState(null);

  // const router = useRouter();

  // const { user } = useUser({ redirectTo: "/login" });

  const loginProps = { isRegistered, setIsRegistered, setIsLogin, setEmail };
  const signupProps = { setIsLogin, email };

  // // If logged in, redirect home
  // useEffect(async () => {
  //   if (user?.me) {
  //     router.replace("/");
  //   }
  // }, [user]);

  // console.log(props);

  return (
    <>
      <Head>
        <title>Slide - Log in</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex {...styles.wrapper}>
        <Flex {...styles.content}>
          {isLogin ? (
            <LoginComponent {...loginProps} />
          ) : (
            <Signup {...signupProps} />
          )}
        </Flex>
      </Flex>
    </>
  );
};

// Persistent layout
Login.getLayout = getLayout;

export default Login;

// Styles

const styles = {
  wrapper: {
    grow: 1,
    direction: "column",
    align: "center",
    width: "100%",
    paddingX: "1em",
  },
  content: {
    direction: "column",
    align: "center",
    width: { base: "100%", md: "25%" },
    minWidth: "20em",
    paddingY: { base: "1em", md: "2vh" },
    paddingX: { base: "1em", md: "max(2.5em, 3vw)" },
    overflowX: "hidden",
  },
};

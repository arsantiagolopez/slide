import { ChakraProvider } from "@chakra-ui/react";
import { Layout } from "../components/Layout";
import { MessageProvider } from "../context/MessageProvider";
import { UserProvider } from "../context/UserProvider";
import "../styles/global.css";
import theme from "../theme";

const MyApp = ({ Component, pageProps }) => {
  // Persistent layout pattern for better UX
  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);

  return (
    <ChakraProvider theme={theme}>
      <UserProvider>
        <MessageProvider>
          {getLayout(<Component {...pageProps} />)}
        </MessageProvider>
      </UserProvider>
    </ChakraProvider>
  );
};

export default MyApp;

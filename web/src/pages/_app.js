import { ChakraProvider } from "@chakra-ui/react";
import { Layout } from "../components/Layout";
import "../styles/global.css";
import theme from "../theme";

const MyApp = ({ Component, pageProps }) => {
  // Persistent layout pattern for better UX
  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);

  return getLayout(
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
};

export default MyApp;

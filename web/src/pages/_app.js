import { ChakraProvider } from "@chakra-ui/react";
import "../styles/global.css";
import theme from "../theme";

const MyApp = ({ Component, pageProps }) => {
  // Persistent layout pattern for better UX
  const getLayout = Component.getLayout;

  return (
    <ChakraProvider theme={theme}>
      {getLayout(<Component {...pageProps} />)}
    </ChakraProvider>
  );
};

export default MyApp;

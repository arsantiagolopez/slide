import { extendTheme, theme as chakraTheme } from "@chakra-ui/react";
// Disable Chakra focus outline if not keyboard navigating
import "focus-visible/dist/focus-visible";

// Custom themes
const colors = {
  ...chakraTheme.colors,
  heading: chakraTheme.colors.gray["800"],
  link: chakraTheme.colors.red["500"],
  primary: chakraTheme.colors.gray["100"],
  secondary: chakraTheme.colors.gray["300"],
  tertiary: chakraTheme.colors.gray["500"],
};

const fonts = {
  ...chakraTheme.fonts,
  heading: "Helvetica",
  text: "Arial",
};

const fontSizes = {
  ...chakraTheme.fontSizes,
  heading: "10rem",
};

// Custom components
const components = {
  ...chakraTheme.components,
  Button: {
    baseStyle: {
      color: "white",
    },
    variants: {
      brand: {
        background:
          "linear-gradient(140deg, rgba(251,255,119,1) 0%, rgba(252,208,39,1) 100%)",
        boxShadow: "lg",
        borderRadius: "5em",
        _hover: {
          background:
            "linear-gradient(160deg, rgba(247,252,92,1) 0%, rgba(252,191,39,1) 100%)",
        },
        _focus: {
          background:
            "linear-gradient(160deg, rgba(247,252,92,1) 0%, rgba(252,191,39,1) 100%)",
        },
      },
    },
    defaultProps: {
      size: "lg",
    },
  },
  Heading: {
    baseStyle: {
      color: "gray.800",
    },
  },
  Text: {
    baseStyle: {
      color: "gray.800",
    },
  },
};

const theme = extendTheme({ colors, fonts, fontSizes, components });

export default theme;

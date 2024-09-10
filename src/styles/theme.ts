import { DefaultTheme } from "styled-components";

export const theme: DefaultTheme = {
  colors: {
    primary: {
      main: "#4A90E2",
      dark: "#2C71C7",
      light: "#89C4F4",
    },
    secondary: {
      beige: "#F5E2C8",
      pink: "#FFC0CB",
      mint: "#98FB98",
    },
    neutral: {
      white: "#FFFFFF",
      lightGrey: "#F0F0F0",
      mediumGrey: "#B0B0B0",
      darkGrey: "#4A4A4A",
    },
    semantic: {
      success: "#4CAF50",
      warning: "#FF9800",
      error: "#FF5252",
    },
  },
  fontSizes: {
    small: "14px",
    medium: "16px",
    large: "20px",
  },
  spacing: {
    small: "8px",
    medium: "16px",
    large: "24px",
  },
  borderRadius: "8px",
  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
};

export default theme;

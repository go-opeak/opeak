import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      primary: {
        main: string;
        dark: string;
        light: string;
      };
      secondary: {
        beige: string;
        pink: string;
        mint: string;
      };
      neutral: {
        white: string;
        lightGrey: string;
        mediumGrey: string;
        darkGrey: string;
      };
      semantic: {
        success: string;
        warning: string;
        error: string;
      };
    };
    fontSizes: {
      small: string;
      medium: string;
      large: string;
    };
    spacing: {
      small: string;
      medium: string;
      large: string;
    };
    borderRadius: string;
    boxShadow: string;
  }
}

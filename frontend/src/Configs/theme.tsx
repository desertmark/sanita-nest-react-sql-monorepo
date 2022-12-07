import { createTheme, Palette, PaletteColor, useTheme } from "@mui/material";
declare module "@mui/material/styles" {
  interface TypographyVariants {
    logo: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    logo?: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    logo: true;
  }
}
export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#081b45",
    },
    secondary: {
      main: "#fae9e1",
    },
    warning: {
      main: "#ef6c00",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    logo: {
      fontFamily: "logo-font",
    },
  },
});

export const useColor = (name: keyof Palette): PaletteColor => {
  const theme = useTheme();
  return theme.palette?.[name] as PaletteColor;
};

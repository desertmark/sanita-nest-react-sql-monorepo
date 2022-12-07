import { ThemeProvider } from "@mui/material";
import { FC, PropsWithChildren } from "react";
import { BrowserRouter } from "react-router-dom";
import { theme } from "../Configs/theme";
import { AppProvider } from "./AppProvider";

export const Providers: FC<PropsWithChildren<unknown>> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <AppProvider>{children}</AppProvider>
    </ThemeProvider>
  );
};

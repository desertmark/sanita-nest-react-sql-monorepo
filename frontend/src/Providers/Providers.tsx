import { ThemeProvider } from "@mui/material";
import { FC, PropsWithChildren } from "react";
import { BrowserRouter } from "react-router-dom";
import { theme } from "../Configs/theme";
import { AppProvider } from "./AppProvider";
import { ProductsProvider } from "./ProductsProvider";

export const Providers: FC<PropsWithChildren<unknown>> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <AppProvider>
        <ProductsProvider>{children}</ProductsProvider>
      </AppProvider>
    </ThemeProvider>
  );
};

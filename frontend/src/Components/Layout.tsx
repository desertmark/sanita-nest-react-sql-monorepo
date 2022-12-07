import { styled } from "@mui/material/styles";
import { FC, HTMLAttributes, PropsWithChildren } from "react";
import { Outlet } from "react-router-dom";
import { useAppState } from "../Providers/AppProvider";
import { Header } from "./Header";
import { Loader } from "./Loader";
import { Sidebar } from "./Sidebar";

const LayoutComponent: FC<
  PropsWithChildren<HTMLAttributes<HTMLDivElement>>
> = ({ children, ...rest }) => {
  const { loader, isLoading } = useAppState();
  return (
    // eslint-disable-next-line jsx-a11y/aria-role
    <div role="layout" {...rest}>
      <Header />
      <Sidebar />
      <Loader isLoading={loader.isLoading} />
      <Outlet />
    </div>
  );
};

export const Layout = styled(LayoutComponent, { label: "layout" })(
  ({ theme }) => {
    return {
      backgroundColor: theme.palette.background.default,
      height: "100vh",
      display: "flex",
      flexDirection: "column",
    };
  }
);

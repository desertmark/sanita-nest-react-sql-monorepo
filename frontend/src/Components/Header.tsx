import {
  AppBar,
  Button,
  IconButton,
  Toolbar,
  Typography as Text,
} from "@mui/material";
import { FC } from "react";
import { Logout, Menu } from "@mui/icons-material";
import { useAppState } from "../Providers/AppProvider";
import { SanitaLogo } from "./Logo";

export const Header: FC<unknown> = () => {
  const { openSidebar } = useAppState();
  const isAdmin = true;
  const logout = () => console.log("logout");
  const login = () => console.log("login");
  const user = {};
  return (
    <div>
      <AppBar position="sticky">
        <Toolbar sx={{ gap: 1 }}>
          {isAdmin && (
            <IconButton color="inherit" onClick={openSidebar}>
              <Menu />
            </IconButton>
          )}
          <SanitaLogo size={64} />
          <Text
            variant="logo"
            fontSize={32}
            color="secondary"
            sx={{ flexGrow: 1 }}
          >
            Sanita
          </Text>
          {isAdmin && (
            <>
              <Text
                color="secondary"
                sx={{ display: { xs: "none", md: "block" } }}
              >
                {"user?.displayName"}
              </Text>
              <IconButton onClick={logout} color="inherit">
                <Logout />
              </IconButton>
            </>
          )}
          {!user && (
            <Button color="inherit" onClick={login}>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

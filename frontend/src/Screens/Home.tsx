import { FC } from "react";
import { Screen } from "../Components/Screen";
import { Box, Typography as Text } from "@mui/material";
import { SanitaLogoSlogan } from "../Components/Logo";
import { Link } from "react-router-dom";
export const Home: FC = () => {
  return (
    <Screen role="home" sx={{ justifyContent: "center" }}>
      <Box
        textAlign="center"
        display="flex"
        flexDirection="column"
        alignItems="center"
        sx={{ gap: 1 }}
      >
        <SanitaLogoSlogan color="blue" />
        <Text
          variant="logo"
          color="primary"
          fontSize={28}
          sx={{ marginBottom: 3 }}
        >
          Bienvenido a Sanita
        </Text>
        <Text variant="logo" fontSize={20} color="primary">
          Haga click <Link to="/login">aqui</Link> para empezar
        </Text>
      </Box>
    </Screen>
  );
};

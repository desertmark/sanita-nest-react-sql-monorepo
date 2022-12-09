import { FC } from "react";
import { Screen } from "../Components/Screen";
import { Box, Typography as Text } from "@mui/material";
import { SanitaLogoSlogan } from "../Components/Logo";
import { LoginForm } from "../Components/LoginForm";
export const Login: FC = () => {
  return (
    <Screen
      role="login"
      sx={{ justifyContent: "center", alignItems: "center" }}
    >
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
          Inicie sesion para empezar
        </Text>

        <LoginForm />
      </Box>
    </Screen>
  );
};

import { FC } from "react";
import { Screen } from "../Components/Screen";
import { Box, Typography as Text } from "@mui/material";
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
        <Text
          variant="logo"
          color="primary"
          fontSize={28}
          sx={{ marginBottom: 3 }}
        >
          Bienvenido a Sanita
        </Text>
        <Text variant="logo" color="primary">
          Haga click aqui para empezar
        </Text>
      </Box>
    </Screen>
  );
};

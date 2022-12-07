import { CircularProgress, Typography as Text, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import { FC } from "react";

export const Loader: FC<{ isLoading: boolean }> = ({ isLoading }) => {
  const { palette } = useTheme();
  return isLoading ? (
    <Box
      role="loader"
      sx={{
        position: "fixed",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: palette.background.default,
        height: "100vh",
        width: "100%",
        flexDirection: "column",
        zIndex: 1,
      }}
    >
      <CircularProgress color="primary" size={100} />
      <Text color="primary">Loading...</Text>
    </Box>
  ) : (
    <></>
  );
};

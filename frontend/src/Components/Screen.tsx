import { styled } from "@mui/material/styles";
import { Box } from "@mui/system";
import { FC, HTMLAttributes, PropsWithChildren } from "react";

export const ScreenComponent: FC<
  PropsWithChildren<HTMLAttributes<HTMLDivElement>>
> = ({ children, ...rest }) => (
  <main {...rest}>
    <Box sx={{ width: 1000 }}>{children}</Box>
  </main>
);
export const Screen = styled("main")(({ theme }) => {
  return {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    padding: theme.spacing(2),
  };
});

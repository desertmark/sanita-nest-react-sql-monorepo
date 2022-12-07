import { ElectricBolt } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { FC, HTMLAttributes } from "react";
import logo from "../assets/food-run-logo-512.png";
import logoAlt from "../assets/food-run-logo-alt-512.png";
export const Logo = styled(ElectricBolt)(({ theme }) => {
  return {
    fontSize: theme.typography.h3.fontSize,
    transitionDuration: theme.transitions.duration.shortest.toString(),
    transitionProperty: "all",
    ":hover": {
      color: "#fcd303",
    },
  };
});

export interface FoodRunLogoProps
  extends React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {
  size?: number;
  secondary?: boolean;
}

export const FoodRunLogo: FC<FoodRunLogoProps> = ({
  secondary,
  size,
  ...props
}) => {
  return (
    <img
      src={secondary ? logoAlt : logo}
      alt="logo"
      {...props}
      height={size || "auto"}
      width={size || "auto"}
    />
  );
};

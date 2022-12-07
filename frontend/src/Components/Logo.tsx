import { FC } from "react";
import { ReactComponent as SanitaLogoSvg } from "../assets/logo.svg";
import { ReactComponent as SanitaLogoSloganSvg } from "../assets/logo-slogan.svg";

type SvgProps = React.SVGProps<SVGSVGElement> & { title?: string };

export interface SanitaLogoProp extends SvgProps {
  size?: number;
  secondary?: boolean;
}

export const SanitaLogo: FC<SanitaLogoProp> = ({
  secondary,
  size,
  ...props
}) => {
  return <SanitaLogoSvg style={{ width: size, height: size }} {...props} />;
};

export const SanitaLogoSlogan: FC<SanitaLogoProp> = ({
  secondary,
  size,
  ...props
}) => {
  return (
    <SanitaLogoSloganSvg style={{ width: size, height: size }} {...props} />
  );
};

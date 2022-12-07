import { SvgIconProps, Typography as Text } from "@mui/material";
import { Box } from "@mui/system";

import { ComponentType, FC } from "react";

export interface ScreenTitleProps {
  Icon: ComponentType<SvgIconProps>;
  text: string;
  subtitle?: boolean;
  caption?: string;
}
export const ScreenTitle: FC<ScreenTitleProps> = ({
  Icon,
  text,
  subtitle,
  caption,
}) => (
  <Box>
    <Box display="flex" sx={{ gap: 2 }}>
      <Icon sx={{ fontSize: subtitle ? 28 : 30 }} />
      <Text variant={subtitle ? "h6" : "h5"}>{text}</Text>
    </Box>
    {caption && (
      <Text
        variant="caption"
        sx={{ marginTop: subtitle ? 1 : 2, display: "flex" }}
      >
        {caption}
      </Text>
    )}
  </Box>
);

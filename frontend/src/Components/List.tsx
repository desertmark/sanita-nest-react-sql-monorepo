import {
  Avatar,
  List as MuiList,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { FC } from "react";

export interface ListProps {
  items: ListItem[];
}

export interface ListItem {
  image?: string;
  icon?: JSX.Element;
  text: string;
  onClick?: () => void;
}

export const List: FC<ListProps> = ({ items }) => {
  return (
    <MuiList>
      {items?.map(({ icon, text, onClick, image }, index) => (
        <ListItem disablePadding key={`list-item-${index}`} onClick={onClick}>
          <ListItemButton>
            {icon && <ListItemIcon>{icon}</ListItemIcon>}
            {image && (
              <ListItemAvatar>
                <Avatar src={image} />
              </ListItemAvatar>
            )}
            <ListItemText primary={text} />
          </ListItemButton>
        </ListItem>
      ))}
    </MuiList>
  );
};

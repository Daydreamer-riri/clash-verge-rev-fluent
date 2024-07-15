import React, { ReactNode, useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import { ChevronRightRounded } from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";
import isAsyncFunction from "@/utils/is-async-function";
import {
  Body1,
  Body2,
  makeStyles,
  mergeClasses,
} from "@fluentui/react-components";
import { Expander, ExpanderProps } from "../../base/Expander";
import { tokens } from "../../../pages/_theme";
import { ChevronRightRegular } from "@fluentui/react-icons";

interface ItemProps {
  label: ReactNode;
  extra?: ReactNode;
  children?: ReactNode;
  secondary?: ReactNode;
  onClick?: () => void | Promise<any>;
}

export const SettingItem: React.FC<ItemProps> = (props) => {
  const { label, extra, children, secondary, onClick } = props;
  const clickable = !!onClick;

  const primary = (
    <Box sx={{ display: "flex", alignItems: "center", fontSize: "14px" }}>
      <span>{label}</span>
      {extra ? extra : null}
    </Box>
  );

  const [isLoading, setIsLoading] = useState(false);
  const handleClick = () => {
    if (onClick) {
      if (isAsyncFunction(onClick)) {
        setIsLoading(true);
        onClick()!.finally(() => setIsLoading(false));
      } else {
        onClick();
      }
    }
  };

  return clickable ? (
    <ListItem disablePadding>
      <ListItemButton onClick={handleClick} disabled={isLoading}>
        <ListItemText primary={primary} secondary={secondary} />
        {isLoading ? (
          <CircularProgress color="inherit" size={20} />
        ) : (
          <ChevronRightRounded />
        )}
      </ListItemButton>
    </ListItem>
  ) : (
    <ListItem sx={{ pt: "5px", pb: "5px" }}>
      <ListItemText primary={primary} secondary={secondary} />
      {children}
    </ListItem>
  );
};

export const SettingList: React.FC<{
  title: string;
  children: ReactNode;
}> = (props) => (
  <List>
    <ListSubheader
      sx={[
        { background: "transparent", fontSize: "16px", fontWeight: "700" },
        ({ palette }) => {
          return {
            color: palette.text.primary,
          };
        },
      ]}
      disableSticky
    >
      {props.title}
    </ListSubheader>

    {props.children}
  </List>
);

const useStyle = makeStyles({
  listContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    marginTop: "8px",
  },
  titleWrap: {
    marginBottom: "8px",
  },
});

export function FluentSettingList({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  const { listContainer, titleWrap } = useStyle();
  return (
    <div>
      <Body2 className={titleWrap}>{title}</Body2>
      <div className={listContainer}>{children}</div>
    </div>
  );
}

const useItemStyle = makeStyles({
  header: {
    paddingBlock: "16px",
  },
  canClick: {
    cursor: "pointer",
    transition: `background-color ${tokens.durationFast} ${tokens.curveEasyEase}`,
    ":hover": {
      background: tokens.overlay1Hover,
    },
    ":active": {
      background: tokens.overlay1Pressed,
    },
  },
});

export function FluentSettingItem({
  label,
  extra,
  children,
  secondary,
  onClick,
  canExpand,
  content,
}: ItemProps & ExpanderProps) {
  const classes = useItemStyle();
  const canClick = !!onClick;

  const right = canClick ? (
    <>
      {children}
      <ChevronRightRegular style={{ fontSize: 20, marginRight: 5 }} />
    </>
  ) : (
    children
  );

  return (
    <Expander
      content={content}
      left={label}
      right={right}
      className={{
        header: mergeClasses(classes.header, canClick && classes.canClick),
      }}
      canExpand={canExpand}
      onClick={onClick}
    />
  );
}

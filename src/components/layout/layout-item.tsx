import {
  alpha,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import { useMatch, useResolvedPath, useNavigate } from "react-router-dom";
import { useVerge } from "@/hooks/use-verge";
import { makeStyles, mergeClasses, Tab } from "@fluentui/react-components";
import { tokens } from "../../pages/_theme";
interface Props {
  to: string;
  children: string;
  icon: React.ReactNode[];
}
export const useListItemStyle = makeStyles({
  item: {
    columnGap: "12px",
    marginBottom: "4px",
    borderRadius: "4px",
    outline: "none !important",
    "&:hover": {
      backgroundColor: tokens.overlay1,
      "&::before": {
        backgroundColor: "rgba(0, 0, 0, 0)",
      },
      "& .fui-Tab__icon": {
        color: tokens.colorNeutralForeground1Hover + " !important",
      },
    },
    "&:active": {
      backgroundColor: tokens.overlay1Pressed,
      "&::before": {
        backgroundColor: "rgba(0, 0, 0, 0)",
      },
    },
  },
  selected: {
    backgroundColor: tokens.overlay1,
  },
  iconOverride: {
    color: tokens.colorNeutralForeground1 + " !important",
  },
});

export const LayoutItem = (props: Props) => {
  const { to, children, icon } = props;
  const { verge } = useVerge();
  const { menu_icon } = verge ?? {};
  const resolved = useResolvedPath(to);
  const match = useMatch({ path: resolved.pathname, end: true });
  const navigate = useNavigate();

  return (
    <ListItem sx={{ py: 0.5, maxWidth: 250, mx: "auto", padding: "4px 0px" }}>
      <ListItemButton
        selected={!!match}
        sx={[
          {
            borderRadius: 2,
            marginLeft: 1.25,
            paddingLeft: 1,
            paddingRight: 1,
            marginRight: 1.25,
            "& .MuiListItemText-primary": {
              color: "text.primary",
              fontWeight: "700",
            },
          },
          ({ palette: { mode, primary } }) => {
            const bgcolor =
              mode === "light"
                ? alpha(primary.main, 0.15)
                : alpha(primary.main, 0.35);
            const color = mode === "light" ? "#1f1f1f" : "#ffffff";

            return {
              "&.Mui-selected": { bgcolor },
              "&.Mui-selected:hover": { bgcolor },
              "&.Mui-selected .MuiListItemText-primary": { color },
            };
          },
        ]}
        onClick={() => navigate(to)}
      >
        {(menu_icon === "monochrome" || !menu_icon) && (
          <ListItemIcon sx={{ color: "text.primary", marginLeft: "6px" }}>
            {icon[0]}
          </ListItemIcon>
        )}
        {menu_icon === "colorful" && <ListItemIcon>{icon[1]}</ListItemIcon>}
        <ListItemText
          sx={{
            textAlign: "center",
            marginLeft: menu_icon === "disable" ? "" : "-35px",
          }}
          primary={children}
        />
      </ListItemButton>
    </ListItem>
  );
};

export function FluentLayoutItem(props: Props) {
  const { to, children, icon } = props;
  const { verge } = useVerge();
  const resolved = useResolvedPath(to);
  const match = useMatch({ path: resolved.pathname, end: true });

  const classes = useListItemStyle();

  return (
    <Tab
      value={to}
      className={mergeClasses(classes.item, !!match && classes.selected)}
      icon={{
        children: icon[2] ?? (icon[0] as any),
        className: classes.iconOverride,
      }}
      content={{ style: { fontWeight: "500" } }}
    >
      {children.replace(/\s/g, "")}
    </Tab>
  );
}

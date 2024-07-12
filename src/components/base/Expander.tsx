import { makeStyles, mergeClasses } from "@fluentui/react-components";
import { createContext, useContext, useState } from "react";
import { tokens } from "../../pages/_theme";

export interface ExpanderProps {
  children?: React.ReactNode;
  className?: string | { header?: string; content?: string; root?: string };
  canExpand?: boolean;
  content?: React.ReactNode;
  icon?: React.ReactNode;
  left?: React.ReactNode;
  right?: React.ReactNode;
  expanded?: boolean;
  onExpandChange?: (expanded: boolean) => void;
}

const useStyle = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    borderRadius: tokens.borderRadiusMedium,
    inlineSize: "100%",
    background: tokens.surface1,
  },
  expandHeader: {
    borderRadius: tokens.borderRadiusMedium,
    display: "flex",
    alignItems: "center",
    fontSize: tokens.fontSizeBase300,
    paddingInlineStart: "16px",
    paddingBlock: "16px",
    padding: "8px",
    backgroundClip: "padding-box",
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    color: tokens.colorNeutralForeground1,
  },
  expandContent: {
    // @ts-expect-error
    borderBlockStart: "none",
    borderRadius: tokens.borderRadiusSmall,
    borderStartStartRadius: tokens.borderRadiusNone,
    borderStartEndRadius: tokens.borderRadiusNone,
    transform: "translateY(-100%)",
  },
  expanded: {},
  icon: {
    flex: "0 0 auto",
    inlineSize: "16px",
    blockSize: "16px",
    marginInlineEnd: "16px",
  },
  expandedHeader: {
    borderEndStartRadius: 0,
    borderEndEndRadius: 0,
  },
  expandedContent: {
    transform: "translateY(0)",
    transition: `${tokens.durationFast} ${tokens.curveEasyEase} transform`,
  },
  expandedChevron: {
    transform: "rotate(180deg)",
    transition: `${tokens.durationFast} ${tokens.curveEasyEase} transform`,
  },
  contentListItemHeader: {
    borderRadius: tokens.borderRadiusNone,
    borderTop: "none",
    "&:last-child": {
      borderBottomLeftRadius: tokens.borderRadiusMedium,
      borderBottomRightRadius: tokens.borderRadiusMedium,
    },
  },
});

const ListContext = createContext<null | boolean>(null);
export function ExpanderList(props: { children: React.ReactNode }) {
  return (
    <ListContext.Provider value={true}>{props.children}</ListContext.Provider>
  );
}

export function Expander(props: ExpanderProps) {
  const {
    children,
    canExpand = false,
    className: propClassName,
    icon,
    left,
    right,
    expanded,
    onExpandChange,
  } = props;
  const [isExpanded, setIsExpanded] = useState(expanded);
  const isControlled = expanded !== undefined;
  const realExpanded = expanded ?? isExpanded;

  const handleExpandChange = () => {
    if (!isControlled) {
      setIsExpanded((e) => !e);
    }
    onExpandChange?.(!realExpanded);
  };

  const classes = useStyle();
  const classNames =
    typeof propClassName === "string" ? { root: propClassName } : propClassName;

  const listContext = useContext(ListContext);
  const isChildOfList = listContext !== null;

  return (
    <div className={mergeClasses(classes.root, classNames?.root)}>
      <div
        className={mergeClasses(
          classes.expandHeader,
          realExpanded && classes.expandedHeader,
          classNames?.header,
          isChildOfList && classes.contentListItemHeader
        )}
        onClick={canExpand ? handleExpandChange : undefined}
      >
        {icon ? <div className={classes.icon}>{icon}</div> : null}
        {left}
        {children}
        {right}
      </div>
      <div
        className={mergeClasses(
          classes.expandContent,
          realExpanded && classes.expandedContent,
          classNames?.content
        )}
      >
        <ListContext.Provider value={realExpanded ?? null}>
          {props.content}
        </ListContext.Provider>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Box, IconButton, TextField, SxProps } from "@mui/material";
import {
  AccessTimeRounded,
  MyLocationRounded,
  NetworkCheckRounded,
  FilterAltRounded,
  FilterAltOffRounded,
  VisibilityRounded,
  VisibilityOffRounded,
  WifiTetheringRounded,
  WifiTetheringOffRounded,
  SortByAlphaRounded,
  SortRounded,
} from "@mui/icons-material";
import { useVerge } from "@/hooks/use-verge";
import type { HeadState } from "./use-head-state";
import type { ProxySortType } from "./use-filter-sort";
import delayManager from "@/services/delay";
import { Button, Input } from "@fluentui/react-components";
import {
  ArrowSortDownLinesFilled,
  ArrowSortDownLinesRegular,
  ClockRegular,
  EyeFilled,
  EyeOffFilled,
  EyeOffRegular,
  EyeRegular,
  FilterAddRegular,
  FilterDismissRegular,
  FilterRegular,
  LiveOffRegular,
  LiveRegular,
  MyLocationFilled,
  MyLocationRegular,
  NetworkCheckFilled,
  TextSortAscendingFilled,
  TextSortAscendingRegular,
} from "@fluentui/react-icons";

interface Props {
  sx?: SxProps;
  groupName: string;
  headState: HeadState;
  onLocation: () => void;
  onCheckDelay: () => void;
  onHeadState: (val: Partial<HeadState>) => void;
}

export const ProxyHead = (props: Props) => {
  const { sx = {}, groupName, headState, onHeadState } = props;

  const { showType, sortType, filterText, textState, testUrl } = headState;

  const { t } = useTranslation();
  const [autoFocus, setAutoFocus] = useState(false);

  useEffect(() => {
    // fix the focus conflict
    const timer = setTimeout(() => setAutoFocus(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const { verge } = useVerge();

  useEffect(() => {
    delayManager.setUrl(groupName, testUrl || verge?.default_latency_test!);
  }, [groupName, testUrl, verge?.default_latency_test]);

  return (
    <Box
      sx={{ display: "flex", alignItems: "center", gap: 0.5, ...sx }}
      aria-label="proxy-content"
    >
      <Button
        size="small"
        color="inherit"
        title={t("Location")}
        onClick={props.onLocation}
        icon={<MyLocationRegular />}
        appearance="subtle"
      />

      <Button
        size="small"
        color="inherit"
        title={t("Delay check")}
        onClick={() => {
          // Remind the user that it is custom test url
          if (testUrl?.trim() && textState !== "filter") {
            onHeadState({ textState: "url" });
          }
          props.onCheckDelay();
        }}
        icon={<NetworkCheckFilled />}
        appearance="subtle"
      />

      <Button
        size="small"
        color="inherit"
        title={
          [t("Sort by default"), t("Sort by delay"), t("Sort by name")][
            sortType
          ]
        }
        onClick={() =>
          onHeadState({ sortType: ((sortType + 1) % 3) as ProxySortType })
        }
        appearance="subtle"
        icon={
          <>
            {sortType !== 1 && sortType !== 2 && <ArrowSortDownLinesRegular />}
            {sortType === 1 && <ClockRegular />}
            {sortType === 2 && <TextSortAscendingRegular />}
          </>
        }
      />

      <Button
        color="inherit"
        title={t("Delay check URL")}
        onClick={() =>
          onHeadState({ textState: textState === "url" ? null : "url" })
        }
        icon={textState === "url" ? <LiveRegular /> : <LiveOffRegular />}
        appearance="subtle"
      />

      <Button
        color="inherit"
        title={showType ? t("Proxy basic") : t("Proxy detail")}
        onClick={() => onHeadState({ showType: !showType })}
        icon={showType ? <EyeFilled /> : <EyeOffFilled />}
        appearance="subtle"
      />

      <Button
        color="inherit"
        title={t("Filter")}
        onClick={() =>
          onHeadState({ textState: textState === "filter" ? null : "filter" })
        }
        icon={
          textState === "filter" ? (
            <FilterDismissRegular />
          ) : (
            <FilterAddRegular />
          )
        }
        appearance="subtle"
      />

      {textState === "filter" && (
        <Input
          autoComplete="new-password"
          autoFocus={autoFocus}
          value={filterText}
          // size="small"
          placeholder={t("Filter conditions")}
          onChange={(e) => onHeadState({ filterText: e.target.value })}
          // sx={{ ml: 0.5, flex: "1 1 auto", input: { py: 0.65, px: 1 } }}
          appearance="outline"
          style={{ flex: "1 1 auto", marginLeft: "0.5rem" }}
        />
      )}

      {textState === "url" && (
        <Input
          autoComplete="new-password"
          autoFocus={autoFocus}
          autoSave="off"
          value={testUrl}
          appearance="outline"
          placeholder={t("Delay check URL")}
          onChange={(e) => onHeadState({ testUrl: e.target.value })}
          style={{ flex: "1 1 auto", marginLeft: "0.5rem" }}
        />
      )}
    </Box>
  );
};

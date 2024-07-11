import { useMemo, useState } from "react";
import { Box, IconButton, MenuItem } from "@mui/material";
import { Virtuoso } from "react-virtuoso";
import { useTranslation } from "react-i18next";
import {
  PlayCircleOutlineRounded,
  PauseCircleOutlineRounded,
} from "@mui/icons-material";
import {
  Button,
  MenuButton,
  Menu,
  MenuTrigger,
  TabList,
  Tab,
  MenuPopover,
  MenuList,
  MenuItemRadio,
} from "@fluentui/react-components";
import { useLogData } from "@/hooks/use-log-data";
import { useEnableLog } from "@/services/states";
import { BaseEmpty, BasePage } from "@/components/base";
import LogItem from "@/components/log/log-item";
import { useCustomTheme } from "@/components/layout/use-custom-theme";
import { BaseSearchBox } from "@/components/base/base-search-box";
import { BaseStyledSelect } from "@/components/base/base-styled-select";
import { mutate } from "swr";
import { tokens } from "./_theme";
import { PauseCircleRegular, PlayCircleRegular } from "@fluentui/react-icons";

const LogPage = () => {
  const { t } = useTranslation();
  const { data: logData = [] } = useLogData();
  const [enableLog, setEnableLog] = useEnableLog();
  const { theme } = useCustomTheme();
  const isDark = theme.palette.mode === "dark";
  const [logState, setLogState] = useState("all");
  const [match, setMatch] = useState(() => (_: string) => true);

  const filterLogs = useMemo(() => {
    return logData.filter(
      (data) =>
        (logState === "all" ? true : data.type.includes(logState)) &&
        match(data.payload)
    );
  }, [logData, logState, match]);

  return (
    <BasePage
      full
      title={t("Logs")}
      contentStyle={{ height: "100%" }}
      header={
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            onClick={() => setEnableLog((e) => !e)}
            icon={enableLog ? <PauseCircleRegular /> : <PlayCircleRegular />}
            appearance="subtle"
            size="small"
          />
          <Button
            // useSWRSubscription adds a prefix "$sub$" to the cache key
            // https://github.com/vercel/swr/blob/1585a3e37d90ad0df8097b099db38f1afb43c95d/src/subscription/index.ts#L37
            onClick={() => mutate("$sub$getClashLog", [])}
          >
            {t("Clear")}
          </Button>
        </Box>
      }
    >
      <Box
        sx={{
          pt: 1,
          mb: 0.5,
          mx: "10px",
          height: "36px",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Menu>
          <MenuTrigger>
            <MenuButton>{logState}</MenuButton>
          </MenuTrigger>
          <MenuPopover>
            <MenuList
              onCheckedValueChange={(_, { checkedItems }) =>
                setLogState(checkedItems[0])
              }
              checkedValues={{ logState: [logState] }}
            >
              <MenuItemRadio name="logState" value="all">
                ALL
              </MenuItemRadio>
              <MenuItemRadio name="logState" value="inf">
                INFO
              </MenuItemRadio>
              <MenuItemRadio name="logState" value="warn">
                WARN
              </MenuItemRadio>
              <MenuItemRadio name="logState" value="err">
                ERROR
              </MenuItemRadio>
            </MenuList>
          </MenuPopover>
        </Menu>
        <BaseSearchBox onSearch={(match) => setMatch(() => match)} />
      </Box>

      <Box
        height="calc(100% - 65px)"
        sx={{
          margin: "10px",
          borderRadius: "8px",
          bgcolor: tokens.surface1,
        }}
      >
        {filterLogs.length > 0 ? (
          <Virtuoso
            initialTopMostItemIndex={999}
            data={filterLogs}
            itemContent={(index, item) => <LogItem value={item} />}
            followOutput={"smooth"}
          />
        ) : (
          <BaseEmpty />
        )}
      </Box>
    </BasePage>
  );
};

export default LogPage;

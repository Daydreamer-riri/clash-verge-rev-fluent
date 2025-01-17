import { useMemo, useRef, useState } from "react";
import { useLockFn } from "ahooks";
import { Box, IconButton, MenuItem } from "@mui/material";
import { Button } from "@fluentui/react-components";
import { Virtuoso } from "react-virtuoso";
import { useTranslation } from "react-i18next";
import { closeAllConnections } from "@/services/api";
import { useConnectionSetting } from "@/services/states";
import { useClashInfo } from "@/hooks/use-clash";
import { BaseEmpty, BasePage } from "@/components/base";
import { ConnectionItem } from "@/components/connection/connection-item";
import { ConnectionTable } from "@/components/connection/connection-table";
import {
  ConnectionDetail,
  ConnectionDetailRef,
} from "@/components/connection/connection-detail";
import parseTraffic from "@/utils/parse-traffic";
import { useCustomTheme } from "@/components/layout/use-custom-theme";
import { BaseSearchBox } from "@/components/base/base-search-box";
import { BaseStyledSelect } from "@/components/base/base-styled-select";
import useSWRSubscription from "swr/subscription";
import { createSockette } from "@/utils/websocket";
import { tokens } from "./_theme";
import {
  GridKanbanRegular,
  TextBulletListRegular,
} from "@fluentui/react-icons";

const initConn: IConnections = {
  uploadTotal: 0,
  downloadTotal: 0,
  connections: [],
};

type OrderFunc = (list: IConnectionsItem[]) => IConnectionsItem[];

const ConnectionsPage = () => {
  const { t } = useTranslation();
  const { clashInfo } = useClashInfo();
  const { theme } = useCustomTheme();
  const isDark = theme.palette.mode === "dark";
  const [match, setMatch] = useState(() => (_: string) => true);
  const [curOrderOpt, setOrderOpt] = useState("Default");

  const [setting, setSetting] = useConnectionSetting();

  const isTableLayout = setting.layout === "table";

  const orderOpts: Record<string, OrderFunc> = {
    Default: (list) =>
      list.sort(
        (a, b) =>
          new Date(b.start || "0").getTime()! -
          new Date(a.start || "0").getTime()!
      ),
    "Upload Speed": (list) => list.sort((a, b) => b.curUpload! - a.curUpload!),
    "Download Speed": (list) =>
      list.sort((a, b) => b.curDownload! - a.curDownload!),
  };

  const { data: connData = initConn } = useSWRSubscription<
    IConnections,
    any,
    "getClashConnections" | null
  >(clashInfo ? "getClashConnections" : null, (_key, { next }) => {
    const { server = "", secret = "" } = clashInfo!;

    const s = createSockette(
      `ws://${server}/connections?token=${encodeURIComponent(secret)}`,
      {
        onmessage(event) {
          // meta v1.15.0 出现 data.connections 为 null 的情况
          const data = JSON.parse(event.data) as IConnections;
          // 尽量与前一次 connections 的展示顺序保持一致
          next(null, (old = initConn) => {
            const oldConn = old.connections;
            const maxLen = data.connections?.length;

            const connections: IConnectionsItem[] = [];

            const rest = (data.connections || []).filter((each) => {
              const index = oldConn.findIndex((o) => o.id === each.id);

              if (index >= 0 && index < maxLen) {
                const old = oldConn[index];
                each.curUpload = each.upload - old.upload;
                each.curDownload = each.download - old.download;

                connections[index] = each;
                return false;
              }
              return true;
            });

            for (let i = 0; i < maxLen; ++i) {
              if (!connections[i] && rest.length > 0) {
                connections[i] = rest.shift()!;
                connections[i].curUpload = 0;
                connections[i].curDownload = 0;
              }
            }

            return { ...data, connections };
          });
        },
        onerror(event) {
          next(event);
        },
      },
      3
    );

    return () => {
      s.close();
    };
  });

  const [filterConn, download, upload] = useMemo(() => {
    const orderFunc = orderOpts[curOrderOpt];
    let connections = connData.connections.filter((conn) =>
      match(conn.metadata.host || conn.metadata.destinationIP || "")
    );

    if (orderFunc) connections = orderFunc(connections);

    let download = 0;
    let upload = 0;
    connections.forEach((x) => {
      download += x.download;
      upload += x.upload;
    });
    return [connections, download, upload];
  }, [connData, match, curOrderOpt]);

  const onCloseAll = useLockFn(closeAllConnections);

  const detailRef = useRef<ConnectionDetailRef>(null!);

  return (
    <BasePage
      full
      title={<span style={{ whiteSpace: "nowrap" }}>{t("Connections")}</span>}
      contentStyle={{ height: "100%" }}
      header={
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ mx: 1 }}>
            {t("Downloaded")}: {parseTraffic(download)}
          </Box>
          <Box sx={{ mx: 1 }}>
            {t("Uploaded")}: {parseTraffic(upload)}
          </Box>
          <Button
            icon={
              isTableLayout ? <TextBulletListRegular /> : <GridKanbanRegular />
            }
            size="small"
            appearance="subtle"
            onClick={() =>
              setSetting((o) =>
                o?.layout !== "table"
                  ? { ...o, layout: "table" }
                  : { ...o, layout: "list" }
              )
            }
          />
          <Button onClick={onCloseAll}>
            <span style={{ whiteSpace: "nowrap" }}>{t("Close All")}</span>
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
          userSelect: "text",
        }}
      >
        {!isTableLayout && (
          <BaseStyledSelect
            value={curOrderOpt}
            onChange={(e) => setOrderOpt(e.target.value)}
          >
            {Object.keys(orderOpts).map((opt) => (
              <MenuItem key={opt} value={opt}>
                <span style={{ fontSize: 14 }}>{t(opt)}</span>
              </MenuItem>
            ))}
          </BaseStyledSelect>
        )}
        <BaseSearchBox onSearch={(match) => setMatch(() => match)} />
      </Box>

      <Box
        height="calc(100% - 65px)"
        sx={{
          userSelect: "text",
          margin: "10px",
          borderRadius: "8px",
          bgcolor: tokens.surface1,
        }}
      >
        {filterConn.length === 0 ? (
          <BaseEmpty />
        ) : isTableLayout ? (
          <ConnectionTable
            connections={filterConn}
            onShowDetail={(detail) => detailRef.current?.open(detail)}
          />
        ) : (
          <Virtuoso
            data={filterConn}
            itemContent={(_, item) => (
              <ConnectionItem
                value={item}
                onShowDetail={() => detailRef.current?.open(item)}
              />
            )}
          />
        )}
      </Box>
      <ConnectionDetail ref={detailRef} />
    </BasePage>
  );
};

export default ConnectionsPage;

import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { TextField, Select, MenuItem, Typography } from "@mui/material";
import {
  SettingsRounded,
  ShuffleRounded,
  LanRounded,
} from "@mui/icons-material";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Switch as FluentSwitch,
  MenuItem as FluentMenuItem,
  MenuItemRadio,
  makeStyles,
  Tooltip,
  Button,
  Caption1,
  Body2,
} from "@fluentui/react-components";
import { DialogRef, Notice, Switch } from "@/components/base";
import { useClash } from "@/hooks/use-clash";
import { GuardState } from "./mods/guard-state";
import { WebUIViewer } from "./mods/web-ui-viewer";
import { ClashPortViewer } from "./mods/clash-port-viewer";
import { ControllerViewer } from "./mods/controller-viewer";
import {
  SettingList,
  SettingItem,
  FluentSettingItem,
  FluentSettingList,
} from "./mods/setting-comp";
import { useSettingSystemStyle } from "./setting-system";
import { ConnectedRegular, SettingsRegular } from "@fluentui/react-icons";
import { ClashCoreViewer } from "./mods/clash-core-viewer";
import { invoke_uwp_tool } from "@/services/cmds";
import getSystem from "@/utils/get-system";
import { useVerge } from "@/hooks/use-verge";
import { updateGeoData } from "@/services/api";
import {
  TooltipIcon,
  FluentTooltipIcon,
} from "@/components/base/base-tooltip-icon";
import { NetworkInterfaceViewer } from "./mods/network-interface-viewer";

const useStyles = makeStyles({
  expander: {
    height: "72px",
  },
});

const isWIN = getSystem() === "windows";

interface Props {
  onError: (err: Error) => void;
}

const SettingClash = ({ onError }: Props) => {
  const { t } = useTranslation();

  const { clash, version, mutateClash, patchClash } = useClash();
  const { verge, mutateVerge, patchVerge } = useVerge();

  const {
    ipv6,
    "allow-lan": allowLan,
    "log-level": logLevel,
    "unified-delay": unifiedDelay,
  } = clash ?? {};

  const { enable_random_port = false, verge_mixed_port } = verge ?? {};

  const webRef = useRef<DialogRef>(null);
  const portRef = useRef<DialogRef>(null);
  const ctrlRef = useRef<DialogRef>(null);
  const coreRef = useRef<DialogRef>(null);
  const networkRef = useRef<DialogRef>(null);

  const onSwitchFormat = (_e: any, data: { checked: boolean }) => data.checked;
  const onChangeData = (patch: Partial<IConfigData>) => {
    mutateClash((old) => ({ ...(old! || {}), ...patch }), false);
  };
  const onChangeVerge = (patch: Partial<IVergeConfig>) => {
    mutateVerge({ ...verge, ...patch }, false);
  };
  const onUpdateGeo = async () => {
    try {
      await updateGeoData();
      Notice.success(t("GeoData Updated"));
    } catch (err: any) {
      Notice.error(err?.response.data.message || err.toString());
    }
  };

  const classes = useStyles();
  const settingsClasses = useSettingSystemStyle();

  return (
    <FluentSettingList title={t("Clash Setting")}>
      <WebUIViewer ref={webRef} />
      {/* <ClashPortViewer ref={portRef} /> */}
      <ControllerViewer ref={ctrlRef} />
      <ClashCoreViewer ref={coreRef} />
      <NetworkInterfaceViewer ref={networkRef} />

      {/* <SettingItem
        label={t("Allow Lan")}
        extra={
          <TooltipIcon
            title={t("Network Interface")}
            color={"inherit"}
            icon={LanRounded}
            onClick={() => {
              networkRef.current?.open();
            }}
          />
        }
      >
        <GuardState
          value={allowLan ?? false}
          valueProps="checked"
          onCatch={onError}
          onFormat={onSwitchFormat}
          onChange={(e) => onChangeData({ "allow-lan": e })}
          onGuard={(e) => patchClash({ "allow-lan": e })}
        >
          <Switch edge="end" />
        </GuardState>
      </SettingItem> */}

      <FluentSettingItem label={t("Allow Lan")}>
        <Button
          icon={<ConnectedRegular />}
          appearance="subtle"
          onClick={() => networkRef.current?.open()}
          title={t("Network Interface")}
        />
        <GuardState
          value={allowLan ?? false}
          valueProps="checked"
          onCatch={onError}
          onFormat={onSwitchFormat}
          onChange={(e) => onChangeData({ "allow-lan": e })}
          onGuard={(e) => patchClash({ "allow-lan": e })}
        >
          <FluentSwitch />
        </GuardState>
      </FluentSettingItem>

      <FluentSettingItem label={t("IPv6")}>
        <GuardState
          value={ipv6 ?? false}
          valueProps="checked"
          onCatch={onError}
          onFormat={onSwitchFormat}
          onChange={(e) => onChangeData({ ipv6: e })}
          onGuard={(e) => patchClash({ ipv6: e })}
        >
          <FluentSwitch />
        </GuardState>
      </FluentSettingItem>

      <FluentSettingItem
        label={t("Unified Delay")}
        extra={<FluentTooltipIcon title={t("Unified Delay Info")} />}
        // extra={
        //   <TooltipIcon
        //     title={t("Unified Delay Info")}
        //     sx={{ opacity: "0.7" }}
        //   />
        // }
      >
        <GuardState
          value={unifiedDelay ?? false}
          valueProps="checked"
          onCatch={onError}
          onFormat={onSwitchFormat}
          onChange={(e) => onChangeData({ "unified-delay": e })}
          onGuard={(e) => patchClash({ "unified-delay": e })}
        >
          <FluentSwitch />
        </GuardState>
      </FluentSettingItem>

      <FluentSettingItem
        label={t("Log Level")}
        extra={
          <FluentTooltipIcon
            title={t("Log Level Info")}
            sx={{ opacity: "0.7" }}
          />
        }
      >
        <GuardState
          // clash premium 2022.08.26 值为warn
          // value={logLevel === "warn" ? "warning" : (logLevel ?? "info")}
          value={{
            level: [logLevel === "warn" ? "warning" : (logLevel ?? "info")],
          }}
          onCatch={onError}
          // onFormat={(e: any) => e.target.value}
          onFormat={(_, data) => data.checkedItems[0]}
          onChange={(e) => onChangeData({ "log-level": e })}
          onGuard={(e) => patchClash({ "log-level": e })}
          onChangeProps="onCheckedValueChange"
          valueProps="checkedValues"
        >
          {/* <Select size="small" sx={{ width: 100, "> div": { py: "7.5px" } }}>
            <MenuItem value="debug">Debug</MenuItem>
            <MenuItem value="info">Info</MenuItem>
            <MenuItem value="warning">Warn</MenuItem>
            <MenuItem value="error">Error</MenuItem>
            <MenuItem value="silent">Silent</MenuItem>
          </Select> */}
          <Menu>
            <MenuTrigger>
              <MenuButton>{logLevel}</MenuButton>
            </MenuTrigger>
            <MenuPopover>
              <MenuList>
                <MenuItemRadio name="level" value="debug">
                  Debug
                </MenuItemRadio>
                <MenuItemRadio name="level" value="info">
                  Info
                </MenuItemRadio>
                <MenuItemRadio name="level" value="warning">
                  Warn
                </MenuItemRadio>
                <MenuItemRadio name="level" value="error">
                  Error
                </MenuItemRadio>
                <MenuItemRadio name="level" value="silent">
                  Silent
                </MenuItemRadio>
              </MenuList>
            </MenuPopover>
          </Menu>
        </GuardState>
      </FluentSettingItem>

      <FluentSettingItem
        label={t("Port Config")}
        canExpand
        // extra={
        //   <TooltipIcon
        //     title={t("Random Port")}
        //     color={enable_random_port ? "primary" : "inherit"}
        //     icon={ShuffleRounded}
        //     onClick={() => {
        //       Notice.success(
        //         t("Restart Application to Apply Modifications"),
        //         1000,
        //       );
        //       onChangeVerge({ enable_random_port: !enable_random_port });
        //       patchVerge({ enable_random_port: !enable_random_port });
        //     }}
        //   />
        // }
        content={<ClashPortViewer ref={portRef} />}
      >
        {/* <TextField
          autoComplete="new-password"
          disabled={enable_random_port}
          size="small"
          value={verge_mixed_port ?? 7897}
          sx={{ width: 100, input: { py: "7.5px", cursor: "pointer" } }}
          onClick={(e) => {
            portRef.current?.open();
            (e.target as any).blur();
          }}
        /> */}
      </FluentSettingItem>

      <FluentSettingItem
        onClick={() => ctrlRef.current?.open()}
        label={t("External")}
      />

      <FluentSettingItem
        onClick={() => webRef.current?.open()}
        label={t("Web UI")}
      />

      <FluentSettingItem
        label={t("Clash Core")}
        // extra={
        //   <FluentTooltipIcon
        //     icon={SettingsRounded}
        //     onClick={() => coreRef.current?.open()}
        //   />
        // }
        onClick={() => coreRef.current?.open()}
      >
        {/* <Typography sx={{ py: "7px", pr: 1 }}>{version}</Typography> */}
        <Body2>{version}</Body2>
      </FluentSettingItem>

      {isWIN && (
        <FluentSettingItem
          onClick={invoke_uwp_tool}
          label={t("Open UWP tool")}
          extra={
            <FluentTooltipIcon
              title={t("Open UWP tool Info")}
              sx={{ opacity: "0.7" }}
            />
          }
        />
      )}

      <FluentSettingItem onClick={onUpdateGeo} label={t("Update GeoData")} />
    </FluentSettingList>
  );
};

export default SettingClash;

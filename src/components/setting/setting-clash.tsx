import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { TextField, Select, Typography } from "@mui/material";

import { Settings, Shuffle } from "@mui/icons-material";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Switch,
  MenuItem,
  MenuItemRadio,
  makeStyles,
  Tooltip,
  Button,
  Caption1,
} from "@fluentui/react-components";
import { DialogRef, Notice } from "@/components/base";
import { useClash } from "@/hooks/use-clash";
import { GuardState } from "./mods/guard-state";
import { WebUIViewer } from "./mods/web-ui-viewer";
import { ClashPort, ClashPortViewer } from "./mods/clash-port-viewer";
import { ControllerViewer } from "./mods/controller-viewer";
import {
  SettingItem,
  FluentSettingList,
  FluentSettingItem,
} from "./mods/setting-comp";
import { ClashCoreViewer } from "./mods/clash-core-viewer";
import { invoke_uwp_tool } from "@/services/cmds";
import getSystem from "@/utils/get-system";
import { useVerge } from "@/hooks/use-verge";
import { updateGeoData } from "@/services/api";
import { TooltipIcon } from "@/components/base/base-tooltip-icon";
import { SettingsRegular } from "@fluentui/react-icons";
import { useSettingSystemStyle } from "./setting-system";

const isWIN = getSystem() === "windows";

const useStyles = makeStyles({
  expander: {
    height: "72px",
  },
});

interface Props {
  onError: (err: Error) => void;
}

const SettingClash = ({ onError }: Props) => {
  const { t } = useTranslation();

  const { clash, version, mutateClash, patchClash } = useClash();
  const { verge, mutateVerge, patchVerge } = useVerge();

  const { ipv6, "allow-lan": allowLan, "log-level": logLevel } = clash ?? {};

  const { enable_random_port = false, verge_mixed_port } = verge ?? {};

  const webRef = useRef<DialogRef>(null);
  const portRef = useRef<DialogRef>(null);
  const ctrlRef = useRef<DialogRef>(null);
  const coreRef = useRef<DialogRef>(null);

  const onSwitchFormat = (_e: any, value: boolean) => value;
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
      <ClashPortViewer ref={portRef} />
      <ControllerViewer ref={ctrlRef} />
      <ClashCoreViewer ref={coreRef} />

      <FluentSettingItem label={t("Allow Lan")}>
        <GuardState
          value={allowLan ?? false}
          valueProps="checked"
          onCatch={onError}
          onFormat={onSwitchFormat}
          onChange={(e) => onChangeData({ "allow-lan": e })}
          onGuard={(e) => patchClash({ "allow-lan": e })}
        >
          <Switch />
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
          <Switch />
        </GuardState>
      </FluentSettingItem>

      <FluentSettingItem label={t("Log Level")}>
        <GuardState
          // clash premium 2022.08.26 值为warn
          value={{
            level: [logLevel === "warn" ? "warning" : logLevel ?? "info"],
          }}
          onCatch={onError}
          onFormat={(_, data) => data.checkedItems[0]}
          onChange={(e) => onChangeData({ "log-level": e })}
          onGuard={(e) => patchClash({ "log-level": e })}
          onChangeProps="onCheckedValueChange"
          valueProps="checkedValues"
        >
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
          {/* <Select size="small" sx={{ width: 100, "> div": { py: "7.5px" } }}>
            <MenuItem value="debug">Debug</MenuItem>
            <MenuItem value="info">Info</MenuItem>
            <MenuItem value="warning">Warn</MenuItem>
            <MenuItem value="error">Error</MenuItem>
            <MenuItem value="silent">Silent</MenuItem>
          </Select> */}
        </GuardState>
      </FluentSettingItem>

      <FluentSettingItem
        label={t("Port Config")}
        canExpand
        extra={
          <TooltipIcon
            title={t("Random Port")}
            color={enable_random_port ? "primary" : "inherit"}
            icon={Shuffle}
            onClick={() => {
              Notice.success(
                t("Restart Application to Apply Modifications"),
                1000
              );
              onChangeVerge({ enable_random_port: !enable_random_port });
              patchVerge({ enable_random_port: !enable_random_port });
            }}
          />
        }
        content={<ClashPort />}
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

      <FluentSettingItem label={t("Clash Core")}>
        <Typography sx={{ py: "7px", pr: 1 }}>{version}</Typography>
        <Button
          icon={<SettingsRegular />}
          appearance="subtle"
          onClick={() => coreRef.current?.open()}
        />
      </FluentSettingItem>

      {isWIN && (
        <FluentSettingItem
          onClick={invoke_uwp_tool}
          label={
            <div>
              {t("Open UWP tool")}
              <Caption1 className={settingsClasses.caption}>
                {t("Open UWP tool Info")}
              </Caption1>
            </div>
          }
        />
      )}

      <FluentSettingItem onClick={onUpdateGeo} label={t("Update GeoData")} />
    </FluentSettingList>
  );
};

export default SettingClash;

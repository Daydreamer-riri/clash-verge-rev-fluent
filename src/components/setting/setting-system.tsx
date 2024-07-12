import useSWR from "swr";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { PrivacyTipRounded, Settings } from "@mui/icons-material";
import { checkService } from "@/services/cmds";
import { useVerge } from "@/hooks/use-verge";
import { DialogRef } from "@/components/base";
import {
  SettingList,
  SettingItem,
  FluentSettingList,
} from "./mods/setting-comp";
import { GuardState } from "./mods/guard-state";
import { ServiceViewer } from "./mods/service-viewer";
import { SysproxyViewer } from "./mods/sysproxy-viewer";
import { TunViewer } from "./mods/tun-viewer";
import { TooltipIcon } from "@/components/base/base-tooltip-icon";
import { Expander } from "../base/Expander";
import { Button, Switch, Tooltip } from "@fluentui/react-components";
import { InfoRegular, SettingsRegular } from "@fluentui/react-icons";

interface Props {
  onError?: (err: Error) => void;
}

const SettingSystem = ({ onError }: Props) => {
  const { t } = useTranslation();

  const { verge, mutateVerge, patchVerge } = useVerge();

  // service mode
  const { data: serviceStatus } = useSWR("checkService", checkService, {
    revalidateIfStale: false,
    shouldRetryOnError: false,
    focusThrottleInterval: 36e5, // 1 hour
  });

  const serviceRef = useRef<DialogRef>(null);
  const sysproxyRef = useRef<DialogRef>(null);
  const tunRef = useRef<DialogRef>(null);

  const {
    enable_tun_mode,
    enable_auto_launch,
    enable_service_mode,
    enable_silent_start,
    enable_system_proxy,
  } = verge ?? {};

  const onSwitchFormat = (_e: any, { checked: value }: { checked: boolean }) =>
    value;
  const onChangeData = (patch: Partial<IVergeConfig>) => {
    mutateVerge({ ...verge, ...patch }, false);
  };

  return (
    <>
      <FluentSettingList title={t("System Setting")}>
        <SysproxyViewer ref={sysproxyRef} />
        <TunViewer ref={tunRef} />
        <ServiceViewer ref={serviceRef} enable={!!enable_service_mode} />

        <Expander
          left={
            <>
              {t("Tun Mode")}
              <Tooltip relationship="description" content={t("Tun Mode Info")}>
                <Button
                  onClick={() => tunRef.current?.open()}
                  size="small"
                  appearance="subtle"
                  icon={<SettingsRegular fontSize={16} />}
                />
              </Tooltip>
            </>
          }
          right={
            <GuardState
              value={enable_tun_mode ?? false}
              valueProps="checked"
              onCatch={onError}
              onFormat={onSwitchFormat}
              onChange={(e) => onChangeData({ enable_tun_mode: e })}
              onGuard={(e) => patchVerge({ enable_tun_mode: e })}
            >
              <Switch />
            </GuardState>
          }
        ></Expander>

        <Expander
          left={
            <>
              {t("Service Mode")}
              <Tooltip
                relationship="description"
                content={t("Service Mode Info")}
              >
                <Button
                  onClick={() => serviceRef.current?.open()}
                  size="small"
                  appearance="subtle"
                  icon={<SettingsRegular fontSize={16} />}
                />
              </Tooltip>
            </>
          }
          right={
            <GuardState
              value={enable_service_mode ?? false}
              valueProps="checked"
              onCatch={onError}
              onFormat={onSwitchFormat}
              onChange={(e) => onChangeData({ enable_service_mode: e })}
              onGuard={(e) => patchVerge({ enable_service_mode: e })}
            >
              <Switch
                disabled={
                  serviceStatus !== "active" && serviceStatus !== "installed"
                }
              />
            </GuardState>
          }
        ></Expander>

        <Expander
          left={
            <>
              {t("System Proxy")}
              <Tooltip
                relationship="description"
                content={t("System Proxy Info")}
              >
                <Button
                  onClick={() => sysproxyRef.current?.open()}
                  size="small"
                  appearance="subtle"
                  icon={<SettingsRegular fontSize={16} />}
                />
              </Tooltip>
            </>
          }
          right={
            <GuardState
              value={enable_system_proxy ?? false}
              valueProps="checked"
              onCatch={onError}
              onFormat={onSwitchFormat}
              onChange={(e) => onChangeData({ enable_system_proxy: e })}
              onGuard={(e) => patchVerge({ enable_system_proxy: e })}
            >
              <Switch />
            </GuardState>
          }
        />
        <Expander
          left={t("Auto Launch")}
          right={
            <GuardState
              value={enable_auto_launch ?? false}
              valueProps="checked"
              onCatch={onError}
              onFormat={onSwitchFormat}
              onChange={(e) => onChangeData({ enable_auto_launch: e })}
              onGuard={(e) => patchVerge({ enable_auto_launch: e })}
            >
              <Switch />
            </GuardState>
          }
        />

        <Expander
          left={
            <>
              {t("Silent Start")}
              <Tooltip
                relationship="description"
                content={t("Silent Start Info")}
              >
                <InfoRegular style={{ marginLeft: 8 }} />
              </Tooltip>
            </>
          }
          right={
            <GuardState
              value={enable_silent_start ?? false}
              valueProps="checked"
              onCatch={onError}
              onFormat={onSwitchFormat}
              onChange={(e) => onChangeData({ enable_silent_start: e })}
              onGuard={(e) => patchVerge({ enable_silent_start: e })}
            >
              <Switch />
            </GuardState>
          }
        />
      </FluentSettingList>
    </>
  );
};

export default SettingSystem;

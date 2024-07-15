import { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { open } from "@tauri-apps/api/dialog";
import {
  Button,
  MenuItem,
  Select,
  Input,
  Typography,
  Box,
} from "@mui/material";
import {
  exitApp,
  openAppDir,
  openCoreDir,
  openLogsDir,
  openDevTools,
  copyClashEnv,
} from "@/services/cmds";
import { checkUpdate } from "@tauri-apps/api/updater";
import { useVerge } from "@/hooks/use-verge";
import { version } from "@root/package.json";
import { DialogRef, Notice } from "@/components/base";
import {
  SettingList,
  SettingItem,
  FluentSettingList,
  FluentSettingItem,
} from "./mods/setting-comp";
import { ThemeModeSwitch } from "./mods/theme-mode-switch";
import { ConfigViewer } from "./mods/config-viewer";
import { HotkeyViewer } from "./mods/hotkey-viewer";
import { MiscViewer } from "./mods/misc-viewer";
import { ThemeViewer } from "./mods/theme-viewer";
import { GuardState } from "./mods/guard-state";
import { LayoutViewer } from "./mods/layout-viewer";
import { UpdateViewer } from "./mods/update-viewer";
import getSystem from "@/utils/get-system";
import { routers } from "@/pages/_routers";
import {
  Caption2,
  Dropdown,
  Menu,
  MenuButton,
  MenuItemRadio,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Option,
  Button as FluentButton,
} from "@fluentui/react-components";
import { useSettingSystemStyle } from "./setting-system";
import { TooltipIcon } from "@/components/base/base-tooltip-icon";
import { ContentCopyRounded } from "@mui/icons-material";
import { CopyRegular } from "@fluentui/react-icons";

interface Props {
  onError?: (err: Error) => void;
}

const OS = getSystem();

const SettingVerge = ({ onError }: Props) => {
  const { t } = useTranslation();

  const { verge, patchVerge, mutateVerge } = useVerge();
  const {
    theme_mode,
    language,
    tray_event,
    env_type,
    startup_script,
    start_page,
  } = verge ?? {};
  const configRef = useRef<DialogRef>(null);
  const hotkeyRef = useRef<DialogRef>(null);
  const miscRef = useRef<DialogRef>(null);
  const themeRef = useRef<DialogRef>(null);
  const layoutRef = useRef<DialogRef>(null);
  const updateRef = useRef<DialogRef>(null);

  const onChangeData = (patch: Partial<IVergeConfig>) => {
    mutateVerge({ ...verge, ...patch }, false);
  };

  const onCheckUpdate = async () => {
    try {
      const info = await checkUpdate();
      if (!info?.shouldUpdate) {
        Notice.success(t("Currently on the Latest Version"));
      } else {
        updateRef.current?.open();
      }
    } catch (err: any) {
      Notice.error(err.message || err.toString());
    }
  };
  const settingsClasses = useSettingSystemStyle();

  const onCopyClashEnv = useCallback(async () => {
    await copyClashEnv();
    Notice.success(t("Copy Success"), 1000);
  }, []);

  return (
    <FluentSettingList title={t("Verge Setting")}>
      <ThemeViewer ref={themeRef} />
      <ConfigViewer ref={configRef} />
      <HotkeyViewer ref={hotkeyRef} />
      <MiscViewer ref={miscRef} />
      <LayoutViewer ref={layoutRef} />
      <UpdateViewer ref={updateRef} />

      <FluentSettingItem label={t("Language")}>
        <GuardState
          value={{ language: language ?? "en" }}
          onCatch={onError}
          onFormat={(_, data) => data.checkedItems[0]}
          onChange={(e) => onChangeData({ language: e })}
          onGuard={(e) => patchVerge({ language: e })}
          onChangeProps="onCheckedValueChange"
          valueProps="checkedValues"
        >
          <Menu>
            <MenuTrigger>
              <MenuButton>
                {
                  { zh: "中文", en: "English", ru: "Русский", fa: "فارسی" }[
                    language ?? "en"
                  ]
                }
              </MenuButton>
            </MenuTrigger>
            <MenuPopover>
              <MenuList>
                <MenuItemRadio name="language" value="zh">
                  中文
                </MenuItemRadio>
                <MenuItemRadio name="language" value="en">
                  English
                </MenuItemRadio>
                <MenuItemRadio name="language" value="ru">
                  Русский
                </MenuItemRadio>
                <MenuItemRadio name="language" value="fa">
                  فارسی
                </MenuItemRadio>
              </MenuList>
            </MenuPopover>
          </Menu>
        </GuardState>
      </FluentSettingItem>

      <FluentSettingItem label={t("Theme Mode")}>
        <GuardState
          value={{ theme_mode: theme_mode ?? "system" }}
          onFormat={(_, data) => data.checkedItems[0]}
          onCatch={onError}
          onChange={(e) => onChangeData({ theme_mode: e })}
          onGuard={(e) => patchVerge({ theme_mode: e })}
          onChangeProps="onCheckedValueChange"
          valueProps="checkedValues"
        >
          <Menu>
            <MenuTrigger>
              <MenuButton>
                {
                  {
                    system: t("theme.system"),
                    light: t("theme.light"),
                    dark: t("theme.dark"),
                  }[theme_mode ?? "system"]
                }
              </MenuButton>
            </MenuTrigger>
            <MenuPopover>
              <MenuList>
                <MenuItemRadio name="theme_mode" value="system">
                  {t(`theme.system`)}
                </MenuItemRadio>
                <MenuItemRadio name="theme_mode" value="light">
                  {t(`theme.light`)}
                </MenuItemRadio>
                <MenuItemRadio name="theme_mode" value="dark">
                  {t(`theme.dark`)}
                </MenuItemRadio>
              </MenuList>
            </MenuPopover>
          </Menu>
        </GuardState>
      </FluentSettingItem>

      {OS !== "linux" && (
        <FluentSettingItem label={t("Tray Click Event")}>
          <GuardState
            value={{ tray: tray_event ?? "main_window" }}
            onCatch={onError}
            onFormat={(_, data) => data.checkedItems[0]}
            onChange={(e) => onChangeData({ tray_event: e })}
            onGuard={(e) => patchVerge({ tray_event: e })}
            onChangeProps="onCheckedValueChange"
            valueProps="checkedValues"
          >
            <Menu>
              <MenuTrigger>
                <MenuButton>
                  {
                    {
                      main_window: t("Show Main Window"),
                      system_proxy: t("System Proxy"),
                      tun_mode: t("Tun Mode"),
                      disable: t("Disable"),
                    }[tray_event ?? "main_window"]
                  }
                </MenuButton>
              </MenuTrigger>
              <MenuPopover>
                <MenuList>
                  <MenuItemRadio name="tray" value="main_window">
                    {t("Show Main Window")}
                  </MenuItemRadio>
                  <MenuItemRadio name="tray" value="system_proxy">
                    {t("System Proxy")}
                  </MenuItemRadio>
                  <MenuItemRadio name="tray" value="tun_mode">
                    {t("Tun Mode")}
                  </MenuItemRadio>
                  <MenuItemRadio name="tray" value="disable">
                    {t("Disable")}
                  </MenuItemRadio>
                </MenuList>
              </MenuPopover>
            </Menu>
          </GuardState>
        </FluentSettingItem>
      )}

      <FluentSettingItem label={t("Copy Env Type")}>
        <FluentButton
          onClick={onCopyClashEnv}
          icon={<CopyRegular />}
          appearance="subtle"
        />
        <GuardState
          value={{
            env_type: env_type ?? (OS === "windows" ? "powershell" : "bash"),
          }}
          onCatch={onError}
          onFormat={(_, data) => data.checkedItems[0]}
          onChange={(e) => onChangeData({ env_type: e })}
          onGuard={(e) => patchVerge({ env_type: e })}
          onChangeProps="onCheckedValueChange"
          valueProps="checkedValues"
        >
          <Menu>
            <MenuTrigger>
              <MenuButton>{env_type}</MenuButton>
            </MenuTrigger>
            <MenuPopover>
              <MenuList>
                <MenuItemRadio name="env_type" value="bash">
                  bash
                </MenuItemRadio>
                <MenuItemRadio name="env_type" value="cmd">
                  cmd
                </MenuItemRadio>
                <MenuItemRadio name="env_type" value="powershell">
                  powershell
                </MenuItemRadio>
              </MenuList>
            </MenuPopover>
          </Menu>
        </GuardState>
      </FluentSettingItem>

      <FluentSettingItem label={t("Start Page")}>
        <GuardState
          value={{ start_page: start_page ?? "/" }}
          onCatch={onError}
          onFormat={(_, data) => data.checkedItems[0]}
          onChange={(e) => onChangeData({ start_page: e })}
          onGuard={(e) => patchVerge({ start_page: e })}
          onChangeProps="onCheckedValueChange"
          valueProps="checkedValues"
        >
          <Menu>
            <MenuTrigger>
              <MenuButton>
                {t(
                  routers.find((item) => item.path === (start_page ?? "/"))!
                    .label
                )}
              </MenuButton>
            </MenuTrigger>
            <MenuPopover>
              <MenuList>
                {routers.map((page: { label: string; path: string }) => {
                  return (
                    <MenuItemRadio name="start_page" value={page.path}>
                      {t(page.label)}
                    </MenuItemRadio>
                  );
                })}
              </MenuList>
            </MenuPopover>
          </Menu>
        </GuardState>
      </FluentSettingItem>

      <FluentSettingItem label={t("Startup Script")}>
        <GuardState
          value={startup_script ?? ""}
          onCatch={onError}
          onFormat={(e: any) => e.target.value}
          onChange={(e) => onChangeData({ startup_script: e })}
          onGuard={(e) => patchVerge({ startup_script: e })}
        >
          <Input
            value={startup_script}
            disabled
            sx={{ width: 230 }}
            endAdornment={
              <>
                <Button
                  onClick={async () => {
                    const path = await open({
                      directory: false,
                      multiple: false,
                      filters: [
                        {
                          name: "Shell Script",
                          extensions: ["sh", "bat", "ps1"],
                        },
                      ],
                    });
                    if (path?.length) {
                      onChangeData({ startup_script: `${path}` });
                      patchVerge({ startup_script: `${path}` });
                    }
                  }}
                >
                  {t("Browse")}
                </Button>
                {startup_script && (
                  <Button
                    onClick={async () => {
                      onChangeData({ startup_script: "" });
                      patchVerge({ startup_script: "" });
                    }}
                  >
                    {t("Clear")}
                  </Button>
                )}
              </>
            }
          ></Input>
        </GuardState>
      </FluentSettingItem>

      <FluentSettingItem
        onClick={() => themeRef.current?.open()}
        label={t("Theme Setting")}
      />

      <FluentSettingItem
        onClick={() => layoutRef.current?.open()}
        label={t("Layout Setting")}
      />

      <FluentSettingItem
        onClick={() => miscRef.current?.open()}
        label={t("Miscellaneous")}
      />

      <FluentSettingItem
        onClick={() => hotkeyRef.current?.open()}
        label={t("Hotkey Setting")}
      />

      <FluentSettingItem
        onClick={() => configRef.current?.open()}
        label={t("Runtime Config")}
      />

      <FluentSettingItem onClick={openAppDir} label={t("Open App Dir")} />

      <FluentSettingItem onClick={openCoreDir} label={t("Open Core Dir")} />

      <FluentSettingItem onClick={openLogsDir} label={t("Open Logs Dir")} />

      <FluentSettingItem
        onClick={onCheckUpdate}
        label={t("Check for Updates")}
      />

      <FluentSettingItem onClick={openDevTools} label={t("Open Dev Tools")} />

      <FluentSettingItem
        onClick={() => {
          exitApp();
        }}
        label={t("Exit")}
      />

      <FluentSettingItem
        label={
          <div>
            {t("Verge Version")}
            <Caption2 className={settingsClasses.caption}>v{version}</Caption2>
          </div>
        }
      ></FluentSettingItem>
    </FluentSettingList>
  );
};

export default SettingVerge;

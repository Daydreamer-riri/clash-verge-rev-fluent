import dayjs from "dayjs";
import i18next from "i18next";
import relativeTime from "dayjs/plugin/relativeTime";
import { SWRConfig, mutate } from "swr";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useRoutes } from "react-router-dom";
import { List, Paper, ThemeProvider, SvgIcon } from "@mui/material";
import {
  TabList,
  Tab,
  FluentProvider,
  Button,
  webLightTheme,
  webDarkTheme,
  Theme,
  Subtitle2Stronger,
  Caption1Stronger,
  makeStyles,
  Toaster,
} from "@fluentui/react-components";
import { listen } from "@tauri-apps/api/event";
import { appWindow } from "@tauri-apps/api/window";
import { routers } from "./_routers";
import { getAxios } from "@/services/api";
import { useVerge } from "@/hooks/use-verge";
import LogoSvg from "@/assets/image/logo.svg?react";
import logo from "@/assets/image/app-icon.png";
import iconLight from "@/assets/image/icon_light.svg?react";
import iconDark from "@/assets/image/icon_dark.svg?react";
import { useThemeMode } from "@/services/states";
import { Notice } from "@/components/base";
import { FluentLayoutItem, LayoutItem } from "@/components/layout/layout-item";
import { LayoutControl } from "@/components/layout/layout-control";
import { LayoutTraffic } from "@/components/layout/layout-traffic";
import { UpdateButton } from "@/components/layout/update-button";
import { useCustomTheme } from "@/components/layout/use-custom-theme";
import getSystem from "@/utils/get-system";
import "dayjs/locale/ru";
import "dayjs/locale/zh-cn";
import { getPortableFlag } from "@/services/cmds";
import { useNavigate } from "react-router-dom";
import React from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { invoke } from "@tauri-apps/api/tauri";
import { darkTheme, lightTheme } from "./_theme";
export let portableFlag = false;

dayjs.extend(relativeTime);

const OS = getSystem();

const useStyle = makeStyles({
  logoText: {
    background: "linear-gradient(90deg, #4b50c9 0%, #4fdfd8 100%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
});

const Layout = () => {
  const mode = useThemeMode();
  const isDark = mode === "light" ? false : true;
  const { t } = useTranslation();
  const { theme } = useCustomTheme();

  const { verge } = useVerge();
  const { language, start_page, theme_mode } = verge || {};
  const navigate = useNavigate();
  const location = useLocation();
  const routersEles = useRoutes(routers);
  if (!routersEles) return null;

  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      // macOS有cmd+w
      if (e.key === "Escape" && OS !== "macos") {
        appWindow.close();
      }
    });

    listen("verge://refresh-clash-config", async () => {
      // the clash info may be updated
      await getAxios(true);
      mutate("getProxies");
      mutate("getVersion");
      mutate("getClashConfig");
      mutate("getProxyProviders");
    });

    // update the verge config
    listen("verge://refresh-verge-config", () => mutate("getVergeConfig"));

    // 设置提示监听
    listen("verge://notice-message", ({ payload }) => {
      const [status, msg] = payload as [string, string];
      switch (status) {
        case "set_config::ok":
          Notice.success(t("Clash Config Updated"));
          break;
        case "set_config::error":
          Notice.error(msg);
          break;
        default:
          break;
      }
    });

    setTimeout(async () => {
      portableFlag = await getPortableFlag();
      await appWindow.unminimize();
      await appWindow.show();
      await appWindow.setFocus();
    }, 50);
  }, []);

  useEffect(() => {
    if (language) {
      dayjs.locale(language === "zh" ? "zh-cn" : language);
      i18next.changeLanguage(language);
    }
    if (start_page) {
      navigate(start_page);
    }
  }, [language, start_page]);

  const classes = useStyle();

  return (
    <SWRConfig value={{ errorRetryCount: 3 }}>
      <ThemeProvider theme={theme}>
        <FluentProviderWithTheme>
          <Toaster />
          <Paper
            square
            elevation={0}
            className={`${OS} layout`}
            onContextMenu={(e) => {
              // only prevent it on Windows
              const validList = ["input", "textarea"];
              const target = e.currentTarget;
              if (
                OS === "windows" &&
                !(
                  validList.includes(target.tagName.toLowerCase()) ||
                  target.isContentEditable
                )
              ) {
                e.preventDefault();
              }
            }}
            sx={[
              ({ palette }) => ({
                bgcolor: "transparent",
              }),
              OS === "linux"
                ? {
                    borderRadius: "8px",
                    border: "2px solid var(--divider-color)",
                    width: "calc(100vw - 4px)",
                    height: "calc(100vh - 4px)",
                  }
                : {},
            ]}
          >
            <div
              className="layout__left"
              style={OS === "windows" ? { padding: "0 16px" } : {}}
            >
              <div
                className="the-logo"
                data-tauri-drag-region="true"
                style={{ paddingRight: 0 }}
              >
                <div
                  style={{
                    height: "27px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <img
                    src={logo}
                    style={{
                      marginTop: "-12px",
                      marginRight: "5px",
                      marginLeft: "-24px",
                      height: "48px",
                      width: "48px",
                    }}
                  ></img>
                  <Subtitle2Stronger>
                    Clash <span className={classes.logoText}>verge</span>
                  </Subtitle2Stronger>
                  {/* <SvgIcon
                    component={isDark ? iconDark : iconLight}
                    style={{
                      height: "36px",
                      width: "36px",
                      marginTop: "-3px",
                      marginRight: "5px",
                      marginLeft: "-3px",
                    }}
                    inheritViewBox
                  /> */}
                  {/* <LogoSvg fill={isDark ? "white" : "black"} /> */}
                </div>
                {<UpdateButton className="the-newbtn" />}
              </div>

              {OS === "windows" ? (
                renderFluentSideBar()
              ) : (
                <List className="the-menu">
                  {routers.map((router) => (
                    <LayoutItem
                      key={router.label}
                      to={router.path}
                      icon={router.icon}
                    >
                      {t(router.label)}
                    </LayoutItem>
                  ))}
                </List>
              )}

              <div className="the-traffic">
                <LayoutTraffic />
              </div>
            </div>

            <div className="layout__right">
              {OS !== "windows" && (
                <div className="the-bar">
                  <div
                    className="the-dragbar"
                    data-tauri-drag-region="true"
                    style={{ width: "100%" }}
                  ></div>
                  {OS !== "macos" && <LayoutControl />}
                </div>
              )}

              <TransitionGroup className="the-content">
                <CSSTransition
                  key={location.pathname}
                  timeout={300}
                  classNames="page"
                >
                  {React.cloneElement(routersEles, { key: location.pathname })}
                </CSSTransition>
              </TransitionGroup>
            </div>
          </Paper>
        </FluentProviderWithTheme>
      </ThemeProvider>
    </SWRConfig>
  );

  function renderFluentSideBar() {
    return (
      <TabList
        className="the-menu"
        size="medium"
        vertical
        selectedValue={location.pathname}
        onTabSelect={(e, value) => navigate(value.value as string)}
        // appearance="subtle"
      >
        {routers.map((router) => (
          <FluentLayoutItem
            key={router.label}
            to={router.path}
            icon={router.icon}
          >
            {t(router.label)}
          </FluentLayoutItem>
        ))}
      </TabList>
    );
  }
};

export default Layout;

function FluentProviderWithTheme({ children }: { children: React.ReactNode }) {
  webLightTheme.colorSubtleBackgroundHover = "rgba(0, 0, 0, 0.04)";
  const theme = useThemeMode();
  useEffect(() => {
    invoke("set_mica_theme", { isDark: theme === "dark" });
  }, [theme]);

  return (
    <FluentProvider
      theme={theme === "light" ? lightTheme : darkTheme}
      style={{ background: "transparent" }}
    >
      {children}
    </FluentProvider>
  );
}

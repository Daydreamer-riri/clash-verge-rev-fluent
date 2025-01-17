import getSystem from "@/utils/get-system";
import {
  themeToTokensObject,
  webDarkTheme,
  webLightTheme,
} from "@fluentui/react-components";
const OS = getSystem();

// default theme setting
export const defaultTheme = {
  primary_color: "#007AFF",
  secondary_color: "#FC9B76",
  primary_text: "#000000",
  secondary_text: "#3C3C4399",
  info_color: "#007AFF",
  error_color: "#FF3B30",
  warning_color: "#FF9500",
  success_color: "#06943D",
  background_color: "#F5F5F5",
  font_family: `-apple-system, BlinkMacSystemFont,"Microsoft YaHei UI", "Microsoft YaHei", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji"${
    OS === "windows" ? ", twemoji mozilla" : ""
  }`,
};

// dark mode
export const defaultDarkTheme = {
  ...defaultTheme,
  primary_color: "#0A84FF",
  secondary_color: "#FF9F0A",
  primary_text: "#FFFFFF",
  background_color: "#2E303D",
  secondary_text: "#EBEBF599",
  info_color: "#0A84FF",
  error_color: "#FF453A",
  warning_color: "#FF9F0A",
  success_color: "#30D158",
};

export const lightTheme = {
  ...webLightTheme,
  overlay1: "rgba(0, 0, 0, 0.04)",
  overlay1Hover: "rgba(0, 0, 0, 0.08)",
  overlay1Pressed: "rgba(0, 0, 0, 0.02)",
  surface1: "rgba(255, 255, 255, 0.6)",
  surface2: "rgba(255, 255, 255, 0.8)",
};

export const darkTheme = {
  ...webDarkTheme,
  overlay1: "rgba(255, 255, 255, 0.04)",
  overlay1Hover: "rgba(255, 255, 255, 0.08)",
  overlay1Pressed: "rgba(255, 255, 255, 0.02)",
  surface1: "rgba(255, 255, 255, 0.04)",
  surface2: "rgba(255, 255, 255, 0.08)",
};

export const tokens = themeToTokensObject(lightTheme);

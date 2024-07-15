import LogsPage from "./logs";
import ProxiesPage from "./proxies";
import TestPage from "./test";
import ProfilesPage from "./profiles";
import SettingsPage from "./settings";
import ConnectionsPage from "./connections";
import RulesPage from "./rules";
import { BaseErrorBoundary } from "@/components/base";

import ProxiesSvg from "@/assets/image/itemicon/proxies.svg?react";
import ProfilesSvg from "@/assets/image/itemicon/profiles.svg?react";
import ConnectionsSvg from "@/assets/image/itemicon/connections.svg?react";
import RulesSvg from "@/assets/image/itemicon/rules.svg?react";
import LogsSvg from "@/assets/image/itemicon/logs.svg?react";
import TestSvg from "@/assets/image/itemicon/test.svg?react";
import SettingsSvg from "@/assets/image/itemicon/settings.svg?react";

import WifiRoundedIcon from "@mui/icons-material/WifiRounded";
import DnsRoundedIcon from "@mui/icons-material/DnsRounded";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import ForkRightRoundedIcon from "@mui/icons-material/ForkRightRounded";
import SubjectRoundedIcon from "@mui/icons-material/SubjectRounded";
import WifiTetheringRoundedIcon from "@mui/icons-material/WifiTetheringRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";

import {
  BroadActivityFeedRegular,
  GroupListRegular,
  NetworkCheckRegular,
  PlugConnectedRegular,
  Settings16Regular,
  TextAlignLeftRegular,
  TopSpeedRegular,
} from "@fluentui/react-icons";
export const routers = [
  {
    label: "Label-Proxies",
    path: "/",
    icon: [
      <WifiRoundedIcon />,
      <ProxiesSvg />,
      <NetworkCheckRegular fontSize={16} />,
    ],
    element: <ProxiesPage />,
  },
  {
    label: "Label-Profiles",
    path: "/profile",
    icon: [
      <DnsRoundedIcon />,
      <ProfilesSvg />,
      <BroadActivityFeedRegular fontSize={16} />,
    ],
    element: <ProfilesPage />,
  },
  {
    label: "Label-Connections",
    path: "/connections",
    icon: [
      <LanguageRoundedIcon />,
      <ConnectionsSvg />,
      <PlugConnectedRegular fontSize={16} />,
    ],
    element: <ConnectionsPage />,
  },
  {
    label: "Label-Rules",
    path: "/rules",
    icon: [
      <ForkRightRoundedIcon />,
      <RulesSvg />,
      <GroupListRegular fontSize={16} />,
    ],
    element: <RulesPage />,
  },
  {
    label: "Label-Logs",
    path: "/logs",
    icon: [
      <SubjectRoundedIcon />,
      <LogsSvg />,
      <TextAlignLeftRegular fontSize={16} />,
    ],
    element: <LogsPage />,
  },
  {
    label: "Label-Test",
    path: "/test",
    icon: [
      <WifiTetheringRoundedIcon />,
      <TestSvg />,
      <TopSpeedRegular fontSize={16} />,
    ],
    element: <TestPage />,
  },
  {
    label: "Label-Settings",
    path: "/settings",
    icon: [<SettingsRoundedIcon />, <SettingsSvg />, <Settings16Regular />],
    element: <SettingsPage />,
  },
].map((router) => ({
  ...router,
  element: (
    <BaseErrorBoundary key={router.label}>{router.element}</BaseErrorBoundary>
  ),
}));

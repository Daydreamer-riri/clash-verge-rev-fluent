import { Box, ButtonGroup, Grid, IconButton } from "@mui/material";
import { Button } from "@fluentui/react-components";
import { useLockFn } from "ahooks";
import { useTranslation } from "react-i18next";
import { BasePage, Notice } from "@/components/base";
import { GitHub, HelpOutlineSharp, Telegram } from "@mui/icons-material";
import { openWebUrl } from "@/services/cmds";
import SettingVerge from "@/components/setting/setting-verge";
import SettingClash from "@/components/setting/setting-clash";
import SettingSystem from "@/components/setting/setting-system";
import { useThemeMode } from "@/services/states";
import {
  BookQuestionMarkFilled,
  BookQuestionMarkRegular,
} from "@fluentui/react-icons";

const SettingPage = () => {
  const { t } = useTranslation();

  const onError = (err: any) => {
    Notice.error(err?.message || err.toString());
  };

  const toGithubRepo = useLockFn(() => {
    return openWebUrl(
      "https://github.com/Daydreamer-riri/clash-verge-rev-fluent"
    );
  });

  const toGithubDoc = useLockFn(() => {
    return openWebUrl("https://clash-verge-rev.github.io/index.html");
  });

  const toTelegramChannel = useLockFn(() => {
    return openWebUrl("https://t.me/clash_verge_re");
  });

  const mode = useThemeMode();
  const isDark = mode === "light" ? false : true;

  return (
    <BasePage
      title={t("Settings")}
      header={
        <ButtonGroup variant="contained" aria-label="Basic button group">
          <Button
            icon={<BookQuestionMarkFilled />}
            title={t("Manual")}
            appearance="subtle"
            onClick={toGithubDoc}
          />
          <Button
            icon={<Telegram fontSize="inherit" />}
            title={t("TG Channel")}
            onClick={toTelegramChannel}
            appearance="subtle"
          />
          <Button
            icon={<GitHub fontSize="inherit" />}
            title={t("Github Repo")}
            onClick={toGithubRepo}
            appearance="subtle"
          />
        </ButtonGroup>
      }
    >
      <Grid container spacing={{ xs: 1.5, lg: 1.5 }} sx={{ pb: 1 }}>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              borderRadius: 2,
              marginBottom: 1.5,
              // backgroundColor: isDark ? "#282a36" : "#ffffff",
            }}
          >
            <SettingSystem onError={onError} />
          </Box>
          <Box
            sx={{
              borderRadius: 2,
              // backgroundColor: isDark ? "#282a36" : "#ffffff",
            }}
          >
            <SettingClash onError={onError} />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              borderRadius: 2,
              // backgroundColor: isDark ? "#282a36" : "#ffffff",
            }}
          >
            <SettingVerge onError={onError} />
          </Box>
        </Grid>
      </Grid>
    </BasePage>
  );
};

export default SettingPage;

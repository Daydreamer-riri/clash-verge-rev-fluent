import dayjs from "dayjs";
import useSWR, { mutate } from "swr";
import { useState } from "react";
import {
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
  styled,
  Box,
  alpha,
  Divider,
  keyframes,
} from "@mui/material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
} from "@fluentui/react-components";
import { RefreshRounded } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { getRuleProviders, ruleProviderUpdate } from "@/services/api";

const round = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const ProviderButton = () => {
  const { t } = useTranslation();
  const { data } = useSWR("getRuleProviders", getRuleProviders);

  const [open, setOpen] = useState(false);

  const hasProvider = Object.keys(data || {}).length > 0;
  const [updating, setUpdating] = useState(
    Object.keys(data || {}).map(() => false)
  );

  const setUpdatingAt = (status: boolean, index: number) => {
    setUpdating((prev) => {
      const next = [...prev];
      next[index] = status;
      return next;
    });
  };
  const handleUpdate = async (key: string, index: number) => {
    setUpdatingAt(true, index);
    ruleProviderUpdate(key)
      .then(async () => {
        setUpdatingAt(false, index);
        await mutate("getRules");
        await mutate("getRuleProviders");
      })
      .catch(async () => {
        setUpdatingAt(false, index);
        await mutate("getRules");
        await mutate("getRuleProviders");
      });
  };

  if (!hasProvider) return null;

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(_, data) => setOpen(data.open)}
        modalType="non-modal"
      >
        <DialogTrigger disableButtonEnhancement>
          <Button
            style={{ textTransform: "capitalize" }}
            onClick={() => setOpen(true)}
          >
            {t("Rule Provider")}
          </Button>
        </DialogTrigger>

        <DialogSurface>
          <DialogBody>
            <DialogTitle>{t("Rule Provider")}</DialogTitle>
            {/* <Box display="flex" justifyContent="space-between" gap={1}>
            <Typography variant="h6">{t("Rule Provider")}</Typography>
            <Button
              appearance="primary"
              onClick={async () => {
                Object.entries(data || {}).forEach(async ([key], index) => {
                  await handleUpdate(key, index);
                });
              }}
            >
              {t("Update All")}
            </Button>
          </Box> */}
            <DialogContent style={{ maxHeight: "70vh" }}>
              <List sx={{ py: 0, minHeight: 250 }}>
                {Object.entries(data || {}).map(([key, item], index) => {
                  const time = dayjs(item.updatedAt);
                  return (
                    <>
                      <ListItem
                        sx={{
                          p: 0,
                          borderRadius: "10px",
                          border: "solid 2px var(--divider-color)",
                          mb: 1,
                        }}
                        key={key}
                      >
                        <ListItemText
                          sx={{ px: 1 }}
                          primary={
                            <>
                              <Typography
                                variant="h6"
                                component="span"
                                noWrap
                                title={key}
                              >
                                {key}
                              </Typography>
                              <TypeBox
                                component="span"
                                sx={{ marginLeft: "8px" }}
                              >
                                {item.ruleCount}
                              </TypeBox>
                            </>
                          }
                          secondary={
                            <>
                              <StyledTypeBox component="span">
                                {item.vehicleType}
                              </StyledTypeBox>
                              <StyledTypeBox component="span">
                                {item.behavior}
                              </StyledTypeBox>
                              <StyledTypeBox component="span">
                                {t("Update At")} {time.fromNow()}
                              </StyledTypeBox>
                            </>
                          }
                        />
                        <Divider orientation="vertical" flexItem />
                        <IconButton
                          size="small"
                          color="inherit"
                          title={`${t("Update")}${t("Rule Provider")}`}
                          onClick={() => handleUpdate(key, index)}
                          sx={{
                            animation: updating[index]
                              ? `1s linear infinite ${round}`
                              : "none",
                          }}
                        >
                          <RefreshRounded />
                        </IconButton>
                      </ListItem>
                    </>
                  );
                })}
              </List>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)}>{t("Close")}</Button>
              <Button
                appearance="primary"
                onClick={async () => {
                  Object.entries(data || {}).forEach(async ([key], index) => {
                    await handleUpdate(key, index);
                  });
                }}
              >
                {t("Update All")}
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  );
};
const TypeBox = styled(Box)(({ theme }) => ({
  display: "inline-block",
  border: "1px solid #ccc",
  borderColor: alpha(theme.palette.secondary.main, 0.5),
  color: alpha(theme.palette.secondary.main, 0.8),
  borderRadius: 4,
  fontSize: 10,
  marginRight: "4px",
  padding: "0 2px",
  lineHeight: 1.25,
}));

const StyledTypeBox = styled(Box)(({ theme }) => ({
  display: "inline-block",
  border: "1px solid #ccc",
  borderColor: alpha(theme.palette.primary.main, 0.5),
  color: alpha(theme.palette.primary.main, 0.8),
  borderRadius: 4,
  fontSize: 10,
  marginRight: "4px",
  padding: "0 2px",
  lineHeight: 1.25,
}));

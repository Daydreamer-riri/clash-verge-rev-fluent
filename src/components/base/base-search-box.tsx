import { Box, SvgIcon, TextField, styled } from "@mui/material";
import { ChangeEvent, useEffect, useRef, useState } from "react";

import { useTranslation } from "react-i18next";
import RegularExpressionIcon from "@/assets/image/component/use_regular_expression.svg?react";
import { Button, Input, Tooltip } from "@fluentui/react-components";
import {
  TextCaseTitleFilled,
  TextCaseTitleRegular,
  TextWholeWordFilled,
  TextWholeWordRegular,
} from "@fluentui/react-icons";
import { tokens } from "../../pages/_theme";

type SearchProps = {
  placeholder?: string;
  matchCase?: boolean;
  matchWholeWord?: boolean;
  useRegularExpression?: boolean;
  onSearch: (
    match: (content: string) => boolean,
    state: {
      text: string;
      matchCase: boolean;
      matchWholeWord: boolean;
      useRegularExpression: boolean;
    }
  ) => void;
};

export const BaseSearchBox = styled((props: SearchProps) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [matchCase, setMatchCase] = useState(props.matchCase ?? false);
  const [matchWholeWord, setMatchWholeWord] = useState(
    props.matchWholeWord ?? false
  );
  const [useRegularExpression, setUseRegularExpression] = useState(
    props.useRegularExpression ?? false
  );
  const [errorMessage, setErrorMessage] = useState("");

  const iconStyle = {
    style: {
      height: "24px",
      width: "24px",
      cursor: "pointer",
    } as React.CSSProperties,
    inheritViewBox: true,
  };

  useEffect(() => {
    if (!inputRef.current) return;

    onChange({
      target: inputRef.current,
    } as ChangeEvent<HTMLInputElement>);
  }, [matchCase, matchWholeWord, useRegularExpression]);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    props.onSearch(
      (content) => doSearch([content], e.target?.value ?? "").length > 0,
      {
        text: e.target?.value ?? "",
        matchCase,
        matchWholeWord,
        useRegularExpression,
      }
    );
  };

  const doSearch = (searchList: string[], searchItem: string) => {
    setErrorMessage("");
    return searchList.filter((item) => {
      try {
        let searchItemCopy = searchItem;
        if (!matchCase) {
          item = item.toLowerCase();
          searchItemCopy = searchItemCopy.toLowerCase();
        }
        if (matchWholeWord) {
          const regex = new RegExp(`\\b${searchItemCopy}\\b`);
          if (useRegularExpression) {
            const regexWithOptions = new RegExp(searchItemCopy);
            return regexWithOptions.test(item) && regex.test(item);
          } else {
            return regex.test(item);
          }
        } else if (useRegularExpression) {
          const regex = new RegExp(searchItemCopy);
          return regex.test(item);
        } else {
          return item.includes(searchItemCopy);
        }
      } catch (err) {
        setErrorMessage(`${err}`);
      }
    });
  };

  return (
    <Tooltip
      visible={!!errorMessage}
      content={errorMessage}
      relationship="description"
      positioning="above-start"
    >
      <Input
        autoComplete="new-password"
        ref={inputRef}
        spellCheck="false"
        placeholder={props.placeholder ?? t("Filter conditions")}
        onChange={onChange}
        style={{ flex: 1 }}
        contentAfter={
          <>
            <Tooltip content={t("Match Case")} relationship="label">
              <Button
                appearance="transparent"
                size="small"
                aria-label={matchCase ? "active" : "inactive"}
                onClick={() => {
                  setMatchCase(!matchCase);
                }}
                icon={
                  matchCase ? (
                    <TextCaseTitleFilled color={tokens.colorBrandForeground1} />
                  ) : (
                    <TextCaseTitleRegular />
                  )
                }
              />
            </Tooltip>
            <Tooltip content={t("Match Whole Word")} relationship="label">
              <Button
                appearance="transparent"
                size="small"
                aria-label={matchCase ? "active" : "inactive"}
                onClick={() => {
                  setMatchWholeWord(!matchWholeWord);
                }}
                icon={
                  matchWholeWord ? (
                    <TextWholeWordFilled color={tokens.colorBrandForeground1} />
                  ) : (
                    <TextWholeWordRegular />
                  )
                }
              />
            </Tooltip>
            <Tooltip content={t("Use Regular Expression")} relationship="label">
              <Button
                appearance="transparent"
                size="small"
                aria-label={matchCase ? "active" : "inactive"}
                onClick={() => {
                  setUseRegularExpression(!useRegularExpression);
                }}
                icon={
                  useRegularExpression ? (
                    <RegularExpressionIcon
                      color={tokens.colorBrandForeground1}
                    />
                  ) : (
                    <RegularExpressionIcon />
                  )
                }
              />
            </Tooltip>
          </>
        }
        // InputProps={{
        //   sx: { pr: 1 },
        //   endAdornment: (
        //     <Box display="flex">
        //       <Tooltip title={t("Match Case")}>
        //         <div>
        //           <SvgIcon
        //             component={matchCaseIcon}
        //             {...iconStyle}
        //             aria-label={matchCase ? "active" : "inactive"}
        //             onClick={() => {
        //               setMatchCase(!matchCase);
        //             }}
        //           />
        //         </div>
        //       </Tooltip>
        //       <Tooltip title={t("Match Whole Word")}>
        //         <div>
        //           <SvgIcon
        //             component={matchWholeWordIcon}
        //             {...iconStyle}
        //             aria-label={matchWholeWord ? "active" : "inactive"}
        //             onClick={() => {
        //               setMatchWholeWord(!matchWholeWord);
        //             }}
        //           />
        //         </div>
        //       </Tooltip>
        //       <Tooltip title={t("Use Regular Expression")}>
        //         <div>
        //           <SvgIcon
        //             component={useRegularExpressionIcon}
        //             aria-label={useRegularExpression ? "active" : "inactive"}
        //             {...iconStyle}
        //             onClick={() => {
        //               setUseRegularExpression(!useRegularExpression);
        //             }}
        //           />{" "}
        //         </div>
        //       </Tooltip>
        //     </Box>
        //   ),
        // }}
        {...props}
      />
    </Tooltip>
  );
})(({ theme }) => ({
  "& .MuiInputBase-root": {
    background: theme.palette.mode === "light" ? "#fff" : undefined,
    "padding-right": "4px",
  },
  "& .MuiInputBase-root svg[aria-label='active'] path": {
    fill: theme.palette.primary.light,
  },
  "& .MuiInputBase-root svg[aria-label='inactive'] path": {
    fill: "#A7A7A7",
  },
}));

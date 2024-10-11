import {
  Button,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
} from "@mui/material";
import { useAtom, useAtomValue } from "jotai";
import { csvDataAtom, filePathAtom } from "../state";
import SaveIcon from "@mui/icons-material/Save";
import ReplayIcon from "@mui/icons-material/Replay";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { isQuestionValid, questionTypes } from "@renderer/util";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useState } from "react";

const Edit = () => {
  const [filePath] = useAtomValue(filePathAtom);
  const [csvData, setCsvData] = useAtom(csvDataAtom);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  return (
    <Stack width={"100vw"} height={"100vh"} direction={"row"} borderTop={"2px solid #e3e3e3"}>
      <Stack
        width={"40vw"}
        height={"100%"}
        spacing={2}
        justifyContent={"space-between"}
        padding={"20px 10px"}
        borderRight={"2px solid #e3e3e3"}
      >
        <TextField
          required
          id="tf-name"
          label="문제집 제목"
          variant="outlined"
          defaultValue={csvData[0][1]}
        />
        <Divider />

        <List
          id="list-question"
          sx={{
            overflow: "auto",
            height: "100%",
          }}
        >
          {csvData.slice(1).map((row, index) => {
            const flagValid = isQuestionValid(row);
            return (
              <ListItemButton
                key={index}
                selected={selectedIndex === index}
                onClick={() => {
                  setSelectedIndex(index);
                }}
                sx={{
                  overflow: "hidden",
                }}
              >
                <ListItemIcon>
                  {flagValid ? (
                    <DescriptionOutlinedIcon color="primary" />
                  ) : (
                    <WarningAmberRoundedIcon color="warning" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={row[1]}
                  primaryTypographyProps={{
                    fontWeight: "bold",
                    fontSize: "1.05em",
                  }}
                  secondary={row[2]}
                  css={{
                    "& span, & p": {
                      display: "-webkit-box",
                      WebkitLineClamp: "2",
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      wordWrap: "break-word",
                    },
                    "& p": {
                      WebkitLineClamp: "1",
                    },
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>

        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          sx={{ padding: "10px" }}
          onClick={() => {
            // 맨 처음 문제 유효성 검사
            if (csvData.length > 1) {
              const firstRow = csvData[1];
              if (
                firstRow[0] === questionTypes[0] &&
                firstRow[1] === "새 문제" &&
                firstRow[2] === "정답"
              ) {
                return;
              }
            }

            // 새 문제 추가
            setCsvData((prev) => [
              prev[0],
              [questionTypes[0], "새 문제", "정답"],
              ...prev.slice(1),
            ]);

            // 추가한 문제 선택
            setSelectedIndex(0);

            // 스크롤 맨 위로 이동
            const list = document.getElementById("list-question");
            if (list) {
              list.scrollTop = 0;
            }
          }}
        >
          문제 추가
        </Button>

        <Divider />
        <Stack spacing={2} minWidth={"200px"} alignSelf={"center"} padding={"0 20px"}>
          <Button variant="contained" startIcon={<SaveIcon />}>
            저장하기
          </Button>
          <Button
            variant="outlined"
            startIcon={<ReplayIcon />}
            onClick={() => {
              setCsvData([[]]);
            }}
          >
            돌아가기
          </Button>
        </Stack>
      </Stack>
      <Stack width={"auto"} height={"100%"} css={{}}></Stack>
    </Stack>
  );
};
export default Edit;

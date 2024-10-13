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
import { useAtom } from "jotai";
import { filePathAtom, questionsAtom, workbookTitleAtom } from "../state";
import SaveIcon from "@mui/icons-material/Save";
import ReplayIcon from "@mui/icons-material/Replay";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { isQuestionValid } from "@renderer/util";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useEffect, useState } from "react";
import { Question, QuestionType } from "@renderer/util/class";

const Edit = () => {
  const [filePath, setFilePath] = useAtom(filePathAtom);
  const [workbookTitle, setWorkbookTitle] = useAtom(workbookTitleAtom);
  const [questions, setQuestions] = useAtom(questionsAtom);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const tfWorkbookTitle = document.getElementById("tf-workbook-title") as HTMLInputElement;
    tfWorkbookTitle.value = workbookTitle;
  }, [workbookTitle])

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
          id="tf-workbook-title"
          label="문제집 제목"
          variant="outlined"
          defaultValue={workbookTitle}
        />
        <Divider />

        <List
          id="list-question"
          sx={{
            overflow: "auto",
            height: "100%",
          }}
        >
          {questions.map((question, index) => {
            const flagValid = isQuestionValid(question);
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
                  primary={questions[index].title}
                  primaryTypographyProps={{
                    fontWeight: "bold",
                    fontSize: "1.05em",
                  }}
                  secondary={questions[index].answers.join(", ")}
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
            if (questions.length > 1) {
              if (
                questions[0].type === QuestionType.DESCRIPTION &&
                questions[0].title === "새 문제" &&
                questions[0].answers.length === 1 &&
                questions[0].answers[0] === "정답"
              ) {
                return;
              }
            }

            // 새 문제 추가
            const newQuestion = new Question(QuestionType.DESCRIPTION, "새 문제", ["정답"]);
            setQuestions((prev) => [newQuestion, ...prev]);

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
              setFilePath("");
              setQuestions([]);
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

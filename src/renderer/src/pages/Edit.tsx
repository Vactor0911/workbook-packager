import {
  Box,
  Button,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from "@mui/material";
import { useAtom } from "jotai";
import { filePathAtom, questionsAtom, workbookTitleAtom } from "../state";
import SaveIcon from "@mui/icons-material/Save";
import ReplayIcon from "@mui/icons-material/Replay";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { isQuestionValid, questionToCsv, saveCsvFile } from "@renderer/util";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useEffect, useState } from "react";
import { Question, QuestionType, QuestionTypeKor } from "@renderer/util/class";
import { EmotionJSX } from "@emotion/react/types/jsx-namespace";
import DeleteIcon from "@mui/icons-material/Delete";

const Edit = (): EmotionJSX.Element => {
  const [filePath, setFilePath] = useAtom(filePathAtom);
  const [workbookTitle, setWorkbookTitle] = useAtom(workbookTitleAtom);
  const [questions, setQuestions] = useAtom(questionsAtom);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // 문제 데이터
  const [questionType, setQuestionType] = useState(QuestionType.DESCRIPTION);
  const [questionTitle, setQuestionTitle] = useState("새 문제");
  const [questionAnswers, setQuestionAnswers] = useState(["정답"]);
  const [questionWrongAnswers, setQuestionWrongAnswers] = useState<string[]>([]);
  const [questionComment, setQuestionComment] = useState("");
  const [questionHasOrder, setQuestionHasOrder] = useState(false);

  // 문제 데이터 업데이트
  useEffect(() => {
    updateQuestionTextField(selectedIndex);
  }, [questions]);

  // 문제 데이터 업데이트
  const updateQuestion = (index: number): void => {
    const newQuestion = new Question(
      questionType,
      questionTitle,
      questionAnswers,
      questionWrongAnswers,
      questionComment,
      questionHasOrder
    );

    // 문제 유효성 검사
    newQuestion.answers = newQuestion.answers.filter((answer) => answer !== "");
    newQuestion.wrongAnswers = newQuestion.wrongAnswers.filter((answer) => answer !== "");

    setQuestions((prev) => {
      const newQuestions = prev.slice();
      newQuestions[index] = newQuestion;
      return newQuestions;
    });
  };

  // 현재 문제 데이터 추출
  const updateQuestionTextField = (index: number): void => {
    // 선택한 문제가 없을 경우 무시
    if (!questions[index]) {
      return;
    }

    const selectedQuestion = questions[index];
    setQuestionType(selectedQuestion.type.replace("O", "") as QuestionType);
    setQuestionTitle(selectedQuestion.title);
    setQuestionAnswers(selectedQuestion.answers);
    setQuestionWrongAnswers(selectedQuestion.wrongAnswers as Array<string>);
    setQuestionComment(selectedQuestion.comment);
    setQuestionHasOrder(selectedQuestion.hasOrder);
  };

  const handleSelectedIndexChange = (index: number): void => {
    // 선택한 문제와 같은 문제 선택 시 무시
    if (index == selectedIndex) {
      return;
    }

    updateQuestion(selectedIndex); // 이전 문제 데이터 반영
    setSelectedIndex(index); // 선택한 문제 인덱스 저장
    updateQuestionTextField(index); // 현재 문제 데이터 추출
    console.log(questionType);
  };

  const handleQuestionTypeChange = (event: SelectChangeEvent<unknown>): void => {
    console.log(Object.values(QuestionType)[event.target.value as number]);
    setQuestionType(Object.values(QuestionType)[event.target.value as number]);
  };

  return (
    <Stack width={"100vw"} height={"100vh"} direction={"row"} borderTop={"2px solid #e3e3e3"}>
      {/* 문제 선택 메뉴 */}
      <Stack
        width={"35vw"}
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
          value={workbookTitle}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              (event.target as HTMLElement).blur();
            }
          }}
          onBlur={(event) => {
            setWorkbookTitle(event.target.value);
          }}
        />
        <Divider />

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3 style={{ margin: "0" }}>문제 목록</h3>
          <h5 style={{ margin: "0", color: questions.length >= 100 ? "red" : "#888" }}>
            {questions.length}/100
          </h5>
        </div>
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
                  handleSelectedIndexChange(index);
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
                  primary={questions[index].title.replaceAll("<br>", " ")}
                  primaryTypographyProps={{
                    fontWeight: "bold",
                    fontSize: "1.05em",
                  }}
                  secondary={questions[index].answers.join(", ").replaceAll("<br>", " ")}
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
            // 문제 개수 제한
            if (questions.length >= 100) {
              return;
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
          {/* 저장하기 */}
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={() => {
              handleSelectedIndexChange(0);
              const data = [["タイトル", workbookTitle]];
              questions.forEach((question) => {
                data.push(questionToCsv(question));
              });
              saveCsvFile(filePath, data);
            }}
          >
            저장하기
          </Button>

          {/* 돌아가기 */}
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

      {/* 문제 편집 메뉴 */}
      {questions.length > 0 && (
        <Stack
          width={"65vw"}
          height={"100%"}
          padding={"40px"}
          alignItems={"center"}
          spacing={4}
          overflow={"auto"}
        >
          <FormControl fullWidth>
            <InputLabel id="select-question-type-label">문제 유형</InputLabel>
            <Select
              labelId="select-question-type-label"
              label="문제 유형"
              value={questionType ? Object.values(QuestionType).indexOf(questionType) : 0}
              onChange={handleQuestionTypeChange}
            >
              {Object.values(QuestionTypeKor).map((type, index) => (
                <MenuItem key={index} value={index}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            required
            multiline
            id="tf-question-title"
            label="문제"
            variant="outlined"
            value={questionTitle.replaceAll("<br>", "\n")}
            onChange={(event) => {
              setQuestionTitle(event.target.value);
            }}
          />
          {/* 정답 수가 하나인 경우 */}
          {(questionType == QuestionType.DESCRIPTION || questionType == QuestionType.CHOICE) && (
            <TextField
              fullWidth
              required
              multiline
              id="tf-question-answers"
              label="정답"
              variant="outlined"
              value={questionAnswers[0].replaceAll("<br>", "\n")}
              onChange={(event) => {
                setQuestionAnswers([event.target.value]);
              }}
            />
          )}
          {/* 정답 수가 여러개인 경우 */}
          {(questionType == QuestionType.COMPLETION ||
            questionType == QuestionType.CHOICE_COMPLETION) && (
            <Stack width={"100%"}>
              <h4 style={{ margin: "0", color: "#2979ff" }}>
                정답 <span style={{ fontSize: "1.2em", fontWeight: "bold", color: "red" }}>*</span>
              </h4>
              <List
                id="list-question-answers"
                sx={{
                  borderRadius: "5px",
                }}
              >
                {questionAnswers.map((answer, index) => (
                  <FormControl key={index} fullWidth margin="dense">
                    <InputLabel id="select-question-answer-label">정답 {index + 1}</InputLabel>
                    <OutlinedInput
                      multiline
                      id="tf-question-wrong-answers"
                      label={`오답 ${index + 1}`}
                      value={answer.replaceAll("<br>", "\n")}
                      onChange={(event) => {
                        const newAnswers = questionAnswers.slice();
                        newAnswers[index] = event.target.value;
                        setQuestionAnswers(newAnswers);
                      }}
                      endAdornment={
                        index > 0 ? (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => {
                                setQuestionAnswers((prev) => prev.filter((_, i) => i !== index));
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </InputAdornment>
                        ) : null
                      }
                    />
                  </FormControl>
                ))}
              </List>
              <Box alignSelf={"center"} width={"100%"} maxWidth={"160px"}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={() => {
                    if (questionAnswers[questionAnswers.length - 1] === "") {
                      return;
                    }
                    setQuestionAnswers((prev) => [...prev, ""]);
                  }}
                >
                  정답 추가
                </Button>
              </Box>
            </Stack>
          )}
          {/* 오답 */}
          {(questionType == QuestionType.CHOICE ||
            questionType == QuestionType.CHOICE_COMPLETION ||
            questionType == QuestionType.CHOICE_COMPLETION_ORDER) && (
            <Stack width={"100%"}>
              <h4 style={{ margin: "0", color: "#2979ff" }}>오답</h4>
              <List
                id="list-question-wrong-answers"
                sx={{
                  borderRadius: "5px",
                }}
              >
                {questionWrongAnswers.map((wrongAnswer, index) => (
                  <FormControl key={index} fullWidth margin="dense">
                    <InputLabel id="select-question-wrong-answer-label">
                      오답 {index + 1}
                    </InputLabel>
                    <OutlinedInput
                      multiline
                      id="tf-question-wrong-answers"
                      label={`오답 ${index + 1}`}
                      value={wrongAnswer.replaceAll("<br>", "\n")}
                      onChange={(event) => {
                        const newWrongAnswers = questionWrongAnswers.slice();
                        newWrongAnswers[index] = event.target.value;
                        setQuestionWrongAnswers(newWrongAnswers);
                      }}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => {
                              setQuestionWrongAnswers((prev) => prev.filter((_, i) => i !== index));
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                ))}
              </List>
              <Box alignSelf={"center"} width={"100%"} maxWidth={"160px"}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={() => {
                    if (questionWrongAnswers[questionWrongAnswers.length - 1] === "") {
                      return;
                    }
                    setQuestionWrongAnswers((prev) => [...prev, ""]);
                  }}
                >
                  오답 추가
                </Button>
              </Box>
            </Stack>
          )}
          {/* 해설 */}
          <TextField
            fullWidth
            multiline
            id="tf-question-comment"
            label="해설"
            variant="outlined"
            value={questionComment.replaceAll("<br>", "\n")}
            onChange={(event) => {
              setQuestionComment(event.target.value);
            }}
          />
          {/* 문제 삭제 */}
          <Box alignSelf={"center"} width={"100%"} maxWidth={"160px"}>
            <Button
              fullWidth
              variant="outlined"
              color="error"
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => {
                setQuestions((prev) => prev.filter((_, i) => i !== selectedIndex));
                setSelectedIndex(Math.min(selectedIndex, questions.length - 2));
              }}
            >
              문제 삭제
            </Button>
          </Box>
        </Stack>
      )}
    </Stack>
  );
};
export default Edit;

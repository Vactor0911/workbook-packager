import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
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
import Checkbox from "@mui/material/Checkbox";

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
  const updateQuestion = (index: number): Question[] => {
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

    const newQuestions = questions.slice();
    newQuestions[index] = newQuestion;
    setQuestions(newQuestions);
    return newQuestions;
  };

  // 현재 문제 데이터 추출
  const updateQuestionTextField = (index: number): void => {
    // 선택한 문제가 없을 경우 무시
    if (!questions[index]) {
      return;
    }

    const selectedQuestion = questions[index];
    setQuestionType(
      (selectedQuestion.type.replace("O", "") as QuestionType)
        ? (selectedQuestion.type as QuestionType)
        : QuestionType.DESCRIPTION
    );
    setQuestionTitle(selectedQuestion.title ? selectedQuestion.title : "");
    setQuestionAnswers(selectedQuestion.answers.filter((answer) => answer !== ""));
    setQuestionWrongAnswers(selectedQuestion.wrongAnswers.filter((answer) => answer !== ""));
    setQuestionComment(selectedQuestion.comment ? selectedQuestion.comment : "");
    setQuestionHasOrder(selectedQuestion.hasOrder ? selectedQuestion.hasOrder : false);
  };

  const handleSelectedIndexChange = (index: number): void => {
    // 선택한 문제와 같은 문제 선택 시 무시
    if (index == selectedIndex) {
      return;
    }

    updateQuestion(selectedIndex); // 이전 문제 데이터 반영
    setSelectedIndex(index); // 선택한 문제 인덱스 저장
    updateQuestionTextField(index); // 현재 문제 데이터 추출
  };

  const handleQuestionTypeChange = (event: SelectChangeEvent<unknown>): void => {
    setQuestionType(Object.values(QuestionType)[event.target.value as number]);
  };

  const handleQuestionHasOrderChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setQuestionHasOrder(event.target.checked);
  };

  // 알림창
  const enum AlertType {
    NONE,
    SAVE_CONFIRM,
    SAVE_SUCCESS,
    SAVE_FAILED,
    RETURN_CONFIRM,
    QUESTION_INVALID,
  }
  const [alert, setAlert] = useState(AlertType.NONE);

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
          onChange={(event) => {
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
                  primary={questions[index].title
                    .replaceAll("<br>", " ")
                    .replaceAll("<comma>", ",")}
                  primaryTypographyProps={{
                    fontWeight: "bold",
                    fontSize: "1.05em",
                  }}
                  secondary={questions[index].answers
                    .join(", ")
                    .replaceAll("<br>", " ")
                    .replaceAll("<comma>", ",")}
                  css={{
                    "& span, & p": {
                      display: "-webkit-box",
                      WebkitLineClamp: "1",
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
            // 문제 업데이트
            if (questions.length > 0) {
              updateQuestion(selectedIndex);
            }

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
              const newQuestions = updateQuestion(selectedIndex); // 이전 문제 데이터 반영

              // 문제 유효성 검사
              let flagError = false;
              newQuestions.map((question, index) => {
                if (!isQuestionValid(question)) {
                  setSelectedIndex(index);
                  setAlert(AlertType.QUESTION_INVALID);
                  flagError = true;
                  return;
                }
              });
              if (flagError) {
                return;
              }

              setAlert(AlertType.SAVE_CONFIRM);
            }}
          >
            저장하기
          </Button>

          {/* 돌아가기 */}
          <Button
            variant="outlined"
            startIcon={<ReplayIcon />}
            onClick={() => {
              setAlert(AlertType.RETURN_CONFIRM);
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
            value={questionTitle.replaceAll("<br>", "\n").replaceAll("<comma>", ",")}
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
              value={questionAnswers[0]?.replaceAll("<br>", "\n").replaceAll("<comma>", ",")}
              onChange={(event) => {
                setQuestionAnswers([event.target.value]);
              }}
            />
          )}
          {/* 정답 수가 여러개인 경우 */}
          {(questionType == QuestionType.COMPLETION ||
            questionType == QuestionType.COMPLETION_ORDER ||
            questionType == QuestionType.CHOICE_COMPLETION ||
            questionType == QuestionType.CHOICE_COMPLETION_ORDER) && (
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
                      value={answer?.replaceAll("<br>", "\n").replaceAll("<comma>", ",")}
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
              <FormControlLabel
                control={
                  <Checkbox
                    checked={questionHasOrder}
                    onChange={handleQuestionHasOrderChange}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                }
                label="답변 순서를 정답 판정에 포함"
                style={{
                  marginTop: "10px",
                  alignSelf: "center",
                  color: questionHasOrder ? "#2979ff" : "black",
                }}
              />
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
                      value={wrongAnswer.replaceAll("<br>", "\n").replaceAll("<comma>", ",")}
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
            value={questionComment.replaceAll("<br>", "\n").replaceAll("<comma>", ",")}
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

      {/* 대화상자 */}
      {/* 저장 확인 대화상자 */}
      <Dialog
        open={alert === AlertType.SAVE_CONFIRM}
        onClose={() => setAlert(AlertType.NONE)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" fontWeight={"bold"}>
          {"파일 저장"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            파일을 저장하시겠습니까?
            <br />
            저장을 진행하기 전 문제집 CSV 파일을 닫아야합니다.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setAlert(AlertType.NONE);
            }}
            autoFocus
          >
            취소
          </Button>
          <Button
            onClick={() => {
              const data = [["タイトル", workbookTitle]];
              questions.forEach((question) => {
                const queue: string[][] = questionToCsv(question);
                data.push(...queue);
              });

              const maxLength = Math.max(...data.map((row) => row.length));

              // 각 열의 길이 맞추기
              data.forEach((row) => {
                const length = row.length;
                for (let i = 0; i < maxLength - length; i++) {
                  row.push("");
                }
              });

              // 파일 저장 및 결과 알림
              if (saveCsvFile(filePath, data)) {
                setAlert(AlertType.SAVE_SUCCESS);
              } else {
                setAlert(AlertType.SAVE_FAILED);
              }
            }}
          >
            저장하기
          </Button>
        </DialogActions>
      </Dialog>

      {/* 저장 성공 대화상자 */}
      <Dialog
        open={alert === AlertType.SAVE_SUCCESS}
        onClose={() => setAlert(AlertType.NONE)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" fontWeight={"bold"}>
          {"파일 저장 성공"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            문제집 파일이 성공적으로 저장되었습니다!
            <br />
            파일 위치: {filePath}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAlert(AlertType.NONE)}>닫기</Button>
          <Button
            onClick={() => {
              setAlert(AlertType.NONE);
              window.fileAPI.openFolder(filePath);
            }}
            autoFocus
          >
            파일 열기
          </Button>
        </DialogActions>
      </Dialog>

      {/* 저장 실패 대화상자 */}
      <Dialog
        open={alert === AlertType.SAVE_FAILED}
        onClose={() => setAlert(AlertType.NONE)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" fontWeight={"bold"}>
          {"파일 저장 실패"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            문제집 파일 저장에 실패하였습니다.
            <br />
            파일을 닫은 후 다시 시도해주세요.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setAlert(AlertType.NONE);
            }}
          >
            확인
          </Button>
        </DialogActions>
      </Dialog>

      {/* 돌아가기 경고 대화상자 */}
      <Dialog
        open={alert === AlertType.RETURN_CONFIRM}
        onClose={() => setAlert(AlertType.NONE)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" fontWeight={"bold"}>
          {"돌아가기"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            저장되지 않은 정보는 모두 손실됩니다.
            <br />
            정말 메인으로 돌아가시겠습니까?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setAlert(AlertType.NONE);
            }}
            autoFocus
          >
            취소
          </Button>
          <Button
            onClick={() => {
              setAlert(AlertType.NONE);
              setFilePath("");
              setQuestions([]);
            }}
          >
            확인
          </Button>
        </DialogActions>
      </Dialog>

      {/* 문제 오류 대화상자 */}
      <Dialog
        open={alert === AlertType.QUESTION_INVALID}
        onClose={() => setAlert(AlertType.NONE)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" fontWeight={"bold"}>
          {"문제 오류"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            문제 데이터가 올바르지 않습니다.
            <br />
            데이터를 올바르게 수정한 후 다시 시도해주세요.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setAlert(AlertType.NONE);
            }}
            autoFocus
          >
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};
export default Edit;

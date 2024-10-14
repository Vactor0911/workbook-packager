import { Button } from "@mui/material";
import { parse } from "csv-parse/browser/esm/sync";
import { useAtom } from "jotai";
import FileOpenOutlinedIcon from "@mui/icons-material/FileOpenOutlined";
import { EmotionJSX } from "@emotion/react/types/jsx-namespace";
import { filePathAtom, questionsAtom, workbookTitleAtom } from "@renderer/state";
import { Question, QuestionType } from "@renderer/util/class";

const OpenFileButton = (): EmotionJSX.Element => {
  const [, setFilePath] = useAtom(filePathAtom);
  const [, setWorkbookTitle] = useAtom(workbookTitleAtom);
  const [, setQuestions] = useAtom(questionsAtom);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    setFilePath(file?.path || "");

    if (file) {
      const reader = new FileReader();

      reader.onload = (e): void => {
        const fileContent = e.target?.result as string; // 파일 내용을 문자열로 가져옴

        // csv-parse를 이용하여 파싱
        const data: string[][] = parse(fileContent, {
          columns: false,
          skip_empty_lines: true,
        });

        // 파싱된 데이터 유효성 검사 및 분할

        // 문제집 제목 행 유효성 검사
        if (data[0][0] !== "タイトル") {
          return;
        }
        // 문제집 이름 저장
        const fileName = data[0][1];
        setWorkbookTitle(fileName);

        // 문제 데이터 유효성 검사 및 분할 저장
        let question: Question | null = null;
        const questionBuffer: Question[] = [];
        for (let i = 1; i < data.length; i++) {
          const row = data[i];

          // 해설
          if (row[0] === QuestionType.COMMENT) {
            if (question) {
              question.comment = row[1];
            }
            continue;
          }

          // 문제 삽입
          if (question) {
            questionBuffer.push(question);
            question = null;
          }

          // 문제 형식
          const type = Object.values(QuestionType).includes(row[0] as QuestionType) ? row[0] : "";
          const modifiedType = type.replace("O", ""); // O 제거

          // 문제 제목
          const title = row[1] ? row[1] : "";

          // 정답
          let answers: string[] = [];
          switch (type) {
            case QuestionType.DESCRIPTION:
            case QuestionType.CHOICE:
              answers = [row[2]];
              break;
            case QuestionType.COMPLETION:
            case QuestionType.COMPLETION_ORDER:
              answers = row.slice(2).filter((value) => value !== "");
              break;
            case QuestionType.CHOICE_COMPLETION:
            case QuestionType.CHOICE_COMPLETION_ORDER:
              answers = row.slice(4, 4 + Number(row[2])).filter((value) => value !== "");
              break;
          }

          // 오답
          let wrongAnswers: string[] = [];
          switch (type) {
            case QuestionType.CHOICE:
              wrongAnswers = row.slice(3).filter((value) => value !== "");
              break;
            case QuestionType.CHOICE_COMPLETION:
            case QuestionType.CHOICE_COMPLETION_ORDER:
              wrongAnswers = row.slice(4 + Number(row[2])).filter((value) => value !== "");
              break;
          }

          // 정답 순서성 여부
          const hasOrder = type[-1] === "O";

          // 문제 객체 생성
          question = new Question(modifiedType, title, answers, wrongAnswers, "", hasOrder);
        }
        // 문제 삽입
        if (question) {
          questionBuffer.push(question);
          question = null;
        }
        setQuestions(questionBuffer);
      };

      reader.readAsText(file); // 파일을 텍스트로 읽음
    }
  };

  return (
    <Button
      component="label"
      role={undefined}
      variant="contained"
      startIcon={<FileOpenOutlinedIcon />}
    >
      문제집 열기
      <input
        type="file"
        id="input-file"
        name="input-file"
        accept=".csv"
        onChange={handleFileChange}
        hidden
      />
    </Button>
  );
};

export default OpenFileButton;

import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { filePathAtom, workbookTitleAtom } from "../state";
import { useAtom } from "jotai";
import { saveCsvFile } from "@renderer/util";
import { EmotionJSX } from "@emotion/react/types/jsx-namespace";

const NewFileButton = (): EmotionJSX.Element => {
  const [, setFilePath] = useAtom(filePathAtom);
  const [, setWorkbookTitle] = useAtom(workbookTitleAtom);

  const handleSaveFile = async (): Promise<void> => {
    const path = await window.csvAPI.saveNewCsvFile();
    if (path) {
      setFilePath(path); // 파일 디렉터리 저장

      // 문제집 이름 저장
      const fileName = path.split("\\").pop()?.split(".")[0] || "NewWorkbook";
      setWorkbookTitle(fileName);

      // 문제집 데이터 저장
      const data = [["タイトル", fileName]];
      saveCsvFile(path, data);

      // 로그 출력
      console.log("File saved at:", path);
    } else {
      console.log("Save operation was cancelled");
    }
  };

  return (
    <Button
      variant="contained"
      color="primary"
      startIcon={<AddIcon />}
      onClick={() => {
        handleSaveFile();
      }}
    >
      문제집 만들기
    </Button>
  );
};
export default NewFileButton;

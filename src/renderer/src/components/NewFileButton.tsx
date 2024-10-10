import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { csvDataAtom, filePathAtom } from "../state";
import { useAtom } from "jotai";
import { saveCsvFile } from "@renderer/util";

const NewFileButton = () => {
  const [, setFilePath] = useAtom(filePathAtom);
  const [, setCsvData] = useAtom(csvDataAtom);

  const handleSaveFile = async () => {
    const path = await window.csvAPI.saveNewCsvFile();
    if (path) {
      setFilePath(path);
      const fileName = path.split("\\").pop()?.split(".")[0] || "NewWorkbook";
      const data = [["タイトル", fileName]];
      setCsvData(data);
      saveCsvFile(path, data);
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

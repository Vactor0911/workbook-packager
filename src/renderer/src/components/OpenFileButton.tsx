import { Button } from "@mui/material";
import { parse } from "csv-parse/browser/esm/sync";
import { useAtom } from "jotai";
import { csvDataAtom } from "../state";
import FileOpenOutlinedIcon from "@mui/icons-material/FileOpenOutlined";

const OpenFileButton = () => {
  const [_, setCsvData] = useAtom(csvDataAtom);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log(file);
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const fileContent = e.target?.result as string; // 파일 내용을 문자열로 가져옴

        // csv-parse를 이용하여 파싱
        const records = parse(fileContent, {
          columns: false,
          skip_empty_lines: true,
        });

        setCsvData(records); // 파싱된 데이터를 state에 저장
        console.log(records); // 파싱된 데이터를 콘솔에 출력
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

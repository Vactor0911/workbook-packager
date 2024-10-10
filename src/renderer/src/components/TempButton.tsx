import { Button } from "@mui/material";
import { saveCSVFile } from "@renderer/util";

const TempButton = () => {
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={() => {
        const data = [
          ["name", "age"],
          ["Alice", 24],
          ["홍길동", 30],
          ["김철수", 40],
          ["김영희", 20],
        ];
        const path = "temp.csv";
        saveCSVFile(path, data);
      }}
    >
      CSV 생성
    </Button>
  );
};
export default TempButton;

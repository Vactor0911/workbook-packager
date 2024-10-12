import { CssBaseline } from "@mui/material";
import { useAtomValue } from "jotai";
import Main from "./pages/Main";
import Edit from "./pages/Edit";
import { filePathAtom } from "./state";

const App = (): JSX.Element => {
  const filePath = useAtomValue(filePathAtom);

  return (
    <>
      <CssBaseline />
      {filePath === "" && <Main />}
      {filePath !== "" && <Edit />}
      <Main />
    </>
  );
};

export default App;

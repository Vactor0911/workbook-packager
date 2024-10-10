import { CssBaseline } from "@mui/material"
import { useAtomValue } from "jotai"
import { csvDataAtom } from "./state"
import Main from "./pages/Main"
import Edit from "./pages/Edit"

const App = (): JSX.Element => {
  const [csvData, _] = useAtomValue(csvDataAtom)
  return (
    <>
      <CssBaseline />
      {csvData.length <= 0 && <Main />}
      {csvData.length > 0 && <Edit />}
    </>
  )
}

export default App

import { Button } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
// import { csvDataAtom, filePathAtom } from "../state"
// import { useAtom } from "jotai"

const NewFileButton = () => {
    // const [filePath, setFilePath] = useAtom(filePathAtom)
    // const [csvData, setCsvData] = useAtom(csvDataAtom)

  return (
    <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() =>{
        
    }}>
      문제집 만들기
    </Button>
  )
}
export default NewFileButton

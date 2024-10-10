import { Button, Stack } from "@mui/material"
import OpenFileButton from "../components/OpenFileButton"
import { useAtomValue } from "jotai"
import { csvDataAtom } from "../state"

const Edit = () => {
    const [csvData, _] = useAtomValue(csvDataAtom)

  return (
    <Stack
      width={"100vw"}
      height={"100vh"}
      direction={"row"}
      css={{
        borderTop: "2px solid #e3e3e3"
      }}
    >
      <Stack
        width={"30vw"}
        maxWidth={"400px"}
        height={"100%"}
        spacing={2}
        css={{
          borderRight: "2px solid #e3e3e3",
          padding: "10px 30px",
          justifyContent: csvData.length > 0 ? "spaceBetween" : "center"
        }}
      >
        {csvData.length <= 0 && (
          <>
            <OpenFileButton />
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                console.log(csvData)
              }}
            >
              데이터 확인
            </Button>
          </>
        )}
        {csvData.length > 0 && <></>}
      </Stack>
      <Stack width={"100%"} height={"100%"} css={{}}></Stack>
    </Stack>
  )
}
export default Edit;

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import Icon from "../../../../resources/icon.png";
import OpenFileButton from "@renderer/components/OpenFileButton";
import NewFileButton from "@renderer/components/NewFileButton";
import { EmotionJSX } from "@emotion/react/types/jsx-namespace";
import { alertAtom, AlertType } from "@renderer/state";
import { useAtom } from "jotai";

const Main = (): EmotionJSX.Element => {
  const [alert, setAlert] = useAtom(alertAtom);

  return (
    <Stack
      width={"100vw"}
      height={"100vh"}
      spacing={3}
      css={{
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <img src={Icon} alt="icon" width={"auto"} height={"25%"} />
      <Stack>
        <Typography variant="h4" fontWeight={"bold"}>
          문제집 꾸러미
        </Typography>
        <Typography color="#666">버전 1.0.1</Typography>
      </Stack>
      <Stack spacing={2}>
        <NewFileButton />
        <OpenFileButton />
      </Stack>

      {/* 저장 실패 대화상자 */}
      <Dialog
        open={alert === AlertType.OPEN_FAILED}
        onClose={() => setAlert(AlertType.NONE)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" fontWeight={"bold"}>
          {"문제집 열기 실패"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            문제집 파일 열기에 실패하였습니다.
            <br />
            파일이 올바른지 확인하세요.
            <br />
            <br />
            오류가 고쳐지지 않는다면 개발자에게 문의하세요.
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
    </Stack>
  );
};
export default Main;

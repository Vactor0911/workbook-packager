import { Stack, Typography } from "@mui/material";
import Icon from "../../../../resources/icon.png";
import OpenFileButton from "@renderer/components/OpenFileButton";
import NewFileButton from "@renderer/components/NewFileButton";

const Main = () => {
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
        <Typography color="#666">버전 alpha 1.0</Typography>
      </Stack>
      <Stack spacing={2}>
        <NewFileButton />
        <OpenFileButton />
      </Stack>
    </Stack>
  );
};
export default Main;

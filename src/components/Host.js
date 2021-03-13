import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import LinearProgress from "@material-ui/core/LinearProgress";
import CloseIcon from "@material-ui/icons/Close";
import ShareIcon from "@material-ui/icons/Share";
import { Alert, AlertTitle } from "@material-ui/lab";

import GuestList from "./GuestList";
import EditScoreDialog from "./EditScoreDialog";
import useWatchRoom from "./useWatchRoom";

import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  appReducer,
  roomIdView,
  userIdView,
  hostInfoView,
  errorView,
} from "../state";
import style from "../style";

export default function Host() {
  useWatchRoom("setupHost");

  const roomId = useRecoilValue(roomIdView);
  const userId = useRecoilValue(userIdView);
  const { canClear } = useRecoilValue(hostInfoView);
  const error = useRecoilValue(errorView);

  const dispatch = useSetRecoilState(appReducer);
  const clearBuzzers = () => dispatch({ type: "clearBuzzers" });
  const exit = () => dispatch({ type: "exit" });
  const share = () => dispatch({ type: "share" });

  return (
    <Box style={style.flexParent}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={exit}>
            <CloseIcon />
          </IconButton>
          <Typography style={{ flexGrow: 1 }} variant="h6">
            Room number: {roomId}
          </Typography>
          {navigator.share && (
            <IconButton edge="end" color="inherit" onClick={share}>
              <ShareIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      {error ? (
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {error.message}
        </Alert>
      ) : !userId ? (
        <LinearProgress color="secondary" />
      ) : (
        <Box p={2} style={style.flexParent}>
          <Typography variant="subtitle2">
            Your are the host. Tap a guest to edit their score
          </Typography>
          <EditScoreDialog />
          <Box p={2} />
          <Box display="flex" justifyContent="center">
            <Button
              variant="contained"
              color="secondary"
              disabled={!canClear}
              onClick={clearBuzzers}
            >
              Clear buzzers
            </Button>
          </Box>
          <Box p={2} />
          <GuestList />
        </Box>
      )}
    </Box>
  );
}

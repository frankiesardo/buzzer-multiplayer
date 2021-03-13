import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import Fab from "@material-ui/core/Fab";
import CloseIcon from "@material-ui/icons/Close";
import ShareIcon from "@material-ui/icons/Share";
import EditIcon from "@material-ui/icons/Edit";
import { Alert, AlertTitle } from "@material-ui/lab";

import GuestList from "./GuestList";
import EditNameDialog from "./EditNameDialog";
import useWatchRoom from "./useWatchRoom";

import { useRecoilValue, useSetRecoilState } from "recoil";
import { appReducer, roomIdView, guestInfoView, errorView } from "../state";
import style from "../style";

export default function Join() {
  useWatchRoom("setupGuest");

  const roomId = useRecoilValue(roomIdView);
  const guestInfo = useRecoilValue(guestInfoView);
  const error = useRecoilValue(errorView);

  const dispatch = useSetRecoilState(appReducer);
  const buzz = () => dispatch({ type: "buzz" });
  const openDialog = () =>
    dispatch({ type: "toggleDialog", payload: { dialog: { open: true } } });
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
      ) : !guestInfo ? (
        <LinearProgress color="secondary" />
      ) : (
        <Box p={2} style={style.flexParent}>
          <EditNameDialog />
          <Box display="flex" alignItems="center">
            <Typography variant="subtitle2">Your name:</Typography>
            <Button
              color="secondary"
              onClick={openDialog}
              style={{ fontStyle: "italic", textTransform: "none" }}
              endIcon={<EditIcon />}
            >
              {guestInfo.name}{" "}
            </Button>
          </Box>
          <Box p={3} />
          <Box display="flex" justifyContent="center">
            <Fab
              color="secondary"
              style={{ width: 180, height: 180 }}
              disabled={!!guestInfo.buzzed}
              onClick={buzz}
            >
              Buzz!
            </Fab>
          </Box>
          <Box p={3} />
          <GuestList />
        </Box>
      )}
    </Box>
  );
}

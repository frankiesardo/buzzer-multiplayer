import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import { useSetRecoilState } from "recoil";
import { appReducer } from "../state";

export default function Home() {
  const dispatch = useSetRecoilState(appReducer);
  const createRoom = () => dispatch({ type: "createRoom" });
  const goToRoom = (e) => {
    e.preventDefault();
    const roomId = new FormData(e.target).get("roomId");
    dispatch({ type: "goToRoom", payload: { roomId } });
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Buzzer Multiplayer</Typography>
        </Toolbar>
      </AppBar>
      <Box p={1} display="flex" flexDirection="column">
        <Box p={2}>
          <Card variant="outlined">
            <form onSubmit={goToRoom}>
              <CardContent>
                <Typography variant="h5" gutterBottom={true}>
                  Join a game
                </Typography>
                <TextField name="roomId" label="Room number" size="small" />
              </CardContent>
              <CardActions>
                <Button type="submit" color="primary">
                  Join
                </Button>
              </CardActions>
            </form>
          </Card>
          <Box p={2} />
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h5" gutterBottom={true}>
                Host a game
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Generate a new room number that you can share with other players
              </Typography>
            </CardContent>
            <CardActions>
              <Button color="primary" onClick={createRoom}>
                Host
              </Button>
            </CardActions>
          </Card>
        </Box>
      </Box>
    </>
  );
}

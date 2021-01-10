import { RecoilRoot, useRecoilValue, useSetRecoilState } from "recoil";
import React, { useEffect } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Fab from "@material-ui/core/Fab";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import CloseIcon from "@material-ui/icons/Close";
import {
  appReducer,
  canClearBuzzersView,
  guestWhoBuzzedListView,
  guestWhoDidNotBuzzListView,
  hasBuzzedView,
  pageView,
  roomIdView,
  yourNameView,
} from "./state";
import { watchBuzzers } from "./effects";

function GuestWhoBuzzedList() {
  const items = useRecoilValue(guestWhoBuzzedListView);
  return (
    <List>
      <ListSubheader>Buzzed</ListSubheader>
      <Divider />
      {!items.length
        ? null
        : items.map(({ id, name, buzzed }, idx) => (
            <ListItem key={id}>
              <ListItemText
                primary={name}
                secondary={idx > 0 ? `+${buzzed - items[0].buzzed}  ms` : null}
              />
            </ListItem>
          ))}
    </List>
  );
}

function GuestWhoDidNotBuzzList() {
  const items = useRecoilValue(guestWhoDidNotBuzzListView);
  return (
    <List>
      <ListSubheader>Not buzzed yet</ListSubheader>
      <Divider />
      {!items.length
        ? null
        : items.map(({ id, name }) => (
            <ListItem key={id}>
              <ListItemText primary={name} />
            </ListItem>
          ))}
    </List>
  );
}

function GuestList() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <GuestWhoBuzzedList />
      </Grid>
      <Grid item xs={6}>
        <GuestWhoDidNotBuzzList />
      </Grid>
    </Grid>
  );
}

function useWatchBuzzers() {
  const roomId = useRecoilValue(roomIdView);
  const dispatch = useSetRecoilState(appReducer);
  useEffect(
    () =>
      watchBuzzers(roomId, (guests) =>
        dispatch({ type: "watchBuzzersResult", payload: guests })
      ),
    [roomId, dispatch]
  );
}

function Join() {
  useWatchBuzzers();

  const roomId = useRecoilValue(roomIdView);
  const yourName = useRecoilValue(yourNameView);
  const hasBuzzed = useRecoilValue(hasBuzzedView);

  const dispatch = useSetRecoilState(appReducer);
  const exit = () => dispatch({ type: "backToHome" });
  const buzz = () => dispatch({ type: "buzz" });

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={exit}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6">Room number: {roomId}</Typography>
        </Toolbar>
      </AppBar>
      <Box p={2}>
        <Typography variant="subtitle2">You are {yourName}</Typography>
        <Box p={2} />
        <Box display="flex" flexDirection="row" justifyContent="center">
          <Fab
            color="secondary"
            style={{ width: 187, height: 187 }}
            disabled={hasBuzzed}
            onClick={buzz}
          >
            Buzz!
          </Fab>
        </Box>
        <Box p={4} />
        <GuestList />
      </Box>
    </>
  );
}

function Host() {
  useWatchBuzzers();

  const roomId = useRecoilValue(roomIdView);
  const canClearBuzzer = useRecoilValue(canClearBuzzersView);

  const dispatch = useSetRecoilState(appReducer);
  const exit = () => dispatch({ type: "backToHome" });
  const clearBuzzers = () => dispatch({ type: "clearBuzzers" });

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={exit}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6">Room number: {roomId}</Typography>
        </Toolbar>
      </AppBar>
      <Box p={2}>
        <Typography variant="subtitle2">You are the host</Typography>
        <Box p={2} />
        <Box display="flex" flexDirection="row" justifyContent="center">
          <Button
            variant="contained"
            color="secondary"
            disabled={!canClearBuzzer}
            onClick={clearBuzzers}
          >
            Clear buzzers
          </Button>
        </Box>
        <Box p={4} />
        <GuestList />
      </Box>
    </>
  );
}

function Home() {
  const roomId = useRecoilValue(roomIdView);
  const yourName = useRecoilValue(yourNameView);
  const dispatch = useSetRecoilState(appReducer);

  const onYourNameChange = (e) =>
    dispatch({ type: "updateInputYourName", payload: e.target.value });
  const onRoomIdChange = (e) =>
    dispatch({ type: "updateInputRoomId", payload: e.target.value });
  const onJoin = () => dispatch({ type: "makeGuest" });
  const onHost = () => dispatch({ type: "makeRoom" });

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
            <CardContent>
              <Typography variant="h5" gutterBottom={true}>
                Join a game
              </Typography>
              <Typography variant="body2" color="textSecondary">
                With your name and the room number
              </Typography>
              <Box p={1} />
              <Box display="flex" flexDirection="row">
                <TextField
                  label="Your name"
                  size="small"
                  value={yourName || ""}
                  onChange={onYourNameChange}
                />
                <Box p={2} />
                <TextField
                  label="Room #"
                  size="small"
                  value={roomId || ""}
                  style={{ width: 68 }}
                  onChange={onRoomIdChange}
                />
              </Box>
            </CardContent>
            <CardActions>
              <Button color="primary" onClick={onJoin}>
                Join
              </Button>
            </CardActions>
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
              <Button color="primary" onClick={onHost}>
                Host
              </Button>
            </CardActions>
          </Card>
        </Box>
      </Box>
    </>
  );
}

function Navigator() {
  switch (useRecoilValue(pageView)) {
    case "home":
      return <Home />;
    case "host":
      return <Host />;
    case "join":
      return <Join />;
    default:
      return null;
  }
}

function App() {
  return (
    <RecoilRoot>
      <div style={{ backgroundColor: "#eeeeee" }}>
        <Container
          disableGutters
          maxWidth="sm"
          style={{ height: "100vh", backgroundColor: "white" }}
        >
          <Navigator />
        </Container>
      </div>
    </RecoilRoot>
  );
}

export default App;

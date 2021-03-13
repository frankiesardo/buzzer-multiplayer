import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import { HashRouter, Switch, Route } from "react-router-dom";

import Home from "./Home";
import Host from "./Host";
import Join from "./Join";

import { RecoilRoot } from "recoil";
import style from "../style";

function App() {
  return (
    <RecoilRoot>
      <HashRouter>
        <Box style={style.background}>
          <Container disableGutters maxWidth="sm" style={style.fullscreen}>
            <Switch>
              <Route path="/host/:roomId">
                <Host />
              </Route>
              <Route path="/join/:roomId">
                <Join />
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
          </Container>
        </Box>
      </HashRouter>
    </RecoilRoot>
  );
}

export default App;

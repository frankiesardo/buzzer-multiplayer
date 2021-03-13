import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import { motion, AnimateSharedLayout } from "framer-motion";

import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  appReducer,
  guestWhoBuzzedListView,
  guestWhoDidNotBuzzListview,
  userTypeView,
} from "../state";
import style from "../style";

const spring = { type: "spring", stiffness: 500, damping: 30 };

function GuestWhoBuzzedList() {
  const items = useRecoilValue(guestWhoBuzzedListView);
  return (
    <List style={style.flexParent}>
      <ListSubheader>Buzzed</ListSubheader>
      <Divider />
      <Box style={style.scrollable}>
        {items?.map(({ id, name, buzzed }, idx) => (
          <motion.div key={id} layoutId={id} transition={spring}>
            <ListItem>
              <ListItemText
                primary={name}
                secondary={idx > 0 ? `+${buzzed - items[0].buzzed}  ms` : null}
              />
            </ListItem>
          </motion.div>
        ))}
      </Box>
    </List>
  );
}

function GuestWhoDidNotBuzzList() {
  const items = useRecoilValue(guestWhoDidNotBuzzListview);
  const userType = useRecoilValue(userTypeView);
  const dispatch = useSetRecoilState(appReducer);

  return (
    <List style={style.flexParent}>
      <ListSubheader>Not buzzed yet</ListSubheader>
      <Divider />
      <Box style={style.scrollable}>
        {items?.map(({ id, name, score }) => (
          <motion.div key={id} layoutId={id} transition={spring}>
            <ListItem
              button={userType === "host"}
              onClick={() =>
                userType === "host" &&
                dispatch({
                  type: "toggleDialog",
                  payload: { dialog: { idx: id, open: true } },
                })
              }
            >
              <ListItemText
                primary={name}
                secondary={score > 0 || score < 0 ? `Points: ${score}` : null}
              />
            </ListItem>
          </motion.div>
        ))}
      </Box>
    </List>
  );
}

export default function GuestList() {
  return (
    <AnimateSharedLayout>
      <Grid container spacing={1} style={style.flexParentRow}>
        <Grid item xs={6} style={style.flexParent}>
          <GuestWhoBuzzedList />
        </Grid>
        <Grid item xs={6} style={style.flexParent}>
          <GuestWhoDidNotBuzzList />
        </Grid>
      </Grid>
    </AnimateSharedLayout>
  );
}

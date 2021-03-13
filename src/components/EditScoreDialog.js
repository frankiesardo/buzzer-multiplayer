import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import { useSetRecoilState, useRecoilValue } from "recoil";
import { appReducer, dialogOpenView, editGuestView } from "../state";

export default function EditScoreDialog() {
  const dialogOpen = useRecoilValue(dialogOpenView);
  const editGuest = useRecoilValue(editGuestView);

  const dispatch = useSetRecoilState(appReducer);
  const close = () => {
    dispatch({ type: "toggleDialog", payload: { dialog: { open: false } } });
  };

  const editScore = (e) => {
    e.preventDefault();
    dispatch({ type: "toggleDialog", payload: { dialog: { open: false } } });
    const score = +new FormData(e.target).get("score");
    dispatch({ type: "editScore", payload: { id: editGuest.id, score } });
  };

  return (
    <Dialog onClose={close} open={dialogOpen} fullWidth>
      <form onSubmit={editScore}>
        <DialogTitle>{editGuest?.name}</DialogTitle>
        <DialogContent>
          <TextField
            name="score"
            type="number"
            defaultValue={editGuest?.score || 0}
            label="Score"
            size="small"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={close} color="primary">
            Cancel
          </Button>
          <Button type="submit" color="primary">
            Ok
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

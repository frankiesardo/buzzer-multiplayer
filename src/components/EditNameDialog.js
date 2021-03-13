import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import { useSetRecoilState, useRecoilValue } from "recoil";
import { appReducer, dialogOpenView, guestInfoView } from "../state";

export default function EditNameDialog() {
  const dialogOpen = useRecoilValue(dialogOpenView);
  const dispatch = useSetRecoilState(appReducer);
  const { name } = useRecoilValue(guestInfoView);

  const close = () => {
    dispatch({ type: "toggleDialog", payload: { dialog: { open: false } } });
  };

  const editName = (e) => {
    e.preventDefault();
    dispatch({ type: "toggleDialog", payload: { dialog: { open: false } } });
    const name = new FormData(e.target).get("name");
    dispatch({ type: "editName", payload: { name } });
  };

  return (
    <Dialog onClose={close} open={dialogOpen} fullWidth>
      <form onSubmit={editName}>
        <DialogTitle>Edit your name</DialogTitle>
        <DialogContent>
          <TextField
            name="name"
            defaultValue={name}
            label="Your name"
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

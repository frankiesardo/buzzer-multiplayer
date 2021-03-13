const flexParent = {
  display: "flex",
  flexDirection: "column",
  flex: "auto",
};

const flexParentRow = { ...flexParent, flexDirection: "row" };

const scrollable = {
  flex: "auto",
  height: "0px",
  overflowY: "auto",
  overflowX: "hidden",
};

const background = { backgroundColor: "gainsboro" };

const fullscreen = {
  ...flexParent,
  backgroundColor: "white",
  height: window.innerHeight,
};

const style = {
  flexParent,
  flexParentRow,
  scrollable,
  background,
  fullscreen,
};

export default style;

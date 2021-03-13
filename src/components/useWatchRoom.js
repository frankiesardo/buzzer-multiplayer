import { useRecoilValue, useSetRecoilState } from "recoil";
import { useEffect } from "react";

import { roomIdView, userIdView, appReducer } from "../state";
import { subscribe } from "../effects";

export default function useWatchRoom(initUser) {
  const roomId = useRecoilValue(roomIdView);
  const userId = useRecoilValue(userIdView);
  const dispatch = useSetRecoilState(appReducer);

  useEffect(() => {
    if (!userId) {
      dispatch({ type: initUser });
    } else {
      return subscribe(roomId, (guestList) =>
        dispatch({ type: "subscriptionResult", payload: { guestList } })
      );
    }
  }, [initUser, roomId, userId, dispatch]);
}

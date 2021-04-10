import { createAction, handleActions } from "redux-actions";

export const START = "timer/START";
export const PAUSE = "timer/PAUSE";
export const STOP = "timer/STOP";
export const WATCH = "timer/WATHC";
export const RESTART = "timer/RESTART";
export const SET_STATUS = "timer/SET_STATUS";
export const SET_COUNT = "timer/SET_COUNT";

export const start = createAction(START);
export const watch = createAction(WATCH);
export const pause = createAction(PAUSE);
export const stop = createAction(STOP);
export const restart = createAction(RESTART);
export const setStatus = createAction(SET_STATUS);
export const setCount = createAction(SET_COUNT);

export const actions = {
  start,
  watch,
  pause,
  stop,
  restart,
  setStatus,
  setCount,
};

const initialState = {
  status: "stop",
  count: 0,
};

const status = handleActions(
  {
    [SET_STATUS]: (state, action) => {
      const status = action.payload;
      return { ...state, status };
    },
    [SET_COUNT]: (state, action) => {
      const count = action.payload;
      return { ...state, count };
    },
  },
  initialState
);

export default status;

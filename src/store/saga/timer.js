import {
  all,
  call,
  cancel,
  delay,
  flush,
  fork,
  put,
  race,
  select,
  take,
} from "redux-saga/effects";
import { buffers } from "redux-saga";
import { closeChannel, subscribe } from "./channel";
import * as TimerActions from "../redux/timer";

const getTimerFromStore = (state) => state.timer;

export function* start() {
  yield put(TimerActions.watch());
}
export function* watcher() {
  while (yield take(TimerActions.watch)) {
    try {
      yield put(TimerActions.setStatus("play"));
      const worker = yield fork(connectChannel);
      yield take(TimerActions.stop);
      yield cancel(worker);
    } catch (error) {
      console.error(error);
    } finally {
      yield all([
        put(TimerActions.setStatus("stop")),
        put(TimerActions.setCount(0)),
      ]);
    }
  }
}
function* connectChannel() {
  let channel;
  try {
    const timer = 10;
    const buffer = buffers.sliding(1);
    const param = { buffer, timer };
    channel = yield call(subscribe, param);
    let timeTemp = null; //이전 시각
    while (true) {
      let now = Date.now(); //현재 시각
      let interval = timeTemp ? now - timeTemp : 0;
      timeTemp = now;
      yield flush(channel);
      const store = yield select(getTimerFromStore);
      yield put(TimerActions.setCount(store.count + interval));
      // eslint-disable-next-line no-unused-vars
      const { timeout, pause } = yield race({
        timeout: delay(timer),
        pause: take(TimerActions.pause),
      });
      if (pause) {
        yield put(TimerActions.setStatus("pause"));
        timeTemp = null;
        yield take(TimerActions.restart);
        yield put(TimerActions.setStatus("play"));
      }
    }
  } catch (error) {
    console.error(error);
  } finally {
    closeChannel(channel);
  }
}

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
import { EventChannel, buffers } from "redux-saga";
import { closeChannel, subscribe } from "./channel";
import { RootState } from "../redux";
import * as TimerActions from "../redux/timer";

const getTimerFromStore = (state) => state.timer;

export function* start() {
  yield put(TimerActions.watch());
}
export function* watcher() {
  while (yield take(TimerActions.watch)) {
    try {
      yield put(TimerActions.setStatus({ status: "play" }));
      const worker = yield fork(connectChannel);
      yield take(TimerActions.stop);
      yield cancel(worker);
    } catch (error) {
      console.error(error);
    } finally {
      yield all([
        put(TimerActions.setStatus({ status: "stop" })),
        put(TimerActions.setCount({ count: 0 })),
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

    while (true) {
      const message = yield flush(channel);
      const store = yield select(getTimerFromStore);
      yield put(TimerActions.setCount({ count: store.count + 1 }));
      const { timeout, pause } = yield race({
        timeout: delay(timer),
        pause: take(TimerActions.pause),
      });

      if (pause) {
        yield put(TimerActions.setStatus({ status: "pause" }));
        yield take(TimerActions.restart);
        yield put(TimerActions.setStatus({ status: "play" }));
      }
    }
  } catch (error) {
    console.error(error);
  } finally {
    closeChannel(channel);
  }
}

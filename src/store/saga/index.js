import { takeEvery, all, fork } from "redux-saga/effects";

import * as Timersaga from "./timer";
import * as TimerActions from "../redux/timer";

function* handleTimer() {
  yield takeEvery(TimerActions.start, Timersaga.start);
  yield fork(Timersaga.watcher);
}
export default function* rootSaga() {
  yield all([fork(handleTimer)]);
}

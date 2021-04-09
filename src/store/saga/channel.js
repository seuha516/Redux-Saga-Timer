import { EventChannel, Buffer, eventChannel, buffers } from "redux-saga";

export function subscribe(param) {
  const { buffer, timer } = param;

  return eventChannel((emit) => {
    const iv = setInterval(() => {
      emit(+timer);
    }, timer);

    return () => {
      clearInterval(iv);
    };
  }, buffer || buffers);
}

export function closeChannel(channel) {
  if (channel) channel.close();
}

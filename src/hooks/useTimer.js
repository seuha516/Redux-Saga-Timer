import { useSelector } from "react-redux";

export default function useTimer(key) {
  const timer = useSelector((state) => state.timer[key]);
  return timer;
}

import React, { useEffect, useState } from "react";
import {
  RiPlayLine,
  RiPauseLine,
  RiArrowGoForwardFill,
  RiRefreshLine,
} from "react-icons/ri";
import styled from "styled-components";
import useTimer from "../hooks/useTimer";
import useTimerActions from "../hooks/useTimerActions";

const Wrapper = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const TimerTitle = styled.div`
  font-size: 1.5em;
  font-family: "Merriweather", serif;
  font-weight: bold;
  margin-bottom: 0.5em;
  @media all and (max-width: 400px) {
    font-size: 6vw;
    margin-bottom: 2vw;
  }
`;
const TimerDisplay = styled.div`
  font-size: 6em;
  font-family: "Noto Serif", serif;
  @media all and (max-width: 400px) {
    font-size: 24vw;
  }
`;
const ButtonList = styled.div`
  width: 100%;
  margin-top: 2.5em;
  display: flex;
  align-items: center;
  justify-content: center;
  @media all and (max-width: 400px) {
    margin-top: 10vw;
  }
`;
const ButtonBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Button = styled.div`
  margin: 0 1.25em;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: rgba(158, 206, 255, 0.6);
  transition: all 0.3s;
  &:hover {
    transform: translate(0, -5px);
  }
  svg {
    width: 30px;
    height: 30px;
  }
  @media all and (max-width: 400px) {
    margin: 0 5vw;
    width: 20vw;
    height: 20vw;
    &:hover {
      transform: translate(0, -1.25vw);
    }
    svg {
      width: 7.5vw;
      height: 7.5vw;
    }
  }
`;
const ButtonName = styled.div`
  font-size: 1em;
  font-family: "Lora", serif;
  margin-top: 10px;
  opacity: 0.8;
  @media all and (max-width: 400px) {
    font-size: 5vw;
    margin-top: 2.5vw;
  }
`;

const buttonComponent = {
  play: { key: "play", title: "Play", icon: <RiPlayLine /> },
  pause: { key: "pause", title: "Pause", icon: <RiPauseLine /> },
  refresh: { key: "refresh", title: "Refresh", icon: <RiArrowGoForwardFill /> },
  restart: { key: "restart", title: "Restart", icon: <RiRefreshLine /> },
};
const toMMSSSS = (time) => {
  const format = (num) => (num < 10 ? `0${num}` : String(num));
  const minutes = Math.floor(time / 60000);
  const seconds_front = Math.floor((time - minutes * 60000) / 1000);
  const seconds_back = Math.floor(
    (time - minutes * 60000 - seconds_front * 1000) / 10
  );
  return `${format(minutes)}:${format(seconds_front)}.${format(seconds_back)}`;
};

const Timer = () => {
  const status = useTimer("status");
  const count = useTimer("count");
  const timerActions = useTimerActions();

  const [buttonList, setButtonList] = useState(["play"]);

  const handleClick = (type) => {
    switch (type) {
      case "play":
        timerActions.onStart();
        break;
      case "pause":
        timerActions.onPause();
        break;
      case "refresh":
        timerActions.onStop();
        break;
      case "restart":
        timerActions.onRestart();
        break;
      default:
        console.log(type);
    }
  };

  useEffect(() => {
    const _buttonList = ["refresh"];
    switch (status) {
      case "play":
        _buttonList.unshift("pause");
        break;
      case "pause":
        _buttonList.unshift("restart");
        break;
      case "stop":
        _buttonList.unshift("play");
        _buttonList.pop();
        break;
      default:
        console.log(status);
    }
    setButtonList(_buttonList);
  }, [status]);

  return (
    <Wrapper>
      <TimerTitle>Redux-Saga Timer</TimerTitle>
      <TimerDisplay>{toMMSSSS(count)}</TimerDisplay>
      <ButtonList>
        {buttonList.map((btn) => {
          const button = buttonComponent[btn];
          return (
            <ButtonBox key={button.key}>
              <Button onClick={() => handleClick(btn)}>{button.icon}</Button>
              <ButtonName>{button.title}</ButtonName>
            </ButtonBox>
          );
        })}
      </ButtonList>
    </Wrapper>
  );
};

export default Timer;

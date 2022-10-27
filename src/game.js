"use strict";

import * as sound from "./sound.js";
import { Field, ItemType } from "./field.js";

export const Reason = Object.freeze({
  win: "win",
  lose: "lose",
  cancel: "cancel",
});

// Builder Pattern
export class GameBuilder {
  withCarrotCount(num) {
    this.carrotCount = num;
    return this;
  }

  withBugCount(num) {
    this.bugCount = num;
    return this;
  }

  withGameDuration(duration) {
    this.gameDuration = duration;
    return this;
  }
  build() {
    return new Game(this.carrotCount, this.bugCount, this.gameDuration);
  }
}

class Game {
  constructor(carrotCount, bugCount, gameDuration) {
    this.carrotCount = carrotCount;
    this.bugCount = bugCount;
    this.gameDuration = gameDuration;

    this.gameBtn = document.querySelector(".game__button");
    this.gameBtn.addEventListener("click", () => {
      if (this.started) {
        this.stop(Reason.cancel);
      } else {
        this.start();
      }
    });

    this.gameCounter = document.querySelector(".game__counter");
    this.gameTimer = document.querySelector(".game__timer");
    this.started = false;
    this.counter = 0;
    this.timer = undefined;

    this.gameField = new Field(carrotCount, bugCount);
    this.gameField.setClickLister(this.onItemClick);
  }
  setGameStopListener(onGameStop) {
    this.onGameStop = onGameStop;
  }
  start() {
    this.started = true;
    this.init();
    this.gameBtn.innerHTML = `
    <img src="https://img.icons8.com/fluency/48/000000/stop.png"/>`;
    this.showTimeAndCounter();
    this.startGameTimer();
    this.showPlayBtn();
    sound.playBg();
  }

  stop(reason) {
    this.started = false;
    this.stopGameTimer();
    this.hidePlayBtn();
    sound.stopBg();
    this.gameBtn.innerHTML = `
        <img src="https://img.icons8.com/fluency/48/000000/play.png"
      />`;
    this.onGameStop && this.onGameStop(reason);
  }

  onItemClick = (item) => {
    if (!this.started) {
      return;
    }
    if (item === ItemType.carrot) {
      this.counter++;
      this.updateCounterBoard();

      if (this.counter === this.carrotCount) {
        this.stop(Reason.win);
      }
    } else if (item === ItemType.bug) {
      this.gameField.hideField();
      this.stop(Reason.lose);
    }
  };

  showPlayBtn() {
    this.gameBtn.style.visibility = "visible";
  }

  hidePlayBtn() {
    this.gameBtn.style.visibility = "hidden";
  }

  showTimeAndCounter() {
    this.gameTimer.style.visibility = "visible";
    this.gameCounter.style.visibility = "visible";
  }

  startGameTimer() {
    let remainingTimeSec = this.gameDuration;
    this.updateTimerText(remainingTimeSec);
    this.timer = setInterval(() => {
      if (remainingTimeSec <= 0) {
        clearInterval(this.timer);
        this.stop(this.carrotCount === this.counter ? Reason.win : Reason.lose);
        return;
      }
      this.updateTimerText(--remainingTimeSec);
    }, 1000);
  }

  stopGameTimer() {
    clearInterval(this.timer);
  }

  updateTimerText(time) {
    let mins = Math.floor(time / 60);
    let secs = time % 60;

    if (mins < 10) mins = `0${mins}`;
    if (secs < 10) secs = `0${secs}`;
    this.gameTimer.innerText = `${mins}:${secs}`;
  }

  init() {
    this.counter = 0;
    this.gameCounter.innerHTML = this.carrotCount;
    this.gameField.init();
  }

  updateCounterBoard() {
    this.gameCounter.innerText = this.carrotCount - this.counter;
  }
}

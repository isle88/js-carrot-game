"use strict";

import * as sound from "./sound.js";
import Field from "./field.js";

export default class Game {
  constructor(carrotCount, bugCount, gameDuration) {
    this.carrotCount = carrotCount;
    this.bugCount = bugCount;
    this.gameDuration = gameDuration;

    this.gameBtn = document.querySelector(".game__button");
    this.gameBtn.addEventListener("click", () => {
      if (this.started) {
        this.stop();
      } else {
        this.start();
      }
    });

    this.gameCounter = document.querySelector(".game__counter");
    this.gameTimer = document.querySelector(".game__timer");

    this.gameField = new Field(carrotCount, bugCount);
    this.gameField.setClickLister(this.onItemClick);

    this.started = false;
    this.counter = 0;
    this.timer = undefined;
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

  stop() {
    this.started = false;
    this.gameBtn.innerHTML = `
      <img src="https://img.icons8.com/fluency/48/000000/play.png"
    />`;
    this.stopGameTimer();
    this.hidePlayBtn();
    sound.playAlert();
    sound.stopBg();
    this.onGameStop && this.onGameStop("cancel");
  }

  onItemClick = (item) => {
    if (!this.started) {
      return;
    }
    if (item === "carrot") {
      this.counter++;
      this.updateCounterBoard();

      if (this.counter === this.carrotCount) {
        this.finish(true);
      }
    } else if (item === "bug") {
      this.finish(false);
    }
  };

  finish(win) {
    this.started = false;
    this.hidePlayBtn();
    if (win) {
      sound.playWin();
    } else {
      sound.playFail();
    }
    this.stopGameTimer();
    sound.stopBg();
    this.onGameStop && this.onGameStop(win ? "win" : "lose");
  }

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
        this.finish(this.carrotCount === this.counter);
        return;
      }
      this.updateTimerText(--remainingTimeSec);
    }, 1000);
  }

  stopGameTimer() {
    clearInterval(this.timer);
  }

  updateTimerText(time) {
    const mins = Math.floor(time / 60);
    const secs = time % 60;
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

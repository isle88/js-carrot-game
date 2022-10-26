"use strict";
import PopUP from "./popup.js";
import Field from "./field.js";
import * as sound from "./sound.js";

const CARROT_COUNT = 10;
const BUG_COUNT = 10;
const GAME_DURATION_SEC = 60;

const gameBtn = document.querySelector(".game__button");
const gameCounter = document.querySelector(".game__counter");
const gameTimer = document.querySelector(".game__timer");
let started = false;
let carrotCounter = 0;
let timer = undefined;

function initGame() {
  gameCounter.innerHTML = CARROT_COUNT;
  gameField.init();
}

gameBtn.addEventListener("click", controlGame);
function controlGame() {
  if (started) {
    stopGame();
  } else {
    startGame();
  }
}

const gameField = new Field(CARROT_COUNT, BUG_COUNT);
gameField.setClickLister(onItemClick);

function onItemClick(item) {
  if (!started) {
    return;
  }
  if (item === "carrot") {
    carrotCounter--;
    gameCounter.innerText = carrotCounter;

    if (carrotCounter === 0) {
      stopGame();
      finishGame(true);
    }
  } else if (item === "bug") {
    finishGame(false);
  }
}

const gameFinishBanner = new PopUP();
gameFinishBanner.setClickListener(() => {
  startGame();
});

function startGame() {
  started = true;
  initGame();
  gameBtn.innerHTML = `
  <img src="https://img.icons8.com/fluency/48/000000/stop.png"/>`;
  showTimeAndCounter();
  startGameTimer();
  showPlayBtn();
  sound.playBg();
}

function stopGame() {
  started = false;
  gameBtn.innerHTML = `
  <img src="https://img.icons8.com/fluency/48/000000/play.png"
/>`;
  stopGameTimer();
  hidePlayBtn();
  gameFinishBanner.showWithText("REPLAY?");
  sound.playAlert();
  sound.stopBg();
}

function finishGame(win) {
  started = false;
  hidePlayBtn();
  if (win) {
    sound.playWin();
  } else {
    sound.playFail();
  }
  stopGameTimer();
  sound.stopBg();
  gameFinishBanner.showWithText(win ? "Yay :)" : "Try again?");
}

function showPlayBtn() {
  gameBtn.style.visibility = "visible";
}

function showTimeAndCounter() {
  gameTimer.style.visibility = "visible";
  gameCounter.style.visibility = "visible";
}

function startGameTimer() {
  let remainingTimeSec = GAME_DURATION_SEC;
  updateTimerText(remainingTimeSec);
  timer = setInterval(() => {
    if (remainingTimeSec <= 0) {
      stopGameTimer();
      finishGame(carrotCounter === 0);
      return;
    }
    updateTimerText(--remainingTimeSec);
  }, 1000);
}

function stopGameTimer() {
  clearInterval(timer);
}

function updateTimerText(time) {
  const mins = Math.floor(time / 60);
  const secs = time % 60;
  gameTimer.innerText = `${mins}:${secs}`;
}

function hidePlayBtn() {
  gameBtn.style.visibility = "hidden";
}
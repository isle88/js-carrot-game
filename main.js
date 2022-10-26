"use strict";

const CARROT_SIZE = 80;
const CARROT_COUNT = 10;
const BUG_COUNT = 10;
const POP_UP_HIDE = "pop-up--hide";
const GAME_DURATION_SEC = 60;

const gameBtn = document.querySelector(".game__button");
const gameCounter = document.querySelector(".game__counter");
const gameTimer = document.querySelector(".game__timer");
const gameField = document.querySelector(".game__field");
const fieldRect = gameField.getBoundingClientRect();
const popUp = document.querySelector(".pop-up");
const popUpBtn = document.querySelector(".pop-up__button");
const popUpMsg = document.querySelector(".pop-up__message");

const carrotSound = new Audio("./sound/carrot_pull.mp3");
const alertSound = new Audio("./sound/alert.wav");
const bgSound = new Audio("./sound/bg.mp3");
const winSound = new Audio("./sound/game_win.mp3");
const failSound = new Audio("./sound/bug_pull.mp3");
let started = false;
let carrotCounter = 0;
let timer = undefined;

function initGame() {
  gameField.innerHTML = "";
  gameCounter.innerHTML = CARROT_COUNT;
  addItem("carrot", CARROT_COUNT, "img/carrot.png");
  addItem("bug", BUG_COUNT, "img/bug.png");
}

function controlGame() {
  if (started) {
    stopGame();
  } else {
    startGame();
  }
}

function startGame() {
  started = true;
  initGame();
  gameBtn.innerHTML = `
  <img src="https://img.icons8.com/fluency/48/000000/stop.png"/>`;
  showTimeAndCounter();
  startGameTimer();
  showPlayBtn();
  playSound(bgSound);
}

function stopGame() {
  started = false;
  gameBtn.innerHTML = `
  <img src="https://img.icons8.com/fluency/48/000000/play.png"
/>`;
  stopGameTimer();
  hidePlayBtn();
  showPopUpWithMsg("REPLAY?");
  playSound(alertSound)
  stopSound(bgSound);
}

function finishGame(win) {
  started = false;
  hidePlayBtn();
  if (win) {
    playSound(winSound);
  } else {
    playSound(failSound);
  }
  stopGameTimer()
  stopSound(bgSound)
  showPopUpWithMsg(win ? "Yay :)" : "Try again?");
}

function showPlayBtn() {
  gameBtn.style.visibility = "visible";
}

function showPopUpWithMsg(msg) {
  popUpMsg.innerText = msg;
  popUp.classList.remove(POP_UP_HIDE);
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

function addItem(className, count, imgPath) {
  const x1 = 0;
  const y1 = 0;
  const x2 = fieldRect.width - CARROT_SIZE;
  const y2 = fieldRect.height - CARROT_SIZE;

  for (let i = 0; i < count; i++) {
    const item = document.createElement("img");
    item.setAttribute("class", className);
    item.setAttribute("src", imgPath);
    item.style.position = "absolute";
    const x = randomNumber(x1, x2);
    const y = randomNumber(y1, y2);
    item.style.left = `${x}px`;
    item.style.top = `${y}px`;
    gameField.appendChild(item);
    carrotCounter = count;
    gameCounter.innerHTML = carrotCounter;
  }

  function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
  }
}

function removeCarrot(event) {
  if (!started) {
    return;
  }
  const target = event.target;
  if (target.matches(".carrot")) {
    event.target.remove();
    carrotCounter--;
    playSound(carrotSound);
    gameCounter.innerText = carrotCounter;

    if (carrotCounter === 0) {
      stopGame();
      finishGame(true);
    }
  } else if (target.matches(".bug")) {
    finishGame(false);
  }
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function stopSound(sound) {
  sound.pause();
}

function hidePopUp() {
  popUp.classList.add(POP_UP_HIDE);
}

gameBtn.addEventListener("click", controlGame);
gameField.addEventListener("click", removeCarrot);
popUpBtn.addEventListener("click", () => {
  startGame();
  hidePopUp();
});

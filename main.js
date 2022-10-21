"use strict";

const CARROT_SIZE = 80;
const CARROT_COUNT = 5;
const BUG_COUNT = 5;
const POP_UP_HIDE = "pop-up--hide";

const gameBtn = document.querySelector(".game__button");
const gameCounter = document.querySelector(".game__counter");
const gameTimer = document.querySelector(".game__timer");
const gameField = document.querySelector(".game__field");
const fieldRect = gameField.getBoundingClientRect();
const popUp = document.querySelector(".pop-up");
const popUpBtn = document.querySelector(".pop-up__button");
const popUpMsg = document.querySelector(".pop-up__message");

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
  started = !started;
}

function startGame() {
  initGame();
  gameBtn.innerHTML = `
  <img src="https://img.icons8.com/fluency/48/000000/stop.png"/>`;
  showTimeAndCounter();
  showGameTimer();
}

function stopGame() {
  gameBtn.innerHTML = `
  <img src="https://img.icons8.com/fluency/48/000000/play.png"
/>`;
}

function showTimeAndCounter() {
  gameTimer.style.visibility = "visible";
  gameCounter.style.visibility = "visible";
}

function showGameTimer() {}

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
  if (event.target.className === "carrot") {
    event.target.remove();
    carrotCounter--;
    gameCounter.innerText = carrotCounter;
    if (carrotCounter === 0) {
      popUpMsg.innerHTML = "Restart!";
      popUp.classList.remove(POP_UP_HIDE);
    }
  } else if (event.target.className === "bug") {
    popUp.classList.remove(POP_UP_HIDE);
    popUpMsg.innerText = "Failed";
  }
}
gameBtn.addEventListener("click", controlGame);
document.addEventListener("click", removeCarrot);
popUpBtn.addEventListener("click", () => {
  document.location.reload();
});

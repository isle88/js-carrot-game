"use strict";

const CARROT_SIZE = 80;
const CARROT_COUNT = 5;
const BUG_COUNT = 5
const POP_UP_HIDE ="pop-up--hide"

const gameBtn = document.querySelector(".game__button");
const counter = document.querySelector(".game__counter");
const gameField = document.querySelector(".game__field");
const fieldRect = gameField.getBoundingClientRect();
const popUp = document.querySelector(".pop-up");
const popUpBtn = document.querySelector(".pop-up__button");
const popUpMsg = document.querySelector(".pop-up__message");

let started = false;
let carrotCount = 0;
let timer = undefined;

function onPlay(event) {
  // change Btn state
  controlGame(event);

  // countdown

  // add carrots and bugs
  addItem("carrot", CARROT_COUNT, "img/carrot.png");
  addItem("bug",BUG_COUNT, "img/bug.png");
}

function controlGame(event) {
  event.preventDefault();
  if (event.target.className === "play") {
    gameBtn.innerHTML = `
    <img class="stop" src="https://img.icons8.com/fluency/48/000000/stop.png"/>`;
  } else {
    gameBtn.innerHTML = `
    <img
    class="play"
    src="https://img.icons8.com/fluency/48/000000/play.png"
  />`;
    popUp.classList.remove(POP_UP_HIDE);
  }
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
    carrotCount = count
    counter.innerHTML = carrotCount;
  }

  function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
  }
}

function removeCarrot(event) {
  if (event.target.className === "carrot") {
    event.target.remove();
    console.log(carrotCount)
    carrotCount--;
    counter.innerText = carrotCount
    if (carrotCount === 0) {
      popUpMsg.innerHTML = "Restart!";
      popUp.classList.remove(POP_UP_HIDE);
    }
  } else if (event.target.className === "bug") {
    popUp.classList.remove(POP_UP_HIDE);
    popUpMsg.innerText = "Failed";
  }
}
gameBtn.addEventListener("click", onPlay);
document.addEventListener("click", removeCarrot);
popUpBtn.addEventListener("click", () => {
  document.location.reload()
});

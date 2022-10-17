const playButton = document.querySelector(".play_button");
const counter = document.querySelector(".counter");
const paint = document.querySelector(".paint");
const replay = document.querySelector(".replay");
const replayButton = document.querySelector(".replay_button");

let carrots = Math.floor(Math.random() * 20);

function onplay(event) {
  // change button state
  changeButton(event);

  // countdown

  // show carrots and bugs
  paintNow();
}

function changeButton(event) {
  //   event.preventDefault();
  if (event.target.className === "play") {
    playButton.innerHTML = `
    <img class="stop" src="https://img.icons8.com/fluency/48/000000/stop.png"/>`;
  } else {
    playButton.innerHTML = `
    <img
    class="play"
    src="https://img.icons8.com/fluency/48/000000/play.png"
  />`;
  replay.style.visibility = "visible";
  }
}

function paintNow() {
  let carrotNBug = "";

  counter.innerText = carrots;

  for (let i = 0; i < carrots; i++) {
    carrotNBug += `
    <img src="./img/bug.png" alt="bug" />
    <img src="./img/carrot.png" alt="carrot" />`;
    paint.innerHTML = `${carrotNBug}`;
  }
}

function removeCarrot(event) {
  if (event.target.alt === "carrot") {
    event.target.remove();
    carrots--;
    counter.innerHTML = carrots;
    if (carrots === 0) {
      replay.style.visibility = "visible";
    }
  }
}
playButton.addEventListener("click", onPlay);
document.addEventListener("click", removeCarrot);
replayButton.addEventListener("click", () => {
  // game restart
  onplay();
  // hide replay window
  replay.style.visibility = "hidden";
});

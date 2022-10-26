"use strict";

export default class PopUP {
  constructor() {
    this.popUp = document.querySelector(".pop-up");
    this.popUpMsg = document.querySelector(".pop-up__message");
    this.popUpBtn = document.querySelector(".pop-up__button");
    this.popUpBtn.addEventListener("click", () => {
      this.onClick && this.onClick();
      this.hide();
    });
  }

  setClickListener(onClick) {
    this.onClick = onClick;
  }

  hide() {
    this.popUp.classList.add("pop-up--hide");
  }

  showWithText(msg) {
    this.popUpMsg.innerText = msg;
    this.popUp.classList.remove("pop-up--hide");
  }
}

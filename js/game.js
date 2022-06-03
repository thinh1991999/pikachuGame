import { algorithmsClass } from "./algorithms.js";
import { drawClass } from "./draw.js";
import getBox from "./getBox.js";
import section from "./sections.js";
let firstActive = null;
let secondActive = null;

let timeInterval;

let levels = [
  {
    level: 1,
    title: "Bình thường",
    duration: 500,
    blood: 10,
  },
  {
    level: 2,
    title: "Thả xuống dưới",
    duration: 800,
    blood: 9,
  },
  {
    level: 3,
    title: "Thả lên trên",
    duration: 800,
    blood: 8,
  },
  {
    level: 4,
    title: "Thả qua trái",
    duration: 800,
    blood: 7,
  },
  {
    level: 5,
    title: "Thả qua phải",
    duration: 800,
    blood: 6,
  },
  {
    level: 6,
    title: "Tập trung giữa",
    duration: 900,
    blood: 5,
  },
];

class Game {
  arrImages;
  level = 1;
  score = 0;
  blood = 0;
  round = 1;
  duration;
  constructor(algorithms, section, draw) {
    this.algorithms = algorithms;
    this.section = section;
    this.draw = draw;
  }
  init() {
    this.renderMenuBoard();
  }
  renderMenuBoard() {
    const menuBoard = document.querySelector(".menu__board");
    const mainBoard = document.querySelector(".main__board");
    menuBoard.style.display = "block";
    mainBoard.style.display = "none";
    const start__btn = document.querySelector(".start__btn");
    start__btn.onclick = () => {
      this.score = 0;
      this.round = 1;
      this.renderMainBoard();
    };
  }
  renderMainBoard() {
    const menuBoard = document.querySelector(".menu__board");
    const mainBoard = document.querySelector(".main__board");
    menuBoard.style.display = "none";
    mainBoard.style.display = "block";
    this.reloadGame();
  }
  chooseRenderMenu() {
    const menu__btns = document.querySelectorAll(".menu__btn");
    menu__btns.forEach((btn) => {
      btn.onclick = () => {
        const main__board__box = document.querySelector(".main__board__box");
        const main__board__layer = document.querySelector(
          ".main__board__layer"
        );
        main__board__layer.style.opacity = "50%";
        main__board__layer.style.zIndex = 0;
        main__board__box.innerHTML = "";
        main__board__box.style.display = "none";
        this.renderMenuBoard();
      };
    });
  }
  getLevel() {
    return this.level - 1;
  }
  reloadGame() {
    clearInterval(timeInterval);
    firstActive = null;
    this.arrImages = this.algorithms.getNewMatrix();
    this.blood = levels[this.getLevel()].blood;
    this.duration = levels[this.getLevel()].duration;
    this.loadImagesIcon();
    this.renderLevelOption();
    this.renderTitle();
    this.renderLevel();
    this.renderScore();
    this.renderBlood();
    this.renderTimeBar();
    this.renderRound();
    this.playAgain();
    this.chooseRepair();
    this.chooseHelp();
    this.chooseRenderMenu();
  }
  renderTimeBar() {
    const timeBar = document.querySelector(".time__bar");
    const timeText = document.querySelector(".time__text");
    timeBar.style.height = this.duration / 2 + "px";
    timeText.innerHTML = this.duration;
    timeInterval = setInterval(() => {
      this.duration--;
      if (this.duration === 0) {
        this.renderNoTime();
      }
      const timeBar = document.querySelector(".time__bar");
      const timeText = document.querySelector(".time__text");
      timeBar.style.height = this.duration / 2 + "px";
      timeText.innerHTML = this.duration;
    }, 1000);
  }
  clickSection() {
    const sectionAll = document.querySelectorAll(".section");
    sectionAll.forEach((section) => {
      const col = section.getAttribute("col") * 1;
      const row = section.getAttribute("row") * 1;
      if (this.arrImages[col][row]) {
        section.onclick = () => {
          if (firstActive) {
            if (firstActive?.col === col && firstActive?.row === row) {
              firstActive = null;
              this.loadImagesIcon();
            } else {
              const getPath = this.algorithms.checkPath(
                this.arrImages,
                firstActive.col,
                firstActive.row,
                col,
                row
              );
              if (getPath) {
                this.arrImages[firstActive.col][firstActive.row] = 0;
                this.arrImages[col][row] = 0;
                this.playSuccessSound();
                this.drawPath(getPath);
                firstActive = null;
                drawRectPath = setTimeout(() => {
                  this.score += levels[this.getLevel()].level;
                  this.renderScore();
                  if (this.level !== 1) {
                    this.arrImages = this.algorithms.getLevelMatrix(
                      this.arrImages,
                      this.level
                    );
                  }
                  const checkHavePath = this.algorithms.checkHavePath(
                    this.arrImages
                  );
                  if (this.algorithms.checkFinishRound(this.arrImages)) {
                    this.round++;
                    if (this.level === 6) {
                      this.level = 1;
                    } else {
                      this.level++;
                    }
                    this.reloadGame();
                  } else {
                    if (!checkHavePath) {
                      this.arrImages = this.algorithms.fixMatrix(
                        this.arrImages
                      );
                    }
                  }
                  this.loadImagesIcon();
                }, 500);
              } else {
                this.blood--;
                if (this.blood === 0) {
                  this.renderNoBlood();
                }
                this.renderBlood();
                this.playFailSound();
                firstActive = null;
                this.loadImagesIcon();
              }
            }
          } else {
            firstActive = {
              col,
              row,
            };
            this.loadImagesIcon();
          }
        };
      }
    });
  }
  loadImagesIcon() {
    const mainWrapEl = document.querySelector(".main__wrap__box");
    mainWrapEl.innerHTML = "";
    var div = document.createElement("div");
    div.classList.add("main__wrap__show");
    div.arrPiece = this.algorithms.newArray(17);
    for (var i = 1; i <= 16; i++) {
      for (var j = 1; j <= 9; j++) {
        div.arrPiece[i][j] = this.section(
          div,
          i,
          j,
          this.arrImages[i][j],
          firstActive,
          secondActive
        );
        div.appendChild(div.arrPiece[i][j]);
      }
    }
    div.style.position = "relative";
    div.style.width = 42 * 18 + "px";
    div.style.height = 52 * 10 + "px";
    mainWrapEl.append(div);
    this.clickSection();
  }
  drawPath(arrayList, help = false) {
    const mainWrapShowEl = document.querySelector(".main__wrap__show");
    let point1 = arrayList[0];
    let point2;
    let centre1, centre2;
    let i, rectDraw;
    for (i = 1; i < arrayList.length; i++) {
      const divPath = document.createElement("div");
      point2 = arrayList[i];
      centre1 = this.draw.findCentre(point1.x, point1.y);
      centre2 = this.draw.findCentre(point2.x, point2.y);
      rectDraw = this.draw.getRectDraw(centre1, centre2);
      divPath.style.left = rectDraw.x + "px";
      divPath.style.top = rectDraw.y + "px";
      divPath.style.width = rectDraw.width + "px";
      divPath.style.height = rectDraw.height + "px";
      divPath.style.position = "absolute";
      divPath.style.backgroundColor = help ? "red" : "#fff";
      mainWrapShowEl.append(divPath);
      point1 = point2;
    }
  }
  playSuccessSound() {
    const successEl = document.querySelector(".success__sound");
    const failEl = document.querySelector(".fail__sound");
    failEl.pause();
    successEl.load();
    successEl.play();
  }
  playFailSound() {
    const failEl = document.querySelector(".fail__sound");
    const successEl = document.querySelector(".success__sound");
    successEl.pause();
    failEl.load();
    failEl.play();
  }
  renderLevelOption() {
    const selectEl = document.querySelector(".level__select");
    selectEl.innerHTML = "";
    for (let i = 0; i < levels.length; i++) {
      const optionEl = document.createElement("option");
      if (levels[i].level * 1 === this.level) {
        optionEl.setAttribute("selected", true);
      }
      optionEl.value = levels[i].level * 1;
      optionEl.innerHTML = levels[i].level;
      selectEl.append(optionEl);
    }
    this.onChangeLevel();
  }
  onChangeLevel() {
    const selectEl = document.querySelector(".level__select");
    selectEl.onchange = (e) => {
      this.level = e.target.value * 1;
      console.log(this.level);
      this.score = 0;
      this.reloadGame();
    };
  }
  renderTitle() {
    const titleEl = document.querySelector(".level__title");
    titleEl.innerHTML = levels[this.getLevel()].title;
  }
  renderLevel() {
    const current__level = document.querySelector(".current__level");
    current__level.innerHTML = levels[this.getLevel()].level;
  }
  renderScore() {
    const current__score = document.querySelector(".current__score");
    current__score.innerHTML = this.score;
  }
  renderBlood() {
    const current__blood = document.querySelector(".current__blood");
    current__blood.innerHTML = this.blood;
  }
  renderRound() {
    const current__round = document.querySelector(".current__round");
    current__round.innerHTML = this.round;
  }
  renderNoBlood() {
    const main__board__box = document.querySelector(".main__board__box");
    const main__board__layer = document.querySelector(".main__board__layer");
    main__board__layer.style.opacity = "80%";
    main__board__layer.style.zIndex = 2;
    main__board__box.style.display = "flex";
    clearInterval(timeInterval);
    main__board__box.innerHTML = getBox("Bạn đã hết lượt chơi");
    this.renderInfoBox();
    this.playAgain();
    this.chooseRenderMenu();
  }
  renderNoTime() {
    this.playFailSound();
    const main__board__box = document.querySelector(".main__board__box");
    const main__board__layer = document.querySelector(".main__board__layer");
    main__board__layer.style.opacity = "80%";
    main__board__layer.style.zIndex = 2;
    main__board__box.style.display = "flex";
    clearInterval(timeInterval);
    main__board__box.innerHTML = getBox("Bạn đã hết thời gian");
    this.renderInfoBox();
    this.playAgain();
    this.chooseRenderMenu();
  }
  renderInfoBox() {
    const box__lv = document.querySelector(".box__lv");
    const box__round = document.querySelector(".box__round");
    const box__score = document.querySelector(".box__score");
    box__lv.innerHTML = this.level;
    box__round.innerHTML = this.round;
    box__score.innerHTML = this.score;
  }
  playAgain() {
    const playBtns = document.querySelectorAll(".again__btn");
    playBtns.forEach((btn) => {
      btn.onclick = () => {
        const main__board__box = document.querySelector(".main__board__box");
        const main__board__layer = document.querySelector(
          ".main__board__layer"
        );
        main__board__layer.style.opacity = "50%";
        main__board__layer.style.zIndex = 0;
        main__board__box.innerHTML = "";
        main__board__box.style.display = "none";
        this.round = 1;
        this.score = 0;
        this.reloadGame();
      };
    });
  }
  chooseRepair() {
    const repairBtn = document.querySelector(".fix__btn");
    repairBtn.onclick = () => {
      if (this.blood > 1) {
        this.blood--;
        this.renderBlood();
        this.arrImages = this.algorithms.fixMatrix(this.arrImages);
        this.loadImagesIcon();
        this.playSuccessSound();
      } else {
        this.playFailSound();
      }
    };
  }
  chooseHelp() {
    const help__btn = document.querySelector(".help__btn");
    help__btn.onclick = () => {
      if (this.blood > 1) {
        this.blood--;
        this.renderBlood();
        const findPath = this.algorithms.checkHavePath(this.arrImages);
        this.drawPath(findPath, true);
        this.playSuccessSound();
      } else {
        this.playFailSound();
      }
    };
  }
}

const GameClass = new Game(algorithmsClass, section, drawClass);
GameClass.init();

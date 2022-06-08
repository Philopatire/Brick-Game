const E = {
  score: document.getElementById("score"),
  lives: document.getElementById("lives"),
  playBtn: document.getElementById("play"),
  blockContainer: document.querySelector(".game .block-container"),
  blocks: [],
  ball: document.getElementById("ball"),
  playBlock: document.getElementById("playBlock"),
  pauseBtn: document.getElementById("pause"),
  loss: document.querySelector(".loosing"),
  lossRestart: document.querySelector(".loosing .container button.restart"),
  restartBtn: document.querySelector("header button.restart"),
  lossHead: document.querySelector(".loosing h2"),
  lossParagraph: document.querySelector(".loosing p"),
  scoreCount: document.querySelector(".loosing h5.score-count"),
};
function createBlocks() {
  for (let i = 0; i < 56; i++) {
    let block = document.createElement("div");
    block.classList.add("block");
    E.blockContainer.appendChild(block);
    E.blocks.push(block);
  }
}
function touchedBlock() {
  let ballX = E.ball.offsetLeft,
    ballY = E.ball.offsetTop,
    res;
  E.blocks.forEach((block, index) => {
    if (
      ballX >= block.offsetLeft - 30 &&
      ballX < block.offsetLeft + block.offsetWidth &&
      ballY >= block.offsetTop - 30 &&
      ballY < block.offsetTop + block.offsetHeight
    ) {
      res = { index: index, reverse: false };
      if (ballY >= block.offsetTop - 30 && ballY < block.offsetTop + 10) {
        res.reverse = true;
      }
    }
  });
  return res;
}
function touchedPlay() {
  let ballX = E.ball.offsetLeft;
  let ballY = E.ball.offsetTop + E.ball.offsetHeight;
  let playCoordY = E.playBlock.offsetTop;
  let playCoordX = E.playBlock.offsetLeft;
  if (
    ballY == playCoordY &&
    ballX >= playCoordX - 130 &&
    ballX < playCoordX + 130
  )
    return true;
  return false;
}
let moveBall = {
  clear: false,
  vx: 3,
  vy: 2,
  reverse: {
    y: false,
    x: false,
  },
  move() {
    let interval = setInterval(() => {
      let leftProp = E.ball.style.left;
      let bottomProp = E.ball.style.bottom;
      E.ball.style.left = this.plusProp(leftProp, this.vx);
      E.ball.style.bottom = this.plusProp(bottomProp, this.vy);

      if (this.reverse.y) this.vy = -Math.abs(this.vy);
      else this.vy = Math.abs(this.vy);
      if (this.reverse.x) this.vx = -Math.abs(this.vx);
      else this.vx = Math.abs(this.vx);

      let block = touchedBlock();
      let play = touchedPlay();
      if (block) {
        if (block.reverse) this.reverse.y = false;
        else this.reverse.y = true;
        E.blocks[block.index].style.visibility = "hidden";
        E.blocks.splice(block.index, 1);
        E.score.textContent = parseInt(E.score.textContent) + 12;
      }
      if (play) this.reverse.y = false;
      if (E.ball.offsetTop < 0) {
        this.reverse.y = true;
      }
      if (E.ball.offsetTop >= 550) {
        End();
        E.lossHead.textContent = "Game Over";
        E.lossParagraph.textContent = "Sorry you lose the game";
        E.lossRestart.textContent = "Restart";
      }
      if (E.blocks.length <= 0) {
        End();
        E.lossHead.textContent = "You Win";
        E.lossParagraph.textContent = "Congratulations :)";
        E.lossRestart.textContent = "Reagain";
      }
      if (E.ball.offsetLeft >= 715) this.reverse.x = true;
      if (E.ball.offsetLeft <= 0) this.reverse.x = false;
      if (this.clear) clearInterval(interval);
    }, 10);
  },
  plusProp(cssProp, interval) {
    let number = parseInt(cssProp.match(/(-|)\d+(?=px)/g)[0]);
    number += interval;
    return `${number}px`;
  },
};
let movePlayBLock = {
  clear: false,
  moveLeft() {
    let interval = setInterval(() => {
      let number = E.playBlock.offsetLeft - 365;
      if (E.playBlock.offsetLeft > 105) {
        E.playBlock.style.left = `${number - 10}px`;
      }
      if (this.clear) clearInterval(interval);
    }, 1);
  },
  moveRight() {
    let interval = setInterval(() => {
      let number = E.playBlock.offsetLeft - 365;
      if (E.playBlock.offsetLeft <= 615) {
        E.playBlock.style.left = `${number + 10}px`;
      }
      if (this.clear) clearInterval(interval);
    }, 1);
  },
};
createBlocks();

// Handlers //
const play = () => {
  moveBall.clear = false;
  movePlayBLock.clear = false;
  moveBall.move();
  window.removeEventListener("keyup", spaceEvent);
  E.playBtn.removeEventListener("click", play);
  window.addEventListener("keyup", playEvent);
  window.addEventListener("keydown", playEvent);
};
const pause = () => {
  moveBall.clear = true;
  movePlayBLock.clear = true;
  window.addEventListener("keyup", spaceEvent);
  E.playBtn.addEventListener("click", play);
  window.removeEventListener("keyup", pauseEvent);
  window.removeEventListener("keyup", playEvent);
  window.removeEventListener("keydown", playEvent);
};
const reset = () => {
  window.location.reload();
  E.loss.style.display = "";
  let overlay = document.querySelector(".overlay");
  if (overlay) overlay.remove();
  window.removeEventListener("keyup", escEvent);
};
const End = () => {
  pause();
  window.removeEventListener("keyup", spaceEvent);
  E.playBtn.removeEventListener("click", play);
  window.addEventListener("keyup", escEvent);
  E.loss.style.display = "block";
  let div = document.createElement("div");
  div.classList.add("overlay");
  document.body.prepend(div);
  E.scoreCount.textContent = `Your Score: ${E.score.textContent}`;
};
function spaceEvent(e) {
  if (e.code == "Space") play();
}
function pauseEvent(e) {
  if (e.key == "p" || e.key == "P") pause();
}
function escEvent(e) {
  if (e.code == "Escape") reset();
}
function restartEvent(e) {
  if (e.key == "R" || e.key == "r") reset();
}
function playEvent(e) {
  if (e.type == "keydown") {
    if (e.key == "ArrowLeft") {
      movePlayBLock.clear = false;
      movePlayBLock.moveLeft();
    }
    if (e.key == "ArrowRight") {
      movePlayBLock.clear = false;
      movePlayBLock.moveRight();
    }
  }
  if (e.type == "keyup") {
    if (e.key == "ArrowLeft" || e.key == "ArrowRight") {
      movePlayBLock.clear = true;
    }
  }
}
window.addEventListener("keyup", spaceEvent);
window.addEventListener("keyup", pauseEvent);
window.addEventListener("keyup", restartEvent);
E.playBtn.addEventListener("click", play);
E.pauseBtn.addEventListener("click", pause);
E.lossRestart.addEventListener("click", reset);
E.restartBtn.addEventListener("click", reset);
// Handlers

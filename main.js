// grab DOM elements
const DOM = (() => {
  return {
    mainMenu: document.querySelector('#mainMenu'),
    startBtn: document.querySelector('.start'),
    modeBtns: document.querySelectorAll('.mode'),
    markBtns: document.querySelectorAll('.mark'),
    player1: document.querySelector('#player1'),
    player2: document.querySelector('#player2'),
    turnDisplay: document.querySelector('.turnDisplay'),
    tiles: document.querySelectorAll('.tile'),
    endGameOverlay: document.querySelector('#endgame'),
    mainMenuBtn: document.querySelector('#mainMenuBtn'),
    playAgainBtn: document.querySelector('#playAgain'),
  };
})();

// display module
const displayController = (() => {
  const makeActive = (btns) => {
    btns.forEach((btn) => {
      btn.addEventListener('click', () => {
        // check for any other selected
        let prev = checkSelected(btns);
        if (prev) prev.classList.remove('selected');

        btn.classList.add('selected');
      });
    });
  };

  // check if buttons are selected
  const checkSelected = (btns) => {
    return Array.from(btns).find((btn) => btn.classList.contains('selected'));
  };

  // add and remove shake class to butttons
  const shakeBtns = (btns) => {
    btns.forEach((btn) => {
      btn.classList.add('animate__animated', 'animate__shakeX');
      setTimeout(() => {
        btn.classList.remove('animate__animated', 'animate__shakeX');
      }, 1000);
    });
  };

  // start game
  const gameStart = () => {
    DOM.mainMenu.style.display = 'none';
    Game.newGame();
  };

  DOM.startBtn.addEventListener('click', () => {
    // if no mode selected
    if (!checkSelected(DOM.modeBtns)) return shakeBtns(DOM.modeBtns);
    // if no mark selected
    if (!checkSelected(DOM.markBtns)) return shakeBtns(DOM.markBtns);

    gameStart();
  });

  makeActive(DOM.markBtns);
  makeActive(DOM.modeBtns);
})();

const players = (name, selection) => {
  return { name, selection };
};

/*
game {
  createPlayers // ai or human
  createBoard
  switchTurn
  endGame // win/lose/draw
  newGame
}
*/

const Game = (() => {})();
/*
board {
  getBoard
  markBoard
  validPos
  checkWin // diagonal, horizontal, verticle
  checkFullBoard
  clearBoard
}

aiPlay{
  randomTurn
}

displayController{
  settingOverlay
  endGameOverlay

}
*/

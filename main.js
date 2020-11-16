// grab DOM elements
const DOM = (() => {
  return {
    mainMenu: document.querySelector('#mainMenu'),
    gameOverOverlay: document.querySelector('#endgame'),
    gameOverMenu: document.querySelector('#endgameMessage'),
    gameOverMessage: document.querySelector('#message'),
    startBtn: document.querySelector('.start'),
    modeBtns: document.querySelectorAll('.mode'),
    markBtns: document.querySelectorAll('.mark'),
    player1: document.querySelector('#player1'),
    player2Mode: document.querySelector('#player2Mode'),
    player2: document.querySelector('#player2'),
    turnDisplay: document.querySelector('.turnDisplay'),
    tiles: document.querySelectorAll('.tile'),
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

        player2Mode.classList.contains('selected')
          ? (player2.style.display = 'block')
          : (player2.style.display = 'none');
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

  DOM.startBtn.addEventListener('click', () => {
    // if no mode selected
    if (!checkSelected(DOM.modeBtns)) return shakeBtns(DOM.modeBtns);
    // if no mark selected
    if (!checkSelected(DOM.markBtns)) return shakeBtns(DOM.markBtns);
    gameStart();
  });

  makeActive(DOM.markBtns);
  makeActive(DOM.modeBtns);

  // start game
  const gameStart = () => {
    DOM.mainMenu.classList.add('animate__animated', 'animate__slideOutUp');
    setTimeout(() => {
      DOM.mainMenu.classList.remove('animate__animated', 'animate__slideOutUp');
      DOM.mainMenu.style.display = 'none';
    }, 1000);

    const mark = document.querySelector('.mark.selected').id;
    const mode = document.querySelector('.mode.selected').id;
    Game.newGame(mark, mode);
  };

  const endGame = () => {
    DOM.gameOverOverlay.style.display = 'block';
    DOM.gameOverMenu.classList.add('animate__animated', 'animate__lightSpeedInLeft');
    setTimeout(() => {
      DOM.gameOverMenu.classList.remove('animate__animated', 'animate__lightSpeedInLeft');
    }, 1000);

    DOM.gameOverMessage.textContent = Gameboard.message();
  };

  return { endGame };
})();

const players = (mark, name) => {
  return { mark, name };
};

const Game = (() => {
  let currentPlayer;
  let player1;
  let player2;
  const newGame = (mark, mode) => {
    const oppMark = mark == 'x' ? 'o' : 'x';
    player1 = players(mark, DOM.player1.value || 'Player 1');
    player2 =
      mode == 'player2Mode'
        ? players(oppMark, DOM.player2.value || 'Player 2')
        : players(oppMark, 'AI Jefferson');
    Gameboard.newBoard();
    currentPlayer = player1;
    run();
  };

  const run = () => {
    // place mark
    DOM.tiles.forEach((tile) => {
      tile.addEventListener('click', (e) => {
        Gameboard.markBoard(currentPlayer.mark, e.target.id);
        switchTurn();
        takeTurn();
      });
    });
  };

  const gameOver = () => {
    return Gameboard.fullBoard();
  };

  const switchTurn = () => {
    currentPlayer == player1 ? (currentPlayer = player2) : (currentPlayer = player1);
  };

  const takeTurn = () => {
    if (!gameOver()) {
      DOM.turnDisplay.textContent = `${currentPlayer.name}'s turn!`;
    } else {
      displayController.endGame(Gameboard.message());
    }
  };
  return { newGame };
})();

const Gameboard = (() => {
  let board = [];

  const newBoard = () => {
    board = Array(9).fill('');
  };

  const markBoard = (mark, index) => {
    const pos = document.querySelector(`#${CSS.escape(index)}`);
    if (!validPos(pos)) return;
    board[index] = mark;
    pos.classList.add(mark);
    console.log(board);
  };

  const validPos = (pos) => {
    return !(pos.classList.contains('x') || pos.classList.contains('o'));
  };

  const fullBoard = () => {
    return document.querySelectorAll('.x').length + document.querySelectorAll('.o').length == 9;
  };

  const clearBoard = () => {
    DOM.tiles.forEach((tile) => {
      tile.classList.remove('x');
      tile.classList.remove('o');
    });
  };

  const checkWin = () => {};

  const message = () => {
    return `player 1 won the game!`;
  };
  return { newBoard, fullBoard, clearBoard, markBoard, message };
})();

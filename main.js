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
    player1Input: document.querySelector('#player1'),
    player2Mode: document.querySelector('#player2Mode'),
    player2Input: document.querySelector('#player2'),
    turnDisplay: document.querySelector('.turnDisplay'),
    tiles: document.querySelectorAll('.tile'),
    mainMenuBtn: document.querySelector('#mainMenuBtn'),
    playAgainBtn: document.querySelector('#playAgain'),
  };
})();

const players = (mark, name) => {
  return { mark, name };
};

// display module
const displayController = (() => {
  let mark;
  let mode;

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

  const addAnimation = (ele, animation) => {
    ele.classList.add('animate__animated', animation);
    setTimeout(() => ele.classList.remove('animate__animated', animation), 1000);
  };

  // check if buttons are selected
  const checkSelected = (btns) => {
    return Array.from(btns).find((btn) => btn.classList.contains('selected'));
  };

  // add and remove shake class to butttons
  const shakeBtns = (btns) => {
    btns.forEach((btn) => {
      addAnimation(btn, 'animate__shakeX');
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
    addAnimation(DOM.mainMenu, 'animate__slideOutUp');
    DOM.mainMenu.style.display = 'none';

    mark = document.querySelector('.mark.selected').id;
    mode = document.querySelector('.mode.selected').id;
    Game.init();
    Game.newGame(mark, mode);
  };

  const endGame = () => {
    DOM.gameOverOverlay.style.display = 'block';
    addAnimation(DOM.gameOverMenu, 'animate__lightSpeedInLeft');
    DOM.gameOverMessage.textContent = Game.message();

    DOM.playAgainBtn.addEventListener('click', () => {
      addAnimation(DOM.gameOverMenu, 'animate__lightSpeedOutRight');
      DOM.gameOverOverlay.style.display = 'none';
      Game.newGame(mark, mode);
    });

    DOM.mainMenuBtn.addEventListener('click', () => {
      addAnimation(DOM.gameOverOverlay, 'animate__fadeOut');
      DOM.mainMenu.style.display = 'block';
      addAnimation(DOM.mainMenu, 'animate__fadeIn');
      setTimeout(() => (DOM.gameOverOverlay.style.display = 'none'), 1000);
    });
  };

  return { endGame };
})();

const Game = (() => {
  let currentPlayer;
  let player1;
  let player2;

  const init = () => {
    // place mark
    DOM.tiles.forEach((tile) => {
      tile.addEventListener('click', (e) => {
        if (currentPlayer.name == 'AI Jefferson') return;
        if (Gameboard.markBoard(currentPlayer.mark, e.target.id)) {
          switchTurn();
          takeTurn();
        }
      });
    });
  };

  const newGame = (mark, mode) => {
    const oppMark = mark == 'x' ? 'o' : 'x';
    player1 = players(mark, DOM.player1Input.value || 'Player 1');
    player2 =
      mode == 'player2Mode'
        ? players(oppMark, DOM.player2Input.value || 'Player 2')
        : players(oppMark, 'AI Jefferson');
    Gameboard.newBoard();
    currentPlayer = player1;
    DOM.turnDisplay.textContent = `${currentPlayer.name}'s turn!`;
  };

  const gameOver = () => {
    return Gameboard.checkWin() || Gameboard.fullBoard();
  };

  const switchTurn = () => {
    currentPlayer == player1 ? (currentPlayer = player2) : (currentPlayer = player1);
  };

  const takeTurn = () => {
    if (gameOver()) {
      return displayController.endGame();
    } else {
      DOM.turnDisplay.textContent = `${currentPlayer.name}'s turn!`;
      if (currentPlayer.name == 'AI Jefferson') {
        setTimeout(() => {
          Gameboard.computerplay(player2.mark);
          switchTurn();
          takeTurn();
        }, 1000);
      }
    }
  };

  const message = () => {
    if (Gameboard.winner()) {
      return Gameboard.winner() == player1.mark
        ? `${player1.name} has won!`
        : `${player2.name} has won!`;
    } else {
      return 'DRAW';
    }
  };
  return { newGame, gameOver, message, init };
})();

const Gameboard = (() => {
  let board = [];
  let winningMark = null;

  const newBoard = () => {
    clearBoard();
    winningMark = null;
    board = Array(9).fill('');
  };

  const markBoard = (mark, index) => {
    const pos = document.querySelector(`#${CSS.escape(index)}`);
    if (!validPos(pos)) return;
    board[index] = mark;
    pos.classList.add(mark);
    return true;
  };

  const validPos = (pos) => {
    return !(pos.classList.contains('x') || pos.classList.contains('o'));
  };

  const fullBoard = () => {
    return document.querySelectorAll('.x').length + document.querySelectorAll('.o').length == 9;
  };

  const clearBoard = () => {
    DOM.tiles.forEach((tile) => {
      tile.classList.remove('x', 'o');
    });
  };

  const checkWin = () => {
    if (board.filter((mark) => mark != '').length >= 4) {
      const winConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];
      winConditions.forEach((condition) => {
        if (
          board[condition[0]] &&
          board[condition[0]] === board[condition[1]] &&
          board[condition[0]] === board[condition[2]]
        )
          winningMark = board[condition[0]];
      });
      return winningMark;
    }
  };

  const winner = () => {
    return winningMark;
  };

  const computerplay = (mark) => {
    let choices = board.map((tile, index) => (!tile ? index : '')).filter(String);
    const pos = choices[Math.floor(Math.random() * choices.length)];
    markBoard(mark, pos);
  };

  return { newBoard, fullBoard, clearBoard, markBoard, checkWin, winner, computerplay };
})();

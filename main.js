const players = (name, selection) => {
  return { name, selection };
};

/*


game {
  createPlayers // ai or human
  createBoard
  switchTurn
  endGameMessage // win/lose/draw
  newGame
}

board {
  markBoard
  validPos
  checkWin // diagonal, horizontal, verticle
  checkFullBoard
}

aiPlay{
  randomTurn
}
*/

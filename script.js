const board = document.getElementById('board');
const resetButton = document.getElementById('reset');
const statusDisplay = document.getElementById('status');
let gameBoard = Array(9).fill(null);
let currentPlayer = 'X';
let gameOver = false;

function createBoard() {
  board.innerHTML = '';
  statusDisplay.textContent = '';
  gameBoard.forEach((cell, index) => {
    const div = document.createElement('div');
    div.classList.add('cell');
    div.dataset.index = index;
    div.textContent = cell;
    div.addEventListener('click', handlePlayerMove);
    board.appendChild(div);
  });
}

function handlePlayerMove(event) {
  const index = event.target.dataset.index;
  if (gameBoard[index] || gameOver) return;

  gameBoard[index] = currentPlayer;
  event.target.textContent = currentPlayer;

  if (checkWinner(currentPlayer)) {
    statusDisplay.textContent = `${currentPlayer} wins!`;
    gameOver = true;
  } else if (gameBoard.every(cell => cell !== null)) {
    statusDisplay.textContent = 'Draw!';
    gameOver = true;
  } else {
    currentPlayer = 'O';
    setTimeout(aiMove, 500); // Delay for realism
  }
}

function checkWinner(player) {
  const winCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  return winCombos.some(combo => combo.every(i => gameBoard[i] === player));
}

function aiMove() {
  let move;

  if (Math.random() < 0.4) {
    
    const emptyCells = gameBoard.map((v, i) => v === null ? i : null).filter(i => i !== null);
    move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  } else {
    
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (gameBoard[i] === null) {
        gameBoard[i] = 'O';
        let score = minimax(gameBoard, 0, false);
        gameBoard[i] = null;
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
  }

  if (move !== undefined) {
    gameBoard[move] = 'O';
    document.querySelector(`.cell[data-index='${move}']`).textContent = 'O';

    if (checkWinner('O')) {
      statusDisplay.textContent = 'AI wins!';
      gameOver = true;
    } else if (gameBoard.every(cell => cell !== null)) {
      statusDisplay.textContent = 'Draw!';
      gameOver = true;
    } else {
      currentPlayer = 'X';
    }
  }
}

function minimax(board, depth, isMaximizing) {
  if (checkWinner('O')) return 1;
  if (checkWinner('X')) return -1;
  if (board.every(cell => cell !== null)) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = 'O';
        best = Math.max(best, minimax(board, depth + 1, false));
        board[i] = null;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = 'X';
        best = Math.min(best, minimax(board, depth + 1, true));
        board[i] = null;
      }
    }
    return best;
  }
}

resetButton.addEventListener('click', () => {
  gameBoard = Array(9).fill(null);
  currentPlayer = 'X';
  gameOver = false;
  createBoard();
});

createBoard();
let board;
let currentPlayer;
let gameOver;
let xScore = 0;
let oScore = 0;
let tieScore = 0;

const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');

function startGame() {
  board = Array(9).fill(null);
  currentPlayer = 'X';
  gameOver = false;
  renderBoard();
  statusEl.textContent = "Your turn";
}

function renderBoard() {
  boardEl.innerHTML = '';
  board.forEach((val, i) => {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.textContent = val || '';
    cell.addEventListener('click', () => handleClick(i));
    boardEl.appendChild(cell);
  });
}

function handleClick(i) {
  if (board[i] || gameOver) return;
  board[i] = currentPlayer;
  renderBoard();
  if (checkWin(currentPlayer)) {
    statusEl.textContent = `${currentPlayer} wins!`;
    gameOver = true;
    updateScore(currentPlayer);
  } else if (board.every(cell => cell)) {
    statusEl.textContent = "It's a tie!";
    gameOver = true;
    updateScore('Tie');
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusEl.textContent = `${currentPlayer}'s turn`;
    if (currentPlayer === 'O' && isAIMode()) {
      setTimeout(aiMove, 500);
    }
  }
}

function isAIMode() {
  return document.getElementById('gameMode').value !== 'multiplayer';
}

function aiMove() {
  const mode = document.getElementById('gameMode').value;
  let move;
  if (mode === 'easy') move = easyAI();
  else if (mode === 'medium') move = mediumAI();
  else move = hardAI();
  if (move !== undefined) handleClick(move);
}

function easyAI() {
  const empty = board.map((v, i) => v === null ? i : null).filter(i => i !== null);
  return empty[Math.floor(Math.random() * empty.length)];
}

function mediumAI() {
  return Math.random() < 0.5 ? easyAI() : hardAI();
}

function hardAI() {
  function minimax(newBoard, player) {
    const availSpots = newBoard.map((v, i) => v === null ? i : null).filter(i => i !== null);
    if (checkWinFor('X', newBoard)) return { score: -1 };
    if (checkWinFor('O', newBoard)) return { score: 1 };
    if (availSpots.length === 0) return { score: 0 };

    const moves = [];
    for (let i = 0; i < availSpots.length; i++) {
      const move = {};
      move.index = availSpots[i];
      newBoard[availSpots[i]] = player;
      const result = minimax(newBoard, player === 'O' ? 'X' : 'O');
      move.score = result.score;
      newBoard[availSpots[i]] = null;
      moves.push(move);
    }

    let bestMove;
    if (player === 'O') {
      let bestScore = -Infinity;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }

    return moves[bestMove];
  }

  return minimax([...board], 'O').index;
}

function checkWin(player) {
  return checkWinFor(player, board);
}

function checkWinFor(player, board) {
  const winCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  return winCombos.some(combo => combo.every(i => board[i] === player));
}

function updateScore(winner) {
  if (winner === 'X') xScore++;
  else if (winner === 'O') oScore++;
  else tieScore++;
  document.getElementById('xScore').textContent = xScore;
  document.getElementById('oScore').textContent = oScore;
  document.getElementById('tieScore').textContent = tieScore;
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

startGame();

const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const resetBtn = document.getElementById("reset");
const modeButtons = document.querySelectorAll(".mode");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let isGameActive = true;
let isSinglePlayer = false;

const winCombos = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

cells.forEach(cell => cell.addEventListener("click", onCellClick));
resetBtn.addEventListener("click", resetGame);
modeButtons.forEach(btn => btn.addEventListener("click", switchMode));

function onCellClick(e) {
  const cell = e.target;
  const index = cell.getAttribute("data-index");

  if (board[index] || !isGameActive) return;

  playMove(index, currentPlayer);

  if (isSinglePlayer && isGameActive && currentPlayer === "O") {
    setTimeout(() => {
      const aiIndex = getRandomEmptyCell();
      if (aiIndex !== -1) playMove(aiIndex, "O");
    }, 500);
  }
}

function playMove(index, player) {
  board[index] = player;
  cells[index].textContent = player;
  cells[index].style.color = player === "X" ? "#2979ff" : "#d81b60";

  if (checkWinner(player)) {
    statusText.textContent = `🎉 Player ${player} wins!`;
    highlightWin(player);
    isGameActive = false;
  } else if (board.every(cell => cell)) {
    statusText.textContent = "It's a draw! 🤝";
    isGameActive = false;
  } else {
    currentPlayer = player === "X" ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer}'s turn ${currentPlayer === "X" ? "🧑‍💻" : "🤖"}`;
  }
}

function checkWinner(player) {
  return winCombos.some(combo => combo.every(i => board[i] === player));
}

function highlightWin(player) {
  winCombos.forEach(combo => {
    if (combo.every(i => board[i] === player)) {
      combo.forEach(i => cells[i].classList.add("winner"));
    }
  });
}

function getRandomEmptyCell() {
  const empty = board.map((val, i) => val === "" ? i : null).filter(i => i !== null);
  return empty.length ? empty[Math.floor(Math.random() * empty.length)] : -1;
}

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  isGameActive = true;
  currentPlayer = "X";
  statusText.textContent = `Player ${currentPlayer}'s turn 🧑‍💻`;
  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("winner");
    cell.style.color = "#000";
  });
}

function switchMode(e) {
  modeButtons.forEach(btn => btn.classList.remove("active"));
  e.target.classList.add("active");

  isSinglePlayer = e.target.id === "single-player";
  resetGame();
}

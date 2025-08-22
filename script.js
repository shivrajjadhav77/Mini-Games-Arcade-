// ---------------- Arcade Navigation ----------------
function showGame(id) {
  document.querySelectorAll(".game").forEach(g => g.style.display = "none");
  document.getElementById(id).style.display = "block";

  if (id === "snake") startSnake();
  if (id === "tic") resetTicTacToe();
}

function backToMenu() {
  document.querySelectorAll(".game").forEach(g => g.style.display = "none");
}

// ---------------- Tic Tac Toe ----------------
const boardEl = document.getElementById("board");
let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let scores = {X: 0, O: 0, Draws: 0};

function drawBoard() {
  boardEl.innerHTML = "";
  board.forEach((cell, i) => {
    const div = document.createElement("div");
    div.classList.add("cell");
    div.innerText = cell;
    div.onclick = () => makeMove(i);
    boardEl.appendChild(div);
  });
}
function makeMove(i) {
  if (board[i] === "") {
    board[i] = currentPlayer;
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    drawBoard();
    checkWinner();
  }
}
function checkWinner() {
  const combos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (let [a,b,c] of combos) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      document.getElementById("status").innerText = board[a] + " Wins!";
      scores[board[a]]++;
      updateTicScore();
      boardEl.querySelectorAll(".cell").forEach(c => c.onclick = null);
      return;
    }
  }
  if (!board.includes("")) {
    document.getElementById("status").innerText = "Draw!";
    scores.Draws++;
    updateTicScore();
  }
}
function resetTicTacToe() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  document.getElementById("status").innerText = "";
  drawBoard();
}
function updateTicScore() {
  document.getElementById("ticScore").innerText =
    `X Wins: ${scores.X} | O Wins: ${scores.O} | Draws: ${scores.Draws}`;
}
drawBoard();

// ---------------- Snake ----------------
let snakeCtx, snake, food, dx, dy, snakeInterval, snakeScore;

function startSnake() {
  clearInterval(snakeInterval);
  const canvas = document.getElementById("snakeCanvas");
  snakeCtx = canvas.getContext("2d");
  snake = [{x: 160, y: 160}];
  dx = 20; dy = 0;
  food = randomFood();
  snakeScore = 0;
  updateSnakeScore();

  document.addEventListener("keydown", changeDirection);
  snakeInterval = setInterval(updateSnake, 100);
}

function updateSnake() {
  let head = {x: snake[0].x + dx, y: snake[0].y + dy};
  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    food = randomFood();
    snakeScore++;
    updateSnakeScore();
  } else {
    snake.pop();
  }

  if (head.x < 0 || head.y < 0 || head.x >= 400 || head.y >= 400 || collision(head)) {
    clearInterval(snakeInterval);
    alert("Game Over! Final Score: " + snakeScore);
    return;
  }

  snakeCtx.clearRect(0, 0, 400, 400);
  snakeCtx.fillStyle = "lime";
  snake.forEach(part => snakeCtx.fillRect(part.x, part.y, 20, 20));
  snakeCtx.fillStyle = "red";
  snakeCtx.fillRect(food.x, food.y, 20, 20);
}

function randomFood() {
  return {
    x: Math.floor(Math.random() * 20) * 20,
    y: Math.floor(Math.random() * 20) * 20
  };
}
function changeDirection(e) {
  if (e.key === "ArrowUp" && dy === 0) {dx=0; dy=-20;}
  if (e.key === "ArrowDown" && dy === 0) {dx=0; dy=20;}
  if (e.key === "ArrowLeft" && dx === 0) {dx=-20; dy=0;}
  if (e.key === "ArrowRight" && dx === 0) {dx=20; dy=0;}
}
function collision(head) {
  return snake.slice(1).some(part => part.x === head.x && part.y === head.y);
}
function updateSnakeScore() {
  document.getElementById("snakeScore").innerText = "Score: " + snakeScore;
}

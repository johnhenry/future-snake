const canvas = document.getElementById("game-board");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score-value");
const energyElement = document.getElementById("energy-value");
const startButton = document.getElementById("start-button");
const instructionsButton = document.getElementById("instructions-button");
const instructionsDiv = document.getElementById("instructions");
const closeInstructionsButton = document.getElementById("close-instructions");
const menu = document.getElementById("menu");

canvas.width = 800;
canvas.height = 600;

let snake = [];
let food = {};
let direction = "right";
let gameLoop;
let score = 0;
let energy = 100;

const gridSize = 20;
const teleportCost = 20;
const shapeshiftCost = 15;
const timeManipulationCost = 25;

let timeManipulation = {
  active: false,
  type: null,
  duration: 0,
};

function initGame() {
  snake = [{ x: 0, y: 0 }];
  direction = "right";
  score = 0;
  energy = 100;
  timeManipulation = { active: false, type: null, duration: 0 };
  updateScore();
  updateEnergy();
  createFood();
}

function createFood() {
  food = {
    x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
    y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize,
  };
}

function drawSnake() {
  ctx.fillStyle = "#0ff";
  snake.forEach((segment, index) => {
    ctx.fillRect(segment.x, segment.y, gridSize - 2, gridSize - 2);
    if (index === 0) {
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#0ff";
    }
  });
  ctx.shadowBlur = 0;
}

function drawFood() {
  ctx.fillStyle = "#f0f";
  ctx.beginPath();
  ctx.arc(
    food.x + gridSize / 2,
    food.y + gridSize / 2,
    gridSize / 2,
    0,
    2 * Math.PI
  );
  ctx.fill();
  ctx.shadowBlur = 10;
  ctx.shadowColor = "#f0f";
  ctx.stroke();
  ctx.shadowBlur = 0;
}

function moveSnake() {
  const head = Object.assign({}, snake[0]);

  switch (direction) {
    case "up":
      head.y -= gridSize;
      break;
    case "down":
      head.y += gridSize;
      break;
    case "left":
      head.x -= gridSize;
      break;
    case "right":
      head.x += gridSize;
      break;
  }

  if (head.x < 0) head.x = canvas.width - gridSize;
  if (head.x >= canvas.width) head.x = 0;
  if (head.y < 0) head.y = canvas.height - gridSize;
  if (head.y >= canvas.height) head.y = 0;

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 10;
    energy = Math.min(energy + 5, 100);
    updateScore();
    updateEnergy();
    createFood();
  } else {
    snake.pop();
  }
}

function checkCollision() {
  const head = snake[0];
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }
  return false;
}

function updateScore() {
  scoreElement.textContent = score;
}

function updateEnergy() {
  energyElement.textContent = energy;
}

function gameOver() {
  clearInterval(gameLoop);
  ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#0ff";
  ctx.font = "40px Arial";
  ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
  ctx.font = "20px Arial";
  ctx.fillText(
    "Press Space to Restart",
    canvas.width / 2 - 100,
    canvas.height / 2 + 40
  );
}

function teleport() {
  if (energy >= teleportCost) {
    const head = snake[0];
    head.x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
    head.y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
    energy -= teleportCost;
    updateEnergy();
  }
}

function shapeshift() {
  if (energy >= shapeshiftCost && snake.length > 1) {
    snake.pop();
    energy -= shapeshiftCost;
    updateEnergy();
  }
}

function activateTimeManipulation(type) {
  if (energy >= timeManipulationCost && !timeManipulation.active) {
    timeManipulation = {
      active: true,
      type: type,
      duration: 100,
    };
    energy -= timeManipulationCost;
    updateEnergy();
  }
}

function applyTimeManipulation() {
  if (timeManipulation.active) {
    timeManipulation.duration--;
    if (timeManipulation.duration <= 0) {
      timeManipulation = { active: false, type: null, duration: 0 };
    }

    switch (timeManipulation.type) {
      case "slow":
        return 200;
      case "fast":
        return 50;
      case "reverse":
        snake.reverse();
        return 100;
    }
  }
  return 100;
}

function drawTimeManipulationEffect() {
  if (timeManipulation.active) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.font = "20px Arial";
    ctx.fillText(
      `Time ${
        timeManipulation.type.charAt(0).toUpperCase() +
        timeManipulation.type.slice(1)
      }`,
      10,
      30
    );
  }
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  moveSnake();
  if (checkCollision()) {
    gameOver();
    return;
  }
  drawSnake();
  drawFood();
  drawTimeManipulationEffect();
  energy = Math.max(energy - 0.1, 0);
  updateEnergy();
  if (energy === 0) {
    gameOver();
  }
}

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      if (direction !== "down") direction = "up";
      break;
    case "ArrowDown":
      if (direction !== "up") direction = "down";
      break;
    case "ArrowLeft":
      if (direction !== "right") direction = "left";
      break;
    case "ArrowRight":
      if (direction !== "left") direction = "right";
      break;
    case "t":
      teleport();
      break;
    case "s":
      shapeshift();
      break;
    case "1":
      activateTimeManipulation("slow");
      break;
    case "2":
      activateTimeManipulation("fast");
      break;
    case "3":
      activateTimeManipulation("reverse");
      break;
    case " ":
      if (!gameLoop) {
        initGame();
        gameLoop = setInterval(update, applyTimeManipulation());
      }
      break;
  }
});

startButton.addEventListener("click", () => {
  menu.style.display = "none";
  initGame();
  gameLoop = setInterval(update, applyTimeManipulation());
});

instructionsButton.addEventListener("click", () => {
  instructionsDiv.classList.remove("hidden");
});

closeInstructionsButton.addEventListener("click", () => {
  instructionsDiv.classList.add("hidden");
});

initGame();
drawSnake();
drawFood();

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

// Time manipulation variables
let timeEffect = null;
let timeEffectDuration = 0;
const timeEffectColors = {
  slowDown: "#00FF00",
  speedUp: "#FF0000",
  reverse: "#0000FF",
};

// AI Adversary class
class AIAdversary {
  constructor(x, y, difficulty) {
    this.x = x;
    this.y = y;
    this.difficulty = difficulty;
    this.direction = this.getRandomDirection();
    this.color = this.getColorByDifficulty();
  }

  getRandomDirection() {
    const directions = ["up", "down", "left", "right"];
    return directions[Math.floor(Math.random() * directions.length)];
  }

  getColorByDifficulty() {
    switch (this.difficulty) {
      case "easy":
        return "#FFA500";
      case "medium":
        return "#FF4500";
      case "hard":
        return "#8B0000";
      default:
        return "#FF0000";
    }
  }

  move(snakeHead) {
    const moveRandomly = Math.random() < 0.3;
    if (moveRandomly) {
      this.direction = this.getRandomDirection();
    } else {
      this.direction = this.getDirectionTowardsSnake(snakeHead);
    }

    switch (this.direction) {
      case "up":
        this.y -= gridSize;
        break;
      case "down":
        this.y += gridSize;
        break;
      case "left":
        this.x -= gridSize;
        break;
      case "right":
        this.x += gridSize;
        break;
    }

    if (this.x < 0) this.x = canvas.width - gridSize;
    if (this.x >= canvas.width) this.x = 0;
    if (this.y < 0) this.y = canvas.height - gridSize;
    if (this.y >= canvas.height) this.y = 0;
  }

  getDirectionTowardsSnake(snakeHead) {
    const dx = snakeHead.x - this.x;
    const dy = snakeHead.y - this.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      return dx > 0 ? "right" : "left";
    } else {
      return dy > 0 ? "down" : "up";
    }
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, gridSize - 2, gridSize - 2);
    ctx.strokeStyle = "#000";
    ctx.strokeRect(this.x, this.y, gridSize - 2, gridSize - 2);
  }
}

let adversaries = [];

function initGame() {
  snake = [{ x: 0, y: 0 }];
  direction = "right";
  score = 0;
  energy = 100;
  timeEffect = null;
  timeEffectDuration = 0;
  updateScore();
  updateEnergy();
  createFood();
  createTimePowerUp();
  createAdversaries();
}

function createFood() {
  food = {
    x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
    y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize,
  };
}

function createTimePowerUp() {
  const effects = ["slowDown", "speedUp", "reverse"];
  const randomEffect = effects[Math.floor(Math.random() * effects.length)];
  timePowerUp = {
    x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
    y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize,
    effect: randomEffect,
  };
}

function createAdversaries() {
  adversaries = [];
  const difficulties = ["easy", "medium", "hard"];
  for (let i = 0; i < 3; i++) {
    const x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
    const y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
    const difficulty = difficulties[i];
    adversaries.push(new AIAdversary(x, y, difficulty));
  }
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

function drawTimePowerUp() {
  if (timePowerUp) {
    ctx.fillStyle = timeEffectColors[timePowerUp.effect];
    ctx.beginPath();
    ctx.arc(
      timePowerUp.x + gridSize / 2,
      timePowerUp.y + gridSize / 2,
      gridSize / 2,
      0,
      2 * Math.PI
    );
    ctx.fill();
    ctx.shadowBlur = 10;
    ctx.shadowColor = timeEffectColors[timePowerUp.effect];
    ctx.stroke();
    ctx.shadowBlur = 0;
  }
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

  if (timePowerUp && head.x === timePowerUp.x && head.y === timePowerUp.y) {
    applyTimeEffect(timePowerUp.effect);
    timePowerUp = null;
    setTimeout(createTimePowerUp, 5000);
  }
}

function moveAdversaries() {
  adversaries.forEach((adversary) => {
    adversary.move(snake[0]);
  });
}

function checkCollision() {
  const head = snake[0];
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }

  for (let adversary of adversaries) {
    if (head.x === adversary.x && head.y === adversary.y) {
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

function applyTimeEffect(effect) {
  timeEffect = effect;
  timeEffectDuration = 100;
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (timeEffect) {
    if (timeEffect === "slowDown") {
      if (timeEffectDuration % 2 === 0) {
        moveSnake();
        moveAdversaries();
      }
    } else if (timeEffect === "speedUp") {
      moveSnake();
      moveSnake();
      moveAdversaries();
      moveAdversaries();
    } else if (timeEffect === "reverse") {
      direction = {
        up: "down",
        down: "up",
        left: "right",
        right: "left",
      }[direction];
      moveSnake();
      moveAdversaries();
    }

    timeEffectDuration--;
    if (timeEffectDuration <= 0) {
      timeEffect = null;
    }
  } else {
    moveSnake();
    moveAdversaries();
  }

  if (checkCollision()) {
    gameOver();
    return;
  }

  drawSnake();
  drawFood();
  drawTimePowerUp();
  adversaries.forEach((adversary) => adversary.draw());

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
    case " ":
      if (!gameLoop) {
        initGame();
        gameLoop = setInterval(update, 100);
      }
      break;
  }
});

startButton.addEventListener("click", () => {
  menu.style.display = "none";
  initGame();
  gameLoop = setInterval(update, 100);
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
drawTimePowerUp();
adversaries.forEach((adversary) => adversary.draw());

// Simple testing framework
function assert(condition, message) {
  if (!condition) {
    throw new Error(message || "Assertion failed");
  }
}

// Mock canvas and context
const mockCanvas = {
  width: 800,
  height: 600,
  getContext: () => ({
    clearRect: () => {},
    fillRect: () => {},
    beginPath: () => {},
    arc: () => {},
    fill: () => {},
    stroke: () => {},
  }),
};

// Mock DOM elements
document.getElementById = (id) => ({
  getContext: mockCanvas.getContext,
  width: mockCanvas.width,
  height: mockCanvas.height,
  textContent: "",
});

// Import game functions (assuming they're exposed globally)
const {
  initGame,
  createFood,
  moveSnake,
  checkCollision,
  teleport,
  shapeshift,
} = window;

// Tests
function runTests() {
  console.log("Running tests...");

  // Test game initialization
  initGame();
  assert(snake.length === 1, "Snake should have one segment initially");
  assert(score === 0, "Initial score should be 0");
  assert(energy === 100, "Initial energy should be 100");

  // Test createFood
  createFood();
  assert(
    food.x >= 0 && food.x < canvas.width,
    "Food X position should be within canvas"
  );
  assert(
    food.y >= 0 && food.y < canvas.height,
    "Food Y position should be within canvas"
  );

  // Test moveSnake
  const initialHead = Object.assign({}, snake[0]);
  moveSnake();
  assert(
    snake[0].x !== initialHead.x || snake[0].y !== initialHead.y,
    "Snake should move"
  );

  // Test checkCollision
  snake = [
    { x: 0, y: 0 },
    { x: 20, y: 0 },
    { x: 40, y: 0 },
    { x: 40, y: 20 },
    { x: 20, y: 20 },
    { x: 0, y: 20 },
    { x: 0, y: 0 }, // Collision with head
  ];
  assert(checkCollision(), "Should detect collision with self");

  // Test teleport
  energy = 100;
  const teleportHead = Object.assign({}, snake[0]);
  teleport();
  assert(
    snake[0].x !== teleportHead.x || snake[0].y !== teleportHead.y,
    "Teleport should move snake head"
  );
  assert(energy < 100, "Teleport should consume energy");

  // Test shapeshift
  energy = 100;
  const initialLength = snake.length;
  shapeshift();
  assert(
    snake.length === initialLength - 1,
    "Shapeshift should remove one segment"
  );
  assert(energy < 100, "Shapeshift should consume energy");

  console.log("All tests passed!");
}

// Run tests
runTests();

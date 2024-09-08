# Future Snake

Future Snake is a modern take on the classic Snake game. This project aims to create an engaging and visually appealing version of Snake with additional features and gameplay elements.

## Project Structure

- `index.html`: The main HTML file that structures the game's user interface.
- `styles.css`: Contains the CSS styles for the game's appearance.
- `game.js`: The main JavaScript file that implements the game logic.
- `test.js`: Contains tests for the game's functionality.

## Getting Started

To run the game locally:

1. Clone this repository to your local machine.
2. Open `index.html` in your web browser.

## Gameplay Features

### Classic Snake Mechanics

- Control the snake using arrow keys
- Eat food to grow longer
- Avoid colliding with walls or the snake's own body

### Futuristic Power-ups

1. Teleportation (Press 'T')

   - Instantly move the snake to a random location on the game board
   - Costs 20 energy points

2. Shape-shifting (Press 'S')

   - Shrink the snake's length by one segment
   - Costs 15 energy points

3. Time Manipulation
   - Collect special power-ups to manipulate time:
     - Slow Down (Green): Decreases the snake's speed for a limited time
     - Speed Up (Red): Increases the snake's speed for a limited time
     - Reverse (Blue): Temporarily reverses the snake's direction

### AI Adversaries

- Three AI-controlled adversaries with different difficulty levels:
  - Easy (Orange): Moves mostly randomly with occasional pursuit
  - Medium (Dark Orange): Balances random movement and pursuit
  - Hard (Dark Red): Aggressively pursues the snake
- Avoid colliding with AI adversaries to stay alive
- AI adversaries add an extra layer of challenge and strategy to the game

## Development

This project uses vanilla JavaScript, HTML, and CSS. No build steps are required to run the game.

To run tests:

```bash
npm test
```

## Contributing

Please read the `game_design.md` file for information on the game's design and planned features. Contributions are welcome!

## License

This project is licensed under the ISC License.

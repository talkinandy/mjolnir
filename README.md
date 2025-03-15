# Mjolnir Smash

A 3D mobile web game featuring Thor and Mjolnir, designed for high-score competition.

## Game Description

"Mjolnir Smash" is a 3D action game where players control Thor to smash objects with Mjolnir by tapping the screen. The goal is to achieve the highest score, with the game getting progressively harder as more objects appear. It's themed around Asgard for an immersive experience.

## Features

- **Intuitive Controls:** Tap to swing Mjolnir in the tap direction
- **3D Environment:** Asgard-themed scene using Three.js
- **Progressive Difficulty:** Objects spawn faster and more frequently as your score increases
- **High-Score Focus:** Unlimited gameplay, aim to beat your personal best
- **Responsive Design:** Optimized for mobile and desktop browsers

## How to Play

1. Open the game in a browser (mobile recommended for touch controls)
2. Tap the "Start Game" button
3. Tap anywhere on the screen to swing Mjolnir toward that point
4. Try to hit as many objects as possible to score points
5. Different objects have different point values and health
6. The game continues until you choose to stop

## Running the Game

You can run the game directly by opening the `index.html` file in a web browser. No build step is required since the game uses CDN-hosted Three.js.

For the best experience:

1. Serve the files through a local web server (to avoid any cross-origin issues)
2. View on a mobile device in landscape orientation
3. Use Chrome or Safari for best performance

Example of starting a simple local server:

```bash
# If you have Python installed:
python -m http.server

# If you have Node.js installed:
npx serve
```

Then open `http://localhost:8000` in your browser.

## Technical Details

The game is built using:
- HTML5 and CSS3 for UI
- JavaScript (ES6+) for game logic
- Three.js for 3D rendering
- Simple collision detection using bounding spheres
- Touch input handling for mobile devices

## Future Enhancements

- Detailed 3D models for Thor and Mjolnir
- Sound effects and music
- Particle effects for impacts
- More object types with unique behaviors
- Power-ups and special abilities
- Global leaderboard

## Credits

This game was created based on the "Mjolnir Smash" PRD. All code is original and uses Three.js for 3D rendering. 
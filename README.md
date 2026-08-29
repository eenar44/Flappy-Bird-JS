# Flappy Bird Clone
A browser-based recreation of Flappy Bird, built with Java Script and HTML5 Canvas API.

<img width="400" height="600" alt="flappy_bird_gif-ezgif com-video-to-gif-converter" src="https://github.com/user-attachments/assets/0c33422c-e7bd-42cb-8837-e67580a1a988" />

## Features
* Custom physics - gravity, jump velocity, and collision all handled manually, frame-by-frame
* Pipes are generated procedurally with randomised gap heights
* Circular collision detection for a more natural feeling hit-box for the bird
* Parallax-style scrolling with moving clouds in the background
* Live score tracking and session high score
* Game over screen with a restart button

## Tech Stack
* **JavaScript** - game logic, rendering via `requestAnimationFrame` loop
* **HTML5 Canvas API** - all rendering (bird, pipes, clouds, UI)
* **CSS** - layout and restart button styling

No external libraries were used.

## How to Run
No installation required:
1. Clone the repo
2. Open `index.html` directly in any browser

```bash
git clone https://github.com/eenar44/flappy-bird-js.git
cd flappy-bird-js
open index.html   # or just double-click the file
```
## Controls
To start the game use `Spacebar`. 
Use the `Spacebar` to Jump/ Flap.
Press the Restart button to play again after game over.

## Project Background
This started as a personal learning project after following a Unity tutorial, then was rebuilt from scratch in JavaScript for a university web development group project, where the goal was to recreate a retro arcade game in the browser. This version's graphics are original, made specifically for this repo.

 ## Possible Future Improvements
 
- Persistent high score using `localStorage`
- Difficulty scaling (increasing pipe speed over time)
- Sound effects for jump / score / collision
- Mobile touch controls

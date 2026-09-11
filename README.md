# 馃幃 Bytecade Games

**139+ open-source browser mini games** 鈥?no downloads, no accounts, no ads.

Live site: **https://bytecade.mathduel.games**

This project is forked and rebranded from [hajunho/zeli-web-games](https://github.com/hajunho/zeli-web-games) (Apache-2.0). All game code is original React 18 / HTML5 Canvas 鈥?no game engine, no backend, no tracking.

## Categories (139 games)

| Category | Games | Examples |
|---|---|---|
| 馃暪 Arcade | 15 | Snake, Tetris, Pacman, Breakout, Asteroids, Frogger, Galaga |
| 馃З Puzzle | 19 | 2048, Minesweeper, Sokoban, Match3, LightsOut, Rubik's Cube 2脳2 |
| 鈿?Reflex | 15 | Whack-a-Mole, Aim Trainer, Reaction Test, Fruit Slice |
| 馃儚 Cards | 14 | Blackjack, Solitaire, Chess Puzzle, Connect Four, Othello |
| 馃 Brain | 15 | N-Back, Simon Says, Math Challenge, 24 Game |
| 馃摑 Word | 12 | Word Search, Anagram, Typing Race, Mini Crossword |
| 馃帹 Creative | 14 | Pixel Art, Flag Quiz, Color Mixer, Dot Connect |
| 馃崁 Luck | 14 | Roulette, Bingo, Slot Machine, Dice Poker |
| 馃弮 Sports | 10 | Basketball, Archery, Bowling, Golf, Fishing |
| 鈿?Strategy | 15 | Tower Defense, Maze Escape, Stock Sim, Farm Manager |

## Run locally

```bash
npm install
npm run dev
# 鈫?http://localhost:5173
```

## Build for production

```bash
npm run build
# output: dist/  (static assets, deployable anywhere)
```

## Deploy

Cloudflare Pages is our target. Build config:

| Field | Value |
|---|---|
| Build command | `npm run build` |
| Output directory | `dist` |
| Framework preset | Vite |

## License

Apache-2.0. Includes original work from [hajunho/zeli-web-games](https://github.com/hajunho/zeli-web-games).

## Privacy & Compliance

- No personal data collected
- No third-party trackers or ads
- All game scores stored in local `localStorage`
- Privacy Policy & Terms of Service are embedded at the bottom of the live site

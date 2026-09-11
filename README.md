# 🎮 Zeli Web Games

Welcome! This repo contains **150 mini web games** you can run on your own computer in about a minute. Every game is a single React component using HTML5 Canvas or plain DOM — **no game engine, no backend, no accounts, no network calls**. Just clone, run, and play.

We built these games for our product's game center, and we're sharing them to meet developers who love making web games. **If that's you, we'd really love to hear from you — open an issue or a PR anytime.** 💙

## 🚀 Run the games on your machine

### What you need

Just one thing: **[Node.js](https://nodejs.org)** (the free LTS version is perfect). If you're not sure whether you have it, open a terminal and type `node --version` — if you see a version number, you're ready.

### Windows — the easy way

1. Get the code:
   ```powershell
   git clone https://github.com/hajunho/zeli-web-games.git
   cd zeli-web-games
   ```
   (No git? Click the green **Code ▾** button above → **Download ZIP**, then unzip it.)

2. Run the launcher:
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\run.ps1
   ```

That's it! The script installs everything on the first run and opens the game browser in your default browser automatically.

### macOS / Linux

```bash
git clone https://github.com/hajunho/zeli-web-games.git
cd zeli-web-games
npm install
npm run dev -- --open
```

### What you'll see

A game browser with a search box and category filters. Click any game card to play it — arrow keys or mouse on PC, taps and swipes on mobile-sized windows. Click **← 목록** (back to list) to pick another game.

### Something not working?

- **"node is not recognized"** → install [Node.js LTS](https://nodejs.org), then open a *new* terminal and try again.
- **`npm install` fails** → check your internet connection and try once more; corporate proxies sometimes block npm.
- **Port already in use** → run `npm run dev -- --port 3000 --open` to pick another port.
- Anything else → [open an issue](../../issues) and we'll help you out. No question is too small.

## 🕹 What's inside

| Category | Count | Examples |
|---|---|---|
| 🕹 Arcade | 15 | Snake, MiniTetris, Asteroids, Bomberman, Galaga |
| 🧩 Puzzle | 20 | 2048, Minesweeper, Sokoban, Nonogram, Killer Sudoku |
| ⚡ Reflex | 15 | Whack-a-Mole, Fruit Slice, Aim Trainer, Rhythm Tap |
| 🃏 Cards & Board | 15 | Blackjack, Solitaire, Memory Match, High-Low |
| 🧠 Brain | 15 | N-Back, Simon Says, Math Challenge, Game 24 |
| 📝 Word | 15 | Wordle (Korean), Hangman, Anagram, Crossword |
| 🎨 Creative | 15 | Pixel Art, Color Mixer, Jigsaw, Spot the Difference |
| 🍀 Luck | 15 | Bingo, Roulette, Slot Machine, Yut Nori |
| ♟ Strategy | 15 | Tower Defense, Maze Escape, Stock Sim |
| 🏅 Sports | 10 | Archery, Bowling, Darts, Fishing |

> 🇰🇷 The games were originally built for a Korean-language service, so UI text and the word games are in Korean. The games are easy to follow anyway — and internationalization help is one of the contributions we'd welcome most!

## 🧩 How a game is built

Every game is **one `.jsx` file with zero dependencies besides React**, so you can read any game top-to-bottom in one sitting:

```jsx
const MyGame = ({ onComplete }) => {
    // useState / useRef / useEffect + <canvas> or DOM
    // when the game ends:
    onComplete({ score });   // score: 0–100
};
export default MyGame;
```

- `src/games/<category>/*.jsx` — the 150 game components (lazy-loaded, code-split per game)
- `src/games/GameTester.jsx` — the game browser this repo boots into

Good games to start reading: `arcade/Snake.jsx` (simple canvas loop), `puzzle/Game2048.jsx` (state-driven grid), `reflex/ReactionTest.jsx` (tiny and clear).

## 🤝 Contributing

We'd love your help! Great first contributions:

- **A new game**: create `src/games/<category>/YourGame.jsx` following the `onComplete({ score })` contract (games render in a ~320×420 mobile-friendly area), add it to the lazy-import map and category list in `GameTester.jsx`, play-test it, and open a PR.
- **Polish an existing game**: difficulty tuning, bug fixes, juicier effects.
- **i18n**: help us make the UI and word games playable in English and other languages.

## 📄 License

[Apache-2.0](LICENSE) — free to use, modify, and share.

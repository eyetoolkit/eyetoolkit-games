/**
 * Shared game catalog - pure data, plain ES module.
 *
 * Deliberately free of React/JSX so that BOTH the browser app
 * (GameTester.jsx) and the Node build scripts (prerender.mjs,
 * og-images.mjs, sitemap.mjs) read one identical source of truth.
 */

/** Canonical ordered list of every game name. */
export const GAME_NAMES = ['Snake', 'MiniTetris', 'MiniPacman', 'Breakout', 'FlappyJelly', 'PingPong', 'SpaceInvader', 'Frogger', 'Asteroids', 'JumpRunner', 'Galaga', 'DigDug', 'Bomberman', 'DonkeyKong', 'WhackAMole', 'ReactionTest', 'SpeedClick', 'AimTrainer', 'FruitSlice', 'TimingTap', 'RhythmTap', 'ColorSwitch', 'ArrowDodge', 'BubblePop', 'ShootingGallery', 'TypingWarrior', 'RopeCut', 'StroopTest', 'BombDefuse', 'MathChallenge', 'NBack', 'SimonSays', 'PatternRecognition', 'NumberMemory', 'BalanceScale', 'SequenceComplete', 'Game24', 'PrimeCheck', 'CipherDecode', 'LogicGate', 'BaseConvert', 'UnitConvert', 'FractionCompare', 'MathBreakout', 'PixelArt', 'DrawAndGuess', 'ShadowMatch', 'ColorMixer', 'DotConnect', 'FlagQuiz', 'EmojiCombo', 'MandalaPaint', 'GradientSort', 'JigsawPuzzle', 'SpotDifference', 'TileMosaic', 'SymmetryDraw', 'SpriteAnimator', 'CoinFlip', 'DicePredict', 'Roulette', 'ScratchCard', 'RPS', 'LuckyBox', 'FortuneWheel', 'SlotMachine', 'BingoGame', 'TreasureMap', 'DicePoker', 'TreasureDig', 'LuckySeven', 'CardFortune', 'Game2048', 'Minesweeper', 'MiniSudoku', 'SlidePuzzle', 'Match3', 'LightsOut', 'PipeConnect', 'Sokoban', 'TileMatch', 'Nonogram', 'HanoiTower', 'ColorCode', 'BlockStack', 'ColorSort', 'KillerSudoku', 'OneStroke', 'ColumnsPuzzle', 'NumberCrossword', 'RubiksCube2x2', 'NonsenseQuiz', 'GolfPutt', 'DartGame', 'BasketballShoot', 'SoccerPK', 'ArcheryGame', 'BowlingGame', 'FishingGame', 'SkiSlalom', 'PingPongRally', 'RocketLaunch', 'TowerDefense', 'ResourceManager', 'StockSim', 'FarmManager', 'MazeEscape', 'PlacementPuzzle', 'StrategyRPG', 'DeckBuilder', 'TerritoryWar', 'TradeSim', 'MiniWar', 'RoomEscape', 'DeliveryRoute', 'MerchantSim', 'EnergyManager', 'Blackjack', 'HighLow', 'MemoryMatch', 'SpeedCard', 'PokerHand', 'WarCard', 'ConnectFour', 'Othello', 'MiniGomoku', 'DominoChain', 'MiniGo', 'ChessPuzzle', 'MiniCheckers', 'MiniSolitaire', 'TripleTriad'];


export const GAME_META = {
    AimTrainer: {
        emoji: "🎯",
        desc: "Click targets as fast and accurately as possible",
        description: "A professional-grade aim training tool. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Click on targets as soon as they appear.",
            "Targets appear at random positions — track and click fast.",
            "Your average click time and accuracy are displayed.",
            "Different target sizes and colors may appear — adapt quickly.",
            "Close attention to target edges helps reduce misclicks."
        ],
    },
    ArcheryGame: {
        emoji: "🏹",
        desc: "Draw the bow and release at the perfect moment",
        description: "An archery challenge: draw your bow, aim at the target, and release at the right moment. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Draw the bow fully to increase power and stability.",
            "Aim at the target — account for any wind indicated.",
            "Release at the moment of maximum draw for best accuracy.",
            "Bullseye scores 10, decreasing outward to 1 at the edge.",
            "Three arrows per round — accuracy and consistency determine your score."
        ],
    },
    ArrowDodge: {
        emoji: "🏹",
        desc: "Dodge incoming arrows — how long can you survive?",
        description: "Arrows fly in from all directions and you must dodge them. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Move your character to dodge arrows flying in from all sides.",
            "Watch for visual cues indicating arrow direction before they launch.",
            "The arrow frequency increases as waves progress.",
            "Stay near the center early to maximize reaction time.",
            "Arrow patterns become more complex in later waves."
        ],
    },
    Asteroids: {
        emoji: "☄️",
        desc: "Rotate, thrust, shoot — survive the asteroid belt",
        description: "Pilot your ship through a field of drifting asteroids in this vector-graphics classic. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Use Arrow Left/Right to rotate your ship.",
            "Press Arrow Up to thrust forward in the direction you're facing.",
            "Press Space to fire your laser — break asteroids into smaller pieces.",
            "Large asteroids split into two medium ones; medium split into two small.",
            "Use the screen wrap — fly off one edge and appear on the opposite side."
        ],
    },
    BalanceScale: {
        emoji: "⚖️",
        desc: "Determine which side is heavier using logic",
        description: "A scale shows several weights on each side, and you must determine whether the left side is heavier, the right side is heavier, or they are perfectly balanced. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Read the weight labels on each pan carefully.",
            "Determine the total weight on the left and right sides.",
            "Click heavier/equal/lighter based on your calculation.",
            "Expressions may involve repeated variables — count carefully.",
            "Solve each puzzle to advance — wrong answers end the round."
        ],
    },
    BaseConvert: {
        emoji: "🔁",
        desc: "Convert numbers between binary, decimal, and hex",
        description: "A number is shown in one base (binary, decimal, or hexadecimal) and you must convert it to another base. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Read the number and identify its current base (2=binary, 10=decimal, 16=hex).",
            "Convert to the target base using the correct method.",
            "Binary: group bits in sets of 4 for hex conversion.",
            "Hex digits: A=10, B=11, C=12, D=13, E=14, F=15.",
            "Double-check your arithmetic — one wrong digit invalidates the answer."
        ],
    },
    BasketballShoot: {
        emoji: "🏀",
        desc: "Shoot baskets — arc and power are everything",
        description: "Arc the ball and set the power to sink baskets. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Set the arc (angle) and power of your shot.",
            "Release at the right moment to shoot.",
            "The ball follows a parabolic arc — account for distance.",
            "Swish (nothing but net) scores more than a rim-and-in.",
            "Build a streak for consecutive baskets — your score multiplies."
        ],
    },
    BingoGame: {
        emoji: "🎱",
        desc: "Mark called numbers on your card — first to bingo wins",
        description: "Classic bingo: you receive a card with a grid of numbers. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Your bingo card has numbers in a 5x5 grid.",
            "Numbers are called randomly — mark them on your card.",
            "Complete a full row, column, or diagonal to call Bingo.",
            "Be the first to complete a line to win the round.",
            "Some games require a full card (blackout) for the grand prize."
        ],
    },
    Blackjack: {
        emoji: "🃏",
        desc: "Beat the dealer without going over 21",
        description: "The world's most popular casino card game: your hand must be closer to 21 than the dealer's, without going over. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Your goal: get a hand value closer to 21 than the dealer without going over.",
            "Number cards are worth face value; face cards are 10; aces are 1 or 11.",
            "Hit to draw another card, Stand to keep your current hand.",
            "Double down: double your bet and receive exactly one more card.",
            "If you exceed 21, you bust and lose immediately."
        ],
    },
    BlockStack: {
        emoji: "🧱",
        desc: "Stack blocks precisely — how high can you build?",
        description: "A block swings back and forth — click or tap at the right moment to drop it and stack it perfectly on the block below. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Watch the swinging block and click/tap to drop it.",
            "Time your drop to align with the block below.",
            "Only the overlapping portion stacks — the rest falls away.",
            "Misalignments accumulate, making each level more precise.",
            "Perfect alignment every time = maximum tower height."
        ],
    },
    BombDefuse: {
        emoji: "💣",
        desc: "Defuse the bomb before the timer hits zero",
        description: "A tense wire-cutting puzzle: a bomb timer is counting down and you must defuse it by cutting the right wires in the right sequence. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Read the defusal instructions carefully — they tell you the correct sequence.",
            "Cut the wires in the exact order specified.",
            "Watch the timer — you have limited time to complete the sequence.",
            "One wrong wire and the bomb detonates.",
            "Some modules may have multiple sub-tasks to complete."
        ],
    },
    Bomberman: {
        emoji: "💣",
        desc: "Place bombs, blast walls and rivals",
        description: "Navigate a maze as a Bomberman, placing bombs to blast through walls and trap opponents. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Use arrow keys to move around the maze.",
            "Press Space to drop a bomb — it detonates after a few seconds.",
            "Bombs explode in four directions, taking out soft blocks and enemies.",
            "Your blast range grows with power-ups scattered around the maze.",
            "Stay clear of your own bombs — you're not immune to your own blasts."
        ],
    },
    BowlingGame: {
        emoji: "🎳",
        desc: "Roll the ball to knock down all ten pins",
        description: "Ten-pin bowling: roll the ball down the lane and knock down all the pins. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Choose your starting position on the lane.",
            "Set the ball's spin direction — left spin curves right, right spin curves left.",
            "Release at the right moment to roll straight.",
            "Knock down all 10 pins on your first ball for a Strike.",
            "Knock down remaining pins on the second ball for a Spare."
        ],
    },
    Breakout: {
        emoji: "🎾",
        desc: "Paddle and ball — break all the bricks",
        description: "Breakout is a precision arcade classic: bounce a ball off your paddle to shatter rows of colorful bricks. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Move your paddle left and right to keep the ball in play.",
            "Angle your paddle hits — the ball bounces at different angles depending on where it strikes the paddle.",
            "Break bricks to score points; different colored bricks may be worth different points.",
            "Watch the ball's speed — it increases slightly with each paddle hit.",
            "On mobile, drag left/right to control the paddle."
        ],
    },
    BubblePop: {
        emoji: "🫧",
        desc: "Pop floating bubbles — pop them before they escape",
        description: "Bubbles float upward and you must pop them before they reach the top and escape. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Click or tap on bubbles to pop them.",
            "Pop bubbles before they float off the top of the screen.",
            "Rapid consecutive pops build a combo — earn bonus points.",
            "Different sized bubbles may be worth different points.",
            "The number of bubbles increases as the game progresses."
        ],
    },
    CardFortune: {
        emoji: "🃏",
        desc: "Draw tarot-style cards for a fortune reading",
        description: "A mystical card reading experience: draw cards from a spread and receive interpretations based on the cards' traditional meanings. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Choose how many cards to draw (past, present, future spread).",
            "Click to shuffle and then draw each card.",
            "Each card has a traditional meaning — read your interpretation.",
            "The reading can cover love, career, health, or general fortune.",
            "Some spreads offer more detailed or specific readings."
        ],
    },
    ChessPuzzle: {
        emoji: "♟️",
        desc: "Mate in N moves — find the winning sequence",
        description: "Chess puzzles present a board position and ask you to find the winning move sequence. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "It's White's turn — find the winning sequence of moves.",
            "Look for checks, captures, and forcing moves first.",
            "The goal is to checkmate the opponent in the specified number of moves.",
            "Work backward from checkmate to identify the key moves.",
            "Some puzzles require multiple moves of forced sequence."
        ],
    },
    CipherDecode: {
        emoji: "🔐",
        desc: "Decode secret messages using substitution ciphers",
        description: "An encoded message appears — letters have been systematically replaced (a simple substitution cipher). Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "The cipher text uses a consistent letter substitution.",
            "Look for common letters (E, T, A, O) and common words (THE, AND).",
            "Replace letters one by one to gradually reveal the message.",
            "Some puzzles give you a hint letter to get started.",
            "Frequency analysis: count how often each symbol appears to guess common letters."
        ],
    },
    CoinFlip: {
        emoji: "🪙",
        desc: "Predict heads or tails — pure 50/50 chance",
        description: "The simplest game of chance: a coin is flipped and you predict which face lands up. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Choose your prediction: Heads or Tails.",
            "Click to flip the coin.",
            "If your prediction matches the result, you win.",
            "Track your win/loss streak across multiple flips.",
            "There's no skill involved — it's pure probability."
        ],
    },
    ColorCode: {
        emoji: "🎨",
        desc: "Reproduce the color pattern from memory",
        description: "A sequence of colored pegs is shown briefly, then hidden. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Memorize the color sequence shown for a brief moment.",
            "Recreate the sequence by placing pegs in the correct holes.",
            "The sequence gets longer with each successful round.",
            "Use mnemonic strategies — chunk colors into groups to remember them.",
            "One wrong color invalidates the entire sequence."
        ],
    },
    ColorMixer: {
        emoji: "🎨",
        desc: "Mix RGB channels to match the target color",
        description: "A target color is shown and you must recreate it by adjusting red, green, and blue channel sliders. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Look at the target color you need to match.",
            "Adjust the Red, Green, and Blue sliders to mix your color.",
            "Each channel ranges from 0 to 255.",
            "The closer your color is to the target, the higher your score.",
            "Use color theory: yellow = R+G, cyan = G+B, magenta = R+B."
        ],
    },
    ColorSort: {
        emoji: "🧪",
        desc: "Sort colored balls into tubes — pour carefully",
        description: "Tubes contain mixed colored balls — you must sort them so each tube contains balls of only one color. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Click a tube to select it, then click another tube to pour.",
            "Only the top ball of the selected tube transfers.",
            "Pour onto a tube with the same top color, or into an empty tube.",
            "Sort all balls so each tube has only one color.",
            "Plan pours carefully — pouring into the wrong tube creates new mixes."
        ],
    },
    ColorSwitch: {
        emoji: "🌈",
        desc: "Pass through matching colors — dodge obstacles",
        description: "Navigate a ball through a gauntlet of rotating obstacles, each with colored segments. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Your ball has a current color — only pass through obstacles matching that color.",
            "Collect color changers to switch to the next color in the cycle.",
            "Rotating obstacles sweep across the screen — time your passes.",
            "One wrong color contact and it's game over.",
            "Practice the rhythm of each obstacle pattern."
        ],
    },
    ColumnsPuzzle: {
        emoji: "🧱",
        desc: "Match-3 in vertical columns — Tetris meets Bejeweled",
        description: "Colored gems fall in columns, and when three or more in a row match vertically, they disappear and score points. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Place falling column-shaped pieces into the grid.",
            "Match 3 or more gems of the same color vertically to clear them.",
            "Cleared gems cause remaining gems to fall, potentially triggering combos.",
            "Strategically place pieces to set up vertical matches in advance.",
            "The grid fills up over time — plan ahead to avoid game over."
        ],
    },
    ConnectFour: {
        emoji: "🔴",
        desc: "Drop pieces, connect four in a row — classic two-player strategy",
        description: "A vertical game of tic-tac-toe: drop your colored discs into a 7x6 grid. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Click a column to drop your disc into it.",
            "Discs fall to the lowest available slot in that column.",
            "Connect four of your discs in a row — horizontally, vertically, or diagonally.",
            "Block your opponent's four-in-a-row while building your own.",
            "Anticipate threats two or three moves ahead."
        ],
    },
    DartGame: {
        emoji: "🎯",
        desc: "Throw darts at the board — accuracy and scoring",
        description: "Throw darts at a dartboard and score points based on where they land. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Aim your dart at the target.",
            "Click or tap to throw — timing affects accuracy.",
            "Bullseye (center) scores highest; outer rings score less.",
            "In 501 mode, reduce your score to exactly zero with a double finish.",
            "Double ring (outer thin ring) counts as double the segment value."
        ],
    },
    DeckBuilder: {
        emoji: "🃏",
        desc: "Build a powerful card deck through strategic choices",
        description: "A deck-building game: start with a basic deck and add powerful cards from a shared pool. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Add cards to your deck from the card pool between battles.",
            "Each card has attack, defense, and special effects.",
            "Play cards strategically — sequence and synergy matter.",
            "Defeat enemies using your deck to earn more cards.",
            "Remove weak cards from your deck to improve quality."
        ],
    },
    DeliveryRoute: {
        emoji: "🚚",
        desc: "Optimize your delivery route — time is money",
        description: "You have a list of delivery destinations and must find the most efficient route to visit all of them. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Visit all delivery points on the map in the most efficient order.",
            "Shortest total route = higher score.",
            "Start and end at the depot — plan your path accordingly.",
            "Look for geographic clustering to group nearby stops.",
            "Try different route orders to find the shortest path."
        ],
    },
    DicePoker: {
        emoji: "🎲",
        desc: "Roll dice to make the best poker hand",
        description: "A poker variant played with five dice instead of cards. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Roll five dice initially.",
            "Choose which dice to keep and which to reroll.",
            "Up to three rerolls per round — plan strategically.",
            "Your goal is to make the highest-ranking poker hand.",
            "Different hands score differently — check the scoring table."
        ],
    },
    DicePredict: {
        emoji: "🎲",
        desc: "Predict the dice outcome — how lucky is your guess?",
        description: "One or more dice are rolled and you predict the outcome. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Place your bet or make your prediction before the roll.",
            "You might predict a specific number, a range, or the exact total.",
            "Click to roll the dice.",
            "If your prediction is correct, you win — otherwise you lose.",
            "Different bet types have different odds — check the rules."
        ],
    },
    DigDug: {
        emoji: "⛏️",
        desc: "Dig tunnels and inflate enemies — defeat them from below",
        description: "Dig underground tunnels to navigate beneath your enemies in this unique arcade puzzle-action game. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Use arrow keys to dig horizontal and vertical tunnels.",
            "Press Space or Up to use your pump — inflate enemies until they pop.",
            "Walk over rocks to crack them, then walk under to drop them on enemies below.",
            "Cut off enemy paths by digging strategic tunnels.",
            "Avoid being cornered — enemies can dig too."
        ],
    },
    DominoChain: {
        emoji: "🎲",
        desc: "Chain dominoes by matching open ends",
        description: "Classic domino gameplay: play dominoes by matching the number on one open end of the chain. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Match one of your dominoes to either open end of the chain.",
            "A domino matches an end if it has the same number as that end.",
            "If you can't play, draw from the boneyard or pass.",
            "First to play all dominoes (or lowest remaining hand) wins.",
            "Strategic placement can force opponents to draw or pass."
        ],
    },
    DonkeyKong: {
        emoji: "🦍",
        desc: "Climb ladders, dodge barrels — rescue the princess",
        description: "Classic platformer: Donkey Kong hurls barrels down the structure, and you must climb ladders to reach the top and rescue the princess. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Use left/right arrows to walk along platforms.",
            "Press Up to climb ladders when standing at one.",
            "Jump over rolling barrels — timing is everything.",
            "Some barrels roll faster or follow different paths.",
            "Reach the top platform to advance to the next level."
        ],
    },
    DotConnect: {
        emoji: "🔗",
        desc: "Connect numbered dots to reveal hidden pictures",
        description: "Numbered dots are scattered across the canvas — connect them in the correct numerical order to reveal a hidden picture. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Start at dot 1 and connect to dot 2, then 3, and so on.",
            "Click or tap dots in order — numbers must be sequential.",
            "Lines are drawn between correctly connected dots.",
            "The image gradually reveals as you complete the sequence.",
            "Some puzzles have multiple separate drawings to complete."
        ],
    },
    DrawAndGuess: {
        emoji: "✏️",
        desc: "Draw a prompt and let others guess what it is",
        description: "A creative prompt appears and you draw it on the canvas — use shapes, lines, and color to convey the concept. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Read your drawing prompt carefully.",
            "Use the drawing tools to create your image on the canvas.",
            "Use simple shapes and clear lines — abstract is fine, recognizable is better.",
            "Colors can help convey meaning — use them strategically.",
            "Share your drawing or compare with others' interpretations."
        ],
    },
    EmojiCombo: {
        emoji: "😀",
        desc: "Decode what phrase the emojis represent",
        description: "A string of emojis represents a common phrase, saying, movie title, or idiom. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Look at the sequence of emojis — they encode a common phrase.",
            "Read the emojis as visual clues to the answer.",
            "The answer could be a movie title, song, idiom, or saying.",
            "Think about what each emoji represents literally, then combine.",
            "Submit your answer to check if it's correct."
        ],
    },
    EnergyManager: {
        emoji: "⚡",
        desc: "Balance power generation and consumption",
        description: "Manage a power grid: balance electricity generation (solar, wind, coal) against consumption across a city. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Monitor power generation from all sources.",
            "Match generation to consumption — the grid must be balanced.",
            "Use renewable sources (solar, wind) when available to save costs.",
            "React to spikes in demand — a sudden surge can overload the grid.",
            "Plan for peak demand times — build enough capacity."
        ],
    },
    FarmManager: {
        emoji: "🌾",
        desc: "Run a farm — plant, grow, harvest, and profit",
        description: "Manage a farm from planting to harvest. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Plant crops in available plots — each has a growth time.",
            "Water and tend crops to maximize yield.",
            "Harvest when ready and sell at the market.",
            "Reinvest profits into more plots, better seeds, or farm upgrades.",
            "Seasonal crops have different prices — plan your planting schedule."
        ],
    },
    FishingGame: {
        emoji: "🎣",
        desc: "Cast your line and reel in the catch",
        description: "Cast your line into the water and wait for a fish to bite. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Click Cast to throw your line into the water.",
            "Wait for a fish to bite — you'll feel the rod tug.",
            "Click quickly when you feel the bite to set the hook.",
            "Reel in by clicking/tapping — watch the tension meter.",
            "Too much tension breaks the line; too little lets the fish escape."
        ],
    },
    FlagQuiz: {
        emoji: "🏳️",
        desc: "Guess the country from its flag",
        description: "A flag appears and you must identify which country it belongs to. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "A country flag is displayed — identify the country.",
            "Select the correct answer from multiple choices.",
            "Your score is the number of correct answers.",
            "Think about the flag's colors, patterns, and symbols.",
            "Difficulty increases as less well-known flags appear."
        ],
    },
    FlappyJelly: {
        emoji: "🪼",
        desc: "Tap to flap, dodge pipes — how far can you go?",
        description: "Inspired by Flappy Bird, this reflex game has you tapping to flap a jellyfish upward through an endless series of narrow pipe gaps. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Tap (or press Space) to flap upward — release to fall with gravity.",
            "Navigate through the gaps between green pipes.",
            "Time your flaps carefully: too early or too late and you'll hit a pipe.",
            "The further you fly, the higher your score.",
            "Stay calm and maintain a steady rhythm — over-correcting is the most common mistake."
        ],
    },
    FortuneWheel: {
        emoji: "🎡",
        desc: "Spin the fortune wheel and see where it lands",
        description: "A colorful spinning wheel with different prize segments — spin and see where it stops. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Click the Spin button or swipe to give the wheel a push.",
            "Watch the wheel spin and gradually slow to a stop.",
            "The segment the wheel stops on determines your prize.",
            "Some wheels have bonus rounds with multiplied prizes.",
            "How hard you spin and timing can slightly affect the outcome."
        ],
    },
    FractionCompare: {
        emoji: "½",
        desc: "Compare fractions to determine which is larger",
        description: "Two fractions are shown and you must quickly determine which is larger. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Compare the two fractions to determine which is larger.",
            "Cross-multiplication: compare a/b vs c/d by comparing a×d vs c×b.",
            "Look for fractions close to 0, 1/2, or 1 as anchors.",
            "Simplify fractions mentally when possible.",
            "Speed and accuracy both count toward your score."
        ],
    },
    Frogger: {
        emoji: "🐸",
        desc: "Cross the highway and river to reach the lily pad",
        description: "Guide a frog safely across a busy multi-lane road and a hazardous river to reach home. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Use arrow keys to hop one lane at a time — forward, backward, left, right.",
            "Time your crossings to avoid moving cars and trucks on the road.",
            "On the river, jump on logs and turtles to cross — don't touch the water.",
            "Some turtles dive underwater — watch for them.",
            "Reach all five lily pads at the top to complete the level."
        ],
    },
    FruitSlice: {
        emoji: "🍉",
        desc: "Swipe to slice fruit — don't hit the bombs",
        description: "Fruit flies up from the bottom of the screen and you must swipe through them to slice them in half. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Swipe across the screen to slice fruits that are in the air.",
            "Slice multiple fruits in one swipe for combo bonus points.",
            "Bombs appear occasionally — do NOT slice them or it's game over.",
            "Fruit flies in arcs — track their trajectory to time your slices.",
            "Miss three fruits and the game ends."
        ],
    },
    Galaga: {
        emoji: "🚀",
        desc: "Shoot enemy spacecraft in formation, don't get captured",
        description: "Galaga challenges you to shoot down waves of alien invaders that swoop in formation. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Use left/right arrows to move your ship.",
            "Press Space to fire — hold for rapid fire if available.",
            "Shoot enemies as they dive toward you in formation.",
            "Destroy the commander alien to get bonus points.",
            "Watch for the tractor beam — shoot the enemy before they capture you."
        ],
    },
    Game2048: {
        emoji: "🔢",
        desc: "Merge matching tiles to reach 2048",
        description: "2048 is a sliding tile puzzle: numbered tiles slide in four directions, and when two tiles with the same number collide, they merge into one tile with their sum. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Use arrow keys to slide all tiles in one direction.",
            "Two tiles of the same number merge into their sum when they collide.",
            "Plan several moves ahead — board space is limited.",
            "Keep your highest-value tile in a corner for easier merging.",
            "New tiles (usually 2s, occasionally 4s) appear after each move."
        ],
    },
    Game24: {
        emoji: "24",
        desc: "Use four numbers to make 24 using +−×÷",
        description: "Four numbers are given — use each exactly once combined with addition, subtraction, multiplication, and division to make exactly 24. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Use all four numbers exactly once each.",
            "Combine them with +, -, *, / to reach a total of exactly 24.",
            "Parentheses allowed — operation order matters.",
            "Submit your expression to check if it equals 24.",
            "Look for factor relationships — numbers that divide evenly into 24 are often the key."
        ],
    },
    GolfPutt: {
        emoji: "⛳",
        desc: "Putt the golf ball into the hole with the right power and aim",
        description: "A mini-golf putting green: judge the slope, aim your putt, and set the power. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Aim by setting the direction of your putt.",
            "Set the power — the further you pull back, the harder the shot.",
            "Release to putt — the ball follows the set direction and power.",
            "Account for slopes — the ball curves slightly downhill.",
            "Hole in one is the goal, but two or three putts are realistic."
        ],
    },
    GradientSort: {
        emoji: "🌈",
        desc: "Arrange colors into a smooth gradient",
        description: "A set of color swatches is shown in a jumbled order — you must arrange them into a smooth, continuous color gradient. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Drag and rearrange color swatches into the correct order.",
            "The goal is a smooth, continuous gradient from one hue to another.",
            "Look at hue (which color), saturation (intensity), and lightness (dark/bright).",
            "Small differences between adjacent swatches make the best gradients.",
            "Preview your gradient as you build to check the flow."
        ],
    },
    HanoiTower: {
        emoji: "🔺",
        desc: "Move the tower to the target peg — minimum moves puzzle",
        description: "Discs stacked on one peg must be moved to another peg, one disc at a time, never placing a larger disc on a smaller one. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Move one disc at a time between pegs.",
            "A larger disc can never be placed on top of a smaller disc.",
            "Move all discs from the source peg to the target peg.",
            "For n discs, the minimum solution is 2^n - 1 moves.",
            "Break the problem down: move n-1 discs, move the largest, repeat."
        ],
    },
    HighLow: {
        emoji: "📈",
        desc: "Predict if the next card is higher or lower",
        description: "A card is shown — predict whether the next card will be higher or lower. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "A card is shown — predict if the next card will be Higher or Lower.",
            "Aces count as 14 (highest), making extremes more likely.",
            "If the next card is equal, you usually lose the streak.",
            "Build consecutive correct streaks for score multipliers.",
            "When in doubt, bet on the side with more cards remaining in the deck."
        ],
    },
    JigsawPuzzle: {
        emoji: "🧩",
        desc: "Assemble jigsaw pieces to complete the picture",
        description: "Classic jigsaw puzzle: scattered pieces must be assembled into a complete image. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Drag pieces from the tray onto the puzzle board.",
            "Match edge shapes and image content to find where pieces belong.",
            "Start with edge pieces — they have straighter borders.",
            "Work on color regions to narrow down piece locations.",
            "The puzzle is complete when all pieces are correctly placed."
        ],
    },
    JumpRunner: {
        emoji: "🏃",
        desc: "Auto-runner — jump over obstacles, how far can you go?",
        description: "An endless side-scrolling runner: your character auto-runs and you must jump over gaps and obstacles. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Press Space or tap the screen to jump.",
            "Time your jumps to clear gaps in the floor and obstacles ahead.",
            "The game speeds up gradually — stay focused.",
            "Hold longer jumps by holding the jump key/button longer.",
            "Watch for patterns in obstacles to anticipate upcoming gaps."
        ],
    },
    KillerSudoku: {
        emoji: "🔢",
        desc: "Sudoku with cage sum constraints — harder than it looks",
        description: "Classic Sudoku rules apply, plus each cage (group of cells) has a small number indicating their sum. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Fill 1-9 in every row, column, and 3x3 box as in regular Sudoku.",
            "Cages (dashed areas) must sum to the small number shown.",
            "No number repeats within a cage.",
            "Use cage sums to narrow down possibilities — 3 cells summing to 6 = 1+2+3.",
            "Classic Sudoku logic combined with cage arithmetic."
        ],
    },
    LightsOut: {
        emoji: "💡",
        desc: "Turn off all the lights — each click toggles neighbors",
        description: "A grid of lights is on, and clicking one toggles it along with its orthogonal neighbors. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Click a cell to toggle it and its adjacent neighbors (up, down, left, right).",
            "Corner cells affect 3 lights; edge cells affect 4; center cells affect 5.",
            "Turn off all lights to win.",
            "Every Lights Out puzzle has a solution — keep trying different cells.",
            "Work systematically — sometimes toggling the same cell twice cancels out."
        ],
    },
    LogicGate: {
        emoji: "🔌",
        desc: "Design logic circuits to produce the correct output",
        description: "Logic gates (AND, OR, NOT, XOR, NAND) are the building blocks of computers. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Each gate has a specific logic function — learn AND, OR, NOT, XOR rules.",
            "Connect inputs through gates to produce the target output.",
            "Some puzzles require chaining multiple gates together.",
            "Check your circuit against the truth table to verify correctness.",
            "Start simple and build up to more complex gate networks."
        ],
    },
    LuckyBox: {
        emoji: "📦",
        desc: "Pick a box and reveal what's inside",
        description: "Several boxes are presented and you choose one without knowing what's inside. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Several boxes are displayed — each contains a hidden prize.",
            "Click to choose one box without knowing what's inside.",
            "Your prize is revealed when you open your chosen box.",
            "Some boxes contain better prizes than others.",
            "The odds are shown — higher potential reward usually means lower probability."
        ],
    },
    LuckySeven: {
        emoji: "7️⃣",
        desc: "Bet on the outcome closest to seven",
        description: "Two dice are rolled and you bet on whether the total will be under 7, exactly 7, or over 7. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Choose your bet: Under 7, Exactly 7, or Over 7.",
            "Two dice are rolled and summed.",
            "Under 7: total 2-6. Over 7: total 8-12. Exactly 7: total = 7.",
            "Exactly 7 pays the most but is hardest to hit (6/36 probability).",
            "Under and Over are ~15/36 each, so slightly better odds than 7."
        ],
    },
    MandalaPaint: {
        emoji: "🌸",
        desc: "Color mandala patterns — meditative art therapy",
        description: "A symmetrical mandala pattern is displayed and you fill it with colors of your choice. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Select a color from the palette.",
            "Click or tap on sections of the mandala to fill them.",
            "Use symmetry to your advantage — fill corresponding sections together.",
            "Try complementary colors (opposite on the color wheel) for striking contrast.",
            "There is no right or wrong — create whatever pattern you find pleasing."
        ],
    },
    Match3: {
        emoji: "💎",
        desc: "Swap adjacent tiles to match 3 or more in a row",
        description: "A grid of colored gems — swap adjacent tiles to create a line of three or more matching gems. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Swap adjacent gems by clicking one and then an adjacent one.",
            "Only swaps that create a match of 3+ are allowed.",
            "Match 3 in a row or column to clear them and score points.",
            "Special gems (4-match, 5-match) create powerful cascade effects.",
            "Plan swaps that trigger chain reactions for maximum scores."
        ],
    },
    MathBreakout: {
        emoji: "🧱",
        desc: "Solve math problems to break bricks — brain meets arcade",
        description: "A brilliant mashup: each brick displays a math problem, and your ball breaks the brick that solves your current equation. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "A math problem is shown — solve it to find the target number.",
            "Hit the brick labeled with the correct answer.",
            "Angle your paddle to aim precisely at the target brick.",
            "Miss the target and the problem refreshes — keep solving.",
            "Combo solving and precise shots maximize your score."
        ],
    },
    MathChallenge: {
        emoji: "🧮",
        desc: "Solve math problems under time pressure",
        description: "Math Challenge pits you against a series of arithmetic problems with a countdown timer. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Read the math problem and calculate the answer.",
            "Type or click your answer before the timer runs out.",
            "Faster answers earn more points.",
            "Mix of operations: addition, subtraction, multiplication, division.",
            "Your score is the number of correct answers within the time limit."
        ],
    },
    MazeEscape: {
        emoji: "🌀",
        desc: "Navigate through the maze — find the exit",
        description: "You are placed in a maze — find the path from start to exit. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Use arrow keys to navigate through the maze corridors.",
            "Find the path from the start (usually top-left) to the exit.",
            "Use the left-hand rule as a fallback: always turn left when possible.",
            "The maze is randomly generated — memorize the layout as you go.",
            "Reaching the exit completes the maze — try to improve your time."
        ],
    },
    MemoryMatch: {
        emoji: "🃏",
        desc: "Flip cards to find matching pairs — classic memory game",
        description: "Face-down cards are laid out — flip two at a time to find matching pairs. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Click to flip the first card — remember what it shows.",
            "Click a second card — if it matches the first, both stay open.",
            "If no match, both cards flip back — memorize for later.",
            "Clear all pairs to complete the game.",
            "Your score is the number of moves — fewer moves = better memory."
        ],
    },
    MerchantSim: {
        emoji: "🏪",
        desc: "Run a shop — buy wholesale, sell retail, grow profits",
        description: "Manage a retail shop: buy inventory at wholesale prices and sell to customers at a markup. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Buy goods at wholesale prices to stock your shelves.",
            "Set retail prices — high enough for profit, low enough to attract customers.",
            "Manage your inventory — run out of stock and you lose sales.",
            "Overpriced items don't sell — watch customer behavior.",
            "Reinvest profits to expand your product range and shop size."
        ],
    },
    Minesweeper: {
        emoji: "💣",
        desc: "Clear the minefield without stepping on a mine",
        description: "A grid of cells hides either a mine or a safe number. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Click to reveal a cell — numbers show adjacent mine count.",
            "Use the numbers to deduce which adjacent cells contain mines.",
            "Right-click (or long-press) to place a flag on suspected mines.",
            "Reveal all safe cells to win — don't click on a mine.",
            "Start with corners or edges for the best chance of a safe start."
        ],
    },
    MiniCheckers: {
        emoji: "🔴",
        desc: "Jump and capture opponent pieces — classic draughts",
        description: "Classic Checkers (Draughts): diagonal moves on dark squares, jump over opponent pieces to capture them. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Move diagonally forward one square onto an empty dark square.",
            "Jump diagonally over an opponent's piece to capture it — landing on empty square.",
            "Multiple captures (chain jumps) are mandatory when available.",
            "Reach the opposite end to crown your piece as a King — Kings move backward.",
            "Capture all opponent pieces or block them so they can't move to win."
        ],
    },
    MiniGo: {
        emoji: "⚪",
        desc: "Territory control — surround territory to score points",
        description: "A simplified Go game: place stones on a grid to surround territory. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Place stones on empty intersections — one per turn.",
            "Surround empty space to claim it as territory.",
            "Capture opponent stones by surrounding them completely (no liberties).",
            "Captured stones are removed and count as points for the captor.",
            "Two consecutive passes end the game — count territory to determine the winner."
        ],
    },
    MiniGomoku: {
        emoji: "⚫",
        desc: "Get five in a row before your opponent does",
        description: "Gomoku (Five in a Row) on a grid: two players take turns placing stones, and the first to get five in a row (horizontally, vertically, or diagonally) wins. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Place a stone on any empty intersection of the grid.",
            "First player to get five stones in a row wins.",
            "Balance attacking (building your own five) with defending (blocking opponent).",
            "Control the center early — it gives the most options for future lines.",
            "Watch for double-threat setups — two lines of four that can't both be blocked."
        ],
    },
    MiniPacman: {
        emoji: "👻",
        desc: "Navigate the maze, eat dots, avoid the ghosts",
        description: "Guide Pac-Man through a maze packed with pellets while evading four colorful ghosts — each with their own patrol behavior. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Use arrow keys to navigate Pac-Man through the maze corridors.",
            "Eat all the small pellets to complete the level — each is worth points.",
            "Eat the large power pellets to temporarily turn ghosts blue and chomp them.",
            "Avoid the ghosts when they are their normal color — they end your game on contact.",
            "Use tunnel wraps on the sides of the maze to escape tight situations."
        ],
    },
    MiniSolitaire: {
        emoji: "🃏",
        desc: "Klondike solitaire — build four foundations from Ace to King",
        description: "The classic Klondike Solitaire: deal a tableau of cards, build foundations from Ace to King by suit, and use the stock pile when stuck. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Build four foundation piles from Ace to King by suit.",
            "Build tableau piles in descending order, alternating colors.",
            "Move cards from the stock pile when stuck.",
            "Only Kings can be placed on empty tableau spaces.",
            "Move face-up cards to expose hidden cards in the tableau."
        ],
    },
    MiniSudoku: {
        emoji: "9️⃣",
        desc: "Fill the grid so each row, column, and box contains 1-9",
        description: "A 9x9 grid divided into 3x3 boxes — fill each cell with a digit from 1 to 9, ensuring no digit repeats in any row, column, or box. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Fill each cell with a number from 1 to 9.",
            "No number can repeat in any row, column, or 3x3 box.",
            "Scan rows, columns, and boxes for cells that can only hold one number.",
            "Use pencil marks to note possible values for difficult cells.",
            "Complete the entire grid correctly to win."
        ],
    },
    MiniTetris: {
        emoji: "🧱",
        desc: "Stack falling blocks, clear lines before the board fills",
        description: "Tetris is the ultimate puzzle-skill hybrid — seven tetromino shapes rain down and you must slot them into place before the well fills to the top. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Use left/right arrows to move the falling block horizontally.",
            "Press up arrow or Z to rotate the block clockwise.",
            "Press down arrow to soft-drop (speed up the fall).",
            "Hard-drop (Space) to instantly lock the piece at the bottom.",
            "Fill an entire horizontal row with blocks to clear it and score points."
        ],
    },
    MiniWar: {
        emoji: "💥",
        desc: "Small-scale battle — deploy troops and conquer",
        description: "A compact real-time strategy battle: deploy units with limited resources and use them to defeat your opponent. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Deploy units using your available resources.",
            "Position units strategically — terrain and formation affect outcomes.",
            "Different unit types have strengths and weaknesses.",
            "Deplete the enemy's forces to win.",
            "Earn resources for defeated enemies to deploy more units."
        ],
    },
    NBack: {
        emoji: "🧠",
        desc: "Dual n-back — train your working memory",
        description: "N-Back is a cognitive training task scientifically shown to improve working memory. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Watch the sequence of positions on the grid.",
            "Press 'Match' when the current position is the same as N steps ago.",
            "In dual mode, also listen for audio matches.",
            "N increases as you pass levels — higher N means more demanding memory.",
            "Accuracy matters more than speed — false positives are costly."
        ],
    },
    Nonogram: {
        emoji: "🎯",
        desc: "Fill cells based on number clues to reveal a picture",
        description: "Number clues on each row and column indicate how many consecutive cells are filled. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Read the number clues — they show how many consecutive cells are filled in that row/column.",
            "Multiple numbers in a clue mean groups are separated by at least one empty cell.",
            "Use X to mark cells you know are definitely empty.",
            "Cross-reference row and column clues to narrow down possibilities.",
            "Fill in cells when you're certain — wrong marks make the puzzle harder."
        ],
    },
    NumberCrossword: {
        emoji: "🔢",
        desc: "Fill the grid with intersecting numbers using arithmetic clues",
        description: "A crossword-style grid filled with arithmetic clues: across clues give sums, down clues give products. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Read the across and down clues carefully.",
            "Fill in digits that satisfy both the across and down constraints.",
            "Each cell belongs to one across number and one down number.",
            "Use the crossing cells to constrain both directions simultaneously.",
            "All arithmetic (sums and products) must be exactly correct."
        ],
    },
    NumberMemory: {
        emoji: "🔢",
        desc: "Memorize an increasingly long sequence of digits",
        description: "A sequence of random digits appears for a few seconds and then disappears. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "The number sequence is shown for a brief moment — memorize it.",
            "Type the exact sequence when prompted.",
            "Each round adds one more digit to memorize.",
            "Your score is the longest sequence you successfully recalled.",
            "Chunk numbers in groups of 3-4 to improve recall."
        ],
    },
    OneStroke: {
        emoji: "✒️",
        desc: "Draw the shape in one continuous stroke — no retracing",
        description: "A set of dots connected by lines is shown — draw over every line exactly once without lifting your pen or retracing. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Start from one dot and draw a line through every edge exactly once.",
            "You cannot lift your pen or draw over the same line twice.",
            "If a dot has an odd number of edges, it must be a start or end point.",
            "A shape is drawable in one stroke if it has 0 or 2 odd-degree vertices.",
            "Find the correct starting point — not every start works."
        ],
    },
    Othello: {
        emoji: "⚫",
        desc: "Flip discs to dominate the board — trap and outmaneuver",
        description: "Also known as Reversi: start with four discs in the center, then place your disc so that it brackets one or more opponent discs between your new disc and an existing one of yours. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Place your disc so that it brackets one or more opponent discs.",
            "Bracketing means your disc and an existing disc of yours surround opponent discs on a line.",
            "All bracketed opponent discs flip to your color.",
            "You must make a legal move — pass if none is available.",
            "Corner and edge squares are strategically valuable."
        ],
    },
    PatternRecognition: {
        emoji: "🔍",
        desc: "Find the pattern and identify the next item in the sequence",
        description: "A sequence of shapes, numbers, or colors appears, and you must identify the underlying pattern to predict what comes next. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Study the sequence and identify the pattern rule.",
            "Click on or select the item that continues the pattern correctly.",
            "Common patterns: arithmetic sequence, geometric, alternating, Fibonacci.",
            "Some sequences combine multiple pattern types.",
            "Think flexibly — the pattern might be visual, numerical, or both."
        ],
    },
    PingPong: {
        emoji: "🏓",
        desc: "Two-player table tennis classic",
        description: "A faithful browser recreation of table tennis — two paddles, one ball, fast reflexes. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Player 1 uses W/S keys, Player 2 uses Arrow Up/Down.",
            "Return the ball by positioning your paddle — angle matters for placement.",
            "The ball speeds up slightly after each hit, increasing pressure.",
            "Aim for the edges and corners to make returns harder.",
            "On mobile, drag your paddle left and right."
        ],
    },
    PingPongRally: {
        emoji: "🏓",
        desc: "Rally with the AI — how long can you keep it going?",
        description: "A single-player ping pong challenge: rally the ball back and forth with an AI opponent. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Move your paddle left and right to return the ball.",
            "The AI returns your shots — plan your placements.",
            "Rally length determines your score.",
            "The AI gets better as your rally extends, returning harder shots.",
            "Vary your shots to keep the AI guessing — placement beats power."
        ],
    },
    PipeConnect: {
        emoji: "🔧",
        desc: "Connect pipes so water flows from start to end",
        description: "Pipes are scattered on a grid — rotate them to create a continuous path from the water source to the drain. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Click a pipe to rotate it 90 degrees.",
            "Align pipe openings to create a continuous path from start to end.",
            "Different pipe shapes have different opening configurations.",
            "Some puzzles require all pipes to be correctly aligned.",
            "Open the valve to test your pipe network."
        ],
    },
    PixelArt: {
        emoji: "🎨",
        desc: "Create pixel art on a grid canvas",
        description: "A digital canvas divided into a grid where you place colored pixels to create art. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Select a color from the palette.",
            "Click on grid cells to fill them with the selected color.",
            "Click and drag to paint multiple cells quickly.",
            "Use the eraser or background color to undo mistakes.",
            "Toggle a grid overlay to help with alignment."
        ],
    },
    PlacementPuzzle: {
        emoji: "🔲",
        desc: "Place pieces strategically to achieve the objective",
        description: "A spatial strategy puzzle where you must place pieces on a board to achieve a specific goal — surround territory, maximize coverage, or fulfill placement constraints. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Place your available pieces on the board to achieve the goal.",
            "Each level has a different winning condition — read the instructions.",
            "Plan your placements carefully — pieces can't be moved once placed.",
            "Some puzzles require maximizing area, others require covering targets.",
            "Think about the consequences of each placement before committing."
        ],
    },
    PokerHand: {
        emoji: "♠️",
        desc: "Make the best poker hand from dealt cards",
        description: "Cards are dealt and you must arrange them into the best possible poker hand. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Five cards are dealt — choose which to keep and which to discard.",
            "Click to select cards to hold, then draw to replace discards.",
            "Your final hand is ranked against the poker hand rankings.",
            "Know the hand rankings: High Card < Pair < Two Pair < Three of a Kind < Straight < Flush < Full House < Four of a Kind < Straight Flush.",
            "Strategic discard: keep cards that contribute to a potential strong hand."
        ],
    },
    PrimeCheck: {
        emoji: "🔶",
        desc: "Quickly identify whether a number is prime",
        description: "A number appears and you must quickly determine whether it is prime (only divisible by 1 and itself). Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "A number is shown — determine if it is a prime number.",
            "Click or select Yes if the number is prime, No if it is composite.",
            "Speed matters — answer quickly but accurately.",
            "Use divisibility tricks: check 2, 3, 5, 7, 11, 13... systematically.",
            "Numbers ending in 0, 2, 4, 5, 6, 8 are often easier to check."
        ],
    },
    RPS: {
        emoji: "✊",
        desc: "Rock Paper Scissors — can you read your opponent?",
        description: "The timeless decision game: Rock crushes Scissors, Scissors cuts Paper, Paper covers Rock. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Choose Rock, Paper, or Scissors.",
            "The opponent simultaneously reveals their choice.",
            "Rock beats Scissors, Scissors beat Paper, Paper beats Rock.",
            "Play multiple rounds to test whether you can spot patterns.",
            "The AI's choice is effectively random — pure strategy has no edge."
        ],
    },
    ReactionTest: {
        emoji: "⚡",
        desc: "Click as soon as the screen changes — measure your reaction time",
        description: "A pure reaction-time measurement tool. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Wait for the screen to change from red to green.",
            "Click (or tap) as fast as possible when the green appears.",
            "Clicking before the color change starts your reaction timer immediately.",
            "Your score is the time in milliseconds — lower is better.",
            "Click Start to begin a new round."
        ],
    },
    ResourceManager: {
        emoji: "📊",
        desc: "Manage resources efficiently — balance supply and demand",
        description: "Manage a system of resources — money, materials, or time — and balance supply against demand. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Allocate resources to different departments or projects.",
            "Balance supply and demand — too much waste, too little causes shortages.",
            "Prioritize critical needs while maintaining overall efficiency.",
            "Some resources can be converted into others — find efficient chains.",
            "Manage your budget and expand sustainably."
        ],
    },
    RhythmTap: {
        emoji: "🎵",
        desc: "Tap to the beat — test your sense of rhythm",
        description: "Musical notes fall in time with a beat and you must tap them as they reach the target line. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Tap buttons or keys when falling notes reach the bottom target line.",
            "Perfect timing gives bonus points and builds your combo.",
            "Miss too many notes and your combo resets.",
            "The beat speeds up at higher difficulty levels.",
            "Listen for the rhythm — audio cues help anticipate the beat."
        ],
    },
    RocketLaunch: {
        emoji: "🚀",
        desc: "Time your launch perfectly for maximum altitude",
        description: "A rocket sits on the launch pad — hold the launch button until the perfect moment and release. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Hold the launch button to build thrust.",
            "Release at the moment of peak thrust for maximum lift-off.",
            "The fuel burns as you hold — manage your burn time.",
            "Watch the thrust gauge and release at the optimal point.",
            "The rocket's altitude is determined by your launch timing."
        ],
    },
    RoomEscape: {
        emoji: "🔑",
        desc: "Solve puzzles to escape the locked room",
        description: "Explore a room, find hidden objects, and solve puzzles to escape. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Click on objects to examine or collect them.",
            "Some items can be combined to create new tools.",
            "Solve puzzles using the items and clues you've found.",
            "Explore every part of the room — hidden compartments contain clues.",
            "Follow the puzzle chain to find the key and escape."
        ],
    },
    RopeCut: {
        emoji: "✂️",
        desc: "Cut the rope to drop the ball onto the target",
        description: "A physics puzzle-reflex hybrid: ropes hold a ball above a target, and you must cut the ropes in the right order so gravity and physics do the rest. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Cut ropes by clicking or tapping on them.",
            "Each rope cut releases the ball, which falls under gravity.",
            "Plan your cuts so the ball bounces or drops onto the star target.",
            "Watch for multiple balls — they may need to reach separate targets.",
            "Physics-based: account for bouncing and momentum."
        ],
    },
    Roulette: {
        emoji: "🎰",
        desc: "Spin the wheel and bet on the outcome",
        description: "A classic casino wheel with numbered and colored pockets — bet on where the ball will land. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Place your chips on the betting area — single numbers, colors, or ranges.",
            "Single numbers pay the most, colors (red/black) pay 1:1.",
            "Spin the wheel and watch the ball settle.",
            "If the ball lands on your bet, you win according to the odds.",
            "Manage your bankroll — don't bet everything on one spin."
        ],
    },
    RubiksCube2x2: {
        emoji: "🧊",
        desc: "Solve the 2x2 Rubik's cube — smaller, faster, surprisingly tricky",
        description: "The 2x2 Rubik's Cube (also called the Pocket Cube) has four small cubes per face instead of nine. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Click a face or arrow button to rotate a face of the cube.",
            "Goal: each face shows only one color.",
            "Hold and drag to rotate the entire cube to see all faces.",
            "The 2x2 has fewer pieces — the solution is shorter than a 3x3.",
            "Try the layer-by-layer method: solve one face, then the opposite."
        ],
    },
    NonsenseQuiz: {
        emoji: "🤪",
        desc: "Answer silly riddle-style quiz questions — wordplay and puns",
        description: "Nonsense Quiz is a light wordplay quiz: each round asks a silly riddle and you pick the funniest correct answer from four options. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Read the nonsense question and the four answer options.",
            "Pick the answer that fits the pun or wordplay — it is often the most literal one.",
            "You have six questions per round; correct answers light up green.",
            "Answer quickly — the game auto-advances after each choice.",
            "Aim for a perfect score of 6/6."
        ],
    },
    ScratchCard: {
        emoji: "🎫",
        desc: "Scratch to reveal your prize — instant win game",
        description: "A virtual scratch card: coins or symbols are hidden beneath a scratchable surface. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Click and drag across the scratch card surface to reveal hidden symbols.",
            "Match the required combination of symbols to win.",
            "Each card shows the prize value for different matching combinations.",
            "Reveal all areas or click 'Auto-scratch' to finish quickly.",
            "Buy another card or try a different card type to keep playing."
        ],
    },
    SequenceComplete: {
        emoji: "🔗",
        desc: "Complete the number or shape sequence",
        description: "An incomplete sequence is shown — figures, numbers, or shapes with a missing element at the end. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Analyze the sequence to find the governing rule.",
            "The rule could be arithmetic, geometric, positional, or shape-based.",
            "Select the option that correctly completes the sequence.",
            "Some sequences combine two or more pattern types.",
            "Work step by step — identify what's changing and how."
        ],
    },
    ShadowMatch: {
        emoji: "🌑",
        desc: "Match objects to their correct shadow outlines",
        description: "Objects are shown in color and their shadow silhouettes are displayed below. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Look at the colored objects displayed at the top.",
            "Identify each object's unique silhouette shape.",
            "Drag or click to match each object to its shadow below.",
            "Some objects may have very similar shadow shapes — look closely.",
            "Complete all matches to advance to the next level with more objects."
        ],
    },
    ShootingGallery: {
        emoji: "🔫",
        desc: "Shoot targets at the fairground gallery — hit them all",
        description: "A carnival shooting gallery: targets pop up at various ranges and speeds, and you must shoot them with precision. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Aim with your cursor and click to shoot.",
            "Hit targets to score points — accuracy matters since ammo is limited.",
            "Moving targets are worth more points but are harder to hit.",
            "Watch the target's position and timing your shot carefully.",
            "Reload when prompted to replenish your ammo."
        ],
    },
    SimonSays: {
        emoji: "🎵",
        desc: "Watch and repeat the color sequence — how far can you go?",
        description: "Simon flashes a sequence of colored lights in increasing length, and you must repeat the exact sequence by clicking the colors in order. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Watch the color sequence that Simon plays.",
            "Repeat the sequence exactly in the same order.",
            "The sequence grows longer by one each round — memorize quickly.",
            "Speed of input matters in some modes — click at the right pace.",
            "Your high score is the longest sequence you successfully repeated."
        ],
    },
    SkiSlalom: {
        emoji: "⛷️",
        desc: "Ski through the gates — speed and precision",
        description: "Shene down a slalom course, weaving through gates left and right. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Use left/right arrows to steer through the gates.",
            "Pass through every gate — missing one adds a time penalty.",
            "The faster you go, the higher your score, but mistakes cost more.",
            "Anticipate upcoming gates — start turning before you're at the gate.",
            "Balance speed and accuracy — the best run has no misses and high speed."
        ],
    },
    SlidePuzzle: {
        emoji: "🧩",
        desc: "Classic 15-puzzle — arrange numbered tiles in order",
        description: "A 4x4 grid holds 15 numbered tiles in scrambled order with one empty space. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Click or tap a tile adjacent to the empty space to slide it.",
            "Only tiles that can physically slide into the gap can move.",
            "Arrange all tiles 1-15 in order, left to right, top to bottom.",
            "The empty space should end in the bottom-right corner.",
            "Think in terms of tile groups rather than individual moves."
        ],
    },
    SlotMachine: {
        emoji: "🎰",
        desc: "Line up matching symbols on the slot reels",
        description: "Slot machines feature spinning reels with various symbols — line up three matching symbols across the payline to win. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Set your bet amount before spinning.",
            "Pull the lever or click Spin to start the reels.",
            "Line up matching symbols on the payline to win.",
            "Higher-value symbols pay more but appear less frequently.",
            "Some machines have bonus rounds triggered by special symbols."
        ],
    },
    Snake: {
        emoji: "🐍",
        desc: "Classic arcade — eat food, grow longer, don't hit yourself",
        description: "Snake is one of the most iconic arcade games ever made. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Use arrow keys (or the virtual D-pad on mobile) to steer the snake.",
            "Eat the green food pellets to grow longer — each one adds one segment.",
            "Avoid hitting the walls and your own body — one collision ends the game.",
            "Plan your route early: the longer you get, the fewer gaps there are to maneuver.",
            "Aim for the center of the board early on to keep escape routes open."
        ],
    },
    SoccerPK: {
        emoji: "⚽",
        desc: "Penalty kick — beat the goalkeeper from 12 yards",
        description: "A penalty kick from 12 yards: pick your spot and power to beat the goalkeeper. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Aim by choosing where on the goal to shoot.",
            "Set your power — harder shots are faster but less accurate.",
            "Place shots in the corners for the highest success rate.",
            "The goalkeeper dives based on your aim — try to fake them out.",
            "Feinting and placement beat raw power every time."
        ],
    },
    Sokoban: {
        emoji: "📦",
        desc: "Push boxes onto target squares — plan your moves",
        description: "A warehouse puzzle: push boxes onto marked target locations using a warehouse worker. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Push boxes by walking into them — you can only push, not pull.",
            "Push each box onto a target square (usually marked with an X).",
            "You can only push one box at a time.",
            "Avoid pushing boxes into corners where they can't be retrieved.",
            "Plan your route — pushing a box wrong can trap it permanently."
        ],
    },
    SpaceInvader: {
        emoji: "👾",
        desc: "Shoot descending aliens before they reach you",
        description: "Classic space shooter: alien invaders descend row by row, picking up speed as their numbers dwindle. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Use left/right arrows to move your laser cannon.",
            "Press Space to fire — you can only have one shot on screen at a time.",
            "Shoot the aliens before they descend to the bottom of the screen.",
            "Watch their movement pattern — they reverse direction and speed up as fewer remain.",
            "Some aliens may drop toward you — stay alert."
        ],
    },
    SpeedCard: {
        emoji: "⚡",
        desc: "Be the first to play when your card matches the center pile",
        description: "A center pile card is face-up, and each player has a hand of cards. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Watch the center pile card and your hand simultaneously.",
            "Play a card if it matches the center pile's suit or rank.",
            "Be the first to play — speed is critical.",
            "Wrong cards or late plays may incur penalties.",
            "Empty your hand first to win the round."
        ],
    },
    SpeedClick: {
        emoji: "🖱️",
        desc: "Click as many times as possible before time runs out",
        description: "Race against the clock: you have a limited time window (usually 10 seconds) to click as many times as possible. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Click or tap the button as rapidly as possible.",
            "The timer counts down — work fast.",
            "Both mouse clicks and screen taps count.",
            "Try to maintain a consistent high speed throughout — don't burn out early.",
            "Experiment with one-finger vs two-finger tapping to find your fastest technique."
        ],
    },
    SpotDifference: {
        emoji: "🔍",
        desc: "Find the differences between two nearly identical images",
        description: "Two images appear side by side — they look identical but have subtle differences. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Study both images carefully and compare them.",
            "Click on a spot where you see a difference.",
            "Common differences: missing objects, color changes, size differences, position shifts.",
            "Find all differences to complete the puzzle.",
            "Some differences are very subtle — look at every detail."
        ],
    },
    SpriteAnimator: {
        emoji: "🎞️",
        desc: "Create frame-by-frame sprite animations",
        description: "A pixel art canvas where you draw multiple frames, and the frames play back as an animation loop. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Draw on the canvas for frame 1.",
            "Use the frame navigation to advance to the next frame.",
            "Make small changes between frames — animation comes from subtle shifts.",
            "Play back the animation to see your creation in motion.",
            "Export your animation as a looping GIF or sprite sheet."
        ],
    },
    StockSim: {
        emoji: "📈",
        desc: "Buy low, sell high — time the market",
        description: "A simulated stock market with fluctuating prices. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Buy shares of companies at low prices.",
            "Sell when prices rise to lock in profits.",
            "Watch for market trends and patterns in price movements.",
            "Diversify across multiple companies to spread risk.",
            "Set stop-loss orders to automatically sell if prices drop sharply."
        ],
    },
    StrategyRPG: {
        emoji: "⚔️",
        desc: "Turn-based combat with character growth",
        description: "A turn-based RPG battle: manage a party of characters with different abilities, stats, and classes. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Move your characters on the battle grid.",
            "Use skills and attacks — each character has unique abilities.",
            "Position matters — attack from the side or rear for bonus damage.",
            "Defeat all enemies to win the battle.",
            "Earn XP to level up and improve your characters."
        ],
    },
    StroopTest: {
        emoji: "🧪",
        desc: "Name the ink color, not the word — cognitive challenge",
        description: "The Stroop effect in game form: a color word (e. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Read the word on screen, then name the ink COLOR it is printed in.",
            "Ignore the word itself — your task is to name the color.",
            "The word and color are deliberately mismatched — that's the challenge.",
            "Answer as quickly and accurately as possible.",
            "Difficulty increases with faster-paced rounds."
        ],
    },
    SymmetryDraw: {
        emoji: "🦋",
        desc: "Draw symmetric patterns — art meets geometry",
        description: "You draw on only one half of a canvas, and your strokes are mirrored in real time to create a perfectly symmetrical design on the other side. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Draw on one side of the canvas — the other side mirrors your strokes.",
            "Use different colors and brush sizes for variety.",
            "Start from the center line and work outward for best results.",
            "Clear the canvas and start fresh whenever you like.",
            "Try different colors for different moods — flowers, butterflies, abstract art."
        ],
    },
    TerritoryWar: {
        emoji: "🌍",
        desc: "Conquer territory — expand your control across the map",
        description: "A territory control game: expand your domain by claiming adjacent cells or regions. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Claim cells or regions to expand your territory.",
            "Adjacent claims can connect to form larger regions.",
            "Defend your territory from AI opponents trying to take it.",
            "Balance expansion (more territory) with consolidation (stronger holdings).",
            "Control the most territory by the end to win."
        ],
    },
    TileMatch: {
        emoji: "🀄",
        desc: "Match identical tiles — find all the pairs",
        description: "A grid of face-down tiles contains matching pairs. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Click a tile to flip it face-up.",
            "Click another tile — if it matches, both stay open.",
            "If it doesn't match, both tiles flip back over.",
            "Memorize the positions of revealed tiles to plan your next clicks.",
            "Clear all pairs to complete the puzzle."
        ],
    },
    TileMosaic: {
        emoji: "🪺",
        desc: "Arrange colored tiles into mosaic patterns",
        description: "Colored tiles must be placed into a grid to recreate a target mosaic pattern. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Study the target mosaic pattern.",
            "Drag tiles from the palette into the grid positions.",
            "Each tile has a specific color and goes in a specific grid cell.",
            "Match the pattern exactly — position and color both matter.",
            "Some puzzles have symmetrical patterns that can help you work faster."
        ],
    },
    TimingTap: {
        emoji: "⏱️",
        desc: "Tap at exactly the right moment — precision timing game",
        description: "A precision timing challenge: a moving indicator passes through a target zone and you must tap at the precise moment it aligns. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Watch the indicator move back and forth or around a dial.",
            "Tap when the indicator is precisely in the target zone.",
            "The closer to the center of the target, the more points you score.",
            "Timing windows get smaller as levels increase.",
            "Stay relaxed and watch the rhythm — don't anticipate, react."
        ],
    },
    TowerDefense: {
        emoji: "🏰",
        desc: "Place towers strategically to stop waves of enemies",
        description: "Enemies march along a path toward your base, and you must place defensive towers to stop them. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Place towers on the map — each has a cost in gold.",
            "Enemies follow the path — towers auto-attack enemies in range.",
            "Earn gold for each enemy killed.",
            "Different tower types are effective against different enemy types.",
            "Upgrade towers between waves for more power."
        ],
    },
    TradeSim: {
        emoji: "💹",
        desc: "Buy and sell goods across markets for profit",
        description: "A trading simulation: buy goods at low prices in one market, transport them to another, and sell for a profit. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Buy goods at a low price in one market.",
            "Transport goods to another market where prices are higher.",
            "Account for transport costs in your profit calculation.",
            "Watch market prices — they change over time.",
            "Build a network of trade routes for steady profits."
        ],
    },
    TreasureDig: {
        emoji: "⛏️",
        desc: "Dig for treasure — how deep will you go?",
        description: "A plot of land is divided into dig sites — some contain buried treasure, others contain worthless junk. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Study the clues or hints about where the treasure is buried.",
            "Click on a plot of land to dig there.",
            "If you hit treasure, you win that site's prize.",
            "Each site can only be dug once — choose carefully.",
            "Dig all sites to find all treasures (and junk) on the map."
        ],
    },
    TreasureMap: {
        emoji: "🗺️",
        desc: "Follow clues to find the hidden treasure",
        description: "A treasure map is displayed with cryptic clues and visual hints — use them to deduce the treasure's location. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Study the map and read the written clues carefully.",
            "Use visual elements (compass, landmarks, dotted lines) as hints.",
            "Deduce the treasure's location from all the clues combined.",
            "Click or tap on the map where you think the treasure is buried.",
            "Correct location = treasure found! Wrong location = try again."
        ],
    },
    TripleTriad: {
        emoji: "🃏",
        desc: "Card territory control — dominate the board with your cards",
        description: "A card battle game from the Final Fantasy series: place cards on a 3x3 grid. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Place your cards on the 3x3 grid, one per turn.",
            "Adjacent cards battle on shared edges — the higher number wins.",
            "Winning a battle flips the opponent's card to your side.",
            "Control the most cards when all nine spaces are filled to win.",
            "Strategic placement and card value order matter — some rules trigger card swaps."
        ],
    },
    TypingWarrior: {
        emoji: "⌨️",
        desc: "Type words fast to defeat your opponents",
        description: "Words appear on screen and you must type them exactly as shown to attack your opponent. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Type the word shown exactly as it appears — no typos allowed.",
            "Correctly typed words deal damage to your opponent.",
            "Faster typing means faster attacks and more damage over time.",
            "Some words are longer and worth more points.",
            "Your opponent attacks back — type fast to stay ahead."
        ],
    },
    UnitConvert: {
        emoji: "📏",
        desc: "Convert between units of measurement — length, weight, and more",
        description: "A quantity in one unit is shown — convert it to the target unit. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Identify the starting unit and target unit.",
            "Apply the correct conversion factor.",
            "Common conversions: meters↔feet, kg↔lb, liters↔gallons, °C↔°F.",
            "For °F: (°C × 9/5) + 32. For °C: (°F − 32) × 5/9.",
            "Check your calculation before submitting — one error and it's wrong."
        ],
    },
    WarCard: {
        emoji: "⚔️",
        desc: "Higher card wins — classic War card game",
        description: "The deck is split evenly between two players. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Each player reveals the top card — higher card wins both.",
            "Aces are high — 2 is lowest, Ace is highest.",
            "In a tie (War), place three cards face-down and reveal the fourth.",
            "The winner of the War reveal takes all stacked cards.",
            "Game ends when one player has all the cards."
        ],
    },
    WhackAMole: {
        emoji: "🔨",
        desc: "Hit moles as they pop up — how fast are your reflexes?",
        description: "Moles pop out of holes at random, and you must whack them before they disappear. Free, no ads, no login — play instantly on Bytecade Games.",
        howToPlay: [
            "Click or tap on moles as soon as they appear from their holes.",
            "Moles only stay visible for a short time — react quickly.",
            "Missing a mole or clicking an empty hole may cost you a life.",
            "The game speeds up as your score increases.",
            "Watch for patterns — moles occasionally appear in the same hole consecutively."
        ],
    }
};

export const CATEGORY_META = {
    arcade:   { emoji: "🕹", label: "Arcade",   tint: "129,140,248" },
    reflex:   { emoji: "⚡", label: "Reflex",   tint: "250,204,21"  },
    word:     { emoji: "🔤", label: "Word",     tint: "52,211,153"  },
    brain:    { emoji: "🧠", label: "Brain",    tint: "244,114,182" },
    creative: { emoji: "🎨", label: "Creative", tint: "251,146,60"  },
    luck:     { emoji: "🍀", label: "Luck",     tint: "74,222,128"  },
    puzzle:   { emoji: "🧩", label: "Puzzle",   tint: "34,211,238"  },
    sports:   { emoji: "🏃", label: "Sports",   tint: "248,113,113" },
    strategy: { emoji: "⚔", label: "Strategy",  tint: "167,139,250" },
    cards:    { emoji: "🃏", label: "Cards",    tint: "96,165,250"  },
};

export const CATEGORIES = [
    { key: "all",      label: "All" },
    { key: "arcade",   label: "🕹 Arcade" },
    { key: "reflex",   label: "⚡ Reflex" },
    { key: "word",     label: "🔤 Word" },
    { key: "brain",    label: "🧠 Brain" },
    { key: "creative", label: "🎨 Creative" },
    { key: "luck",     label: "🍀 Luck" },
    { key: "puzzle",   label: "🧩 Puzzle" },
    { key: "sports",   label: "🏃 Sports" },
    { key: "strategy", label: "⚔ Strategy" },
    { key: "cards",    label: "🃏 Cards" },
];

/* path → category mapping (kept in sync with `games` object) */
export const catOf = (name) => {
    for (const [cat, paths] of Object.entries({
        arcade:   "Snake,MiniTetris,MiniPacman,Breakout,FlappyJelly,PingPong,SpaceInvader,Frogger,Asteroids,JumpRunner,Galaga,DigDug,Bomberman,DonkeyKong",
        reflex:   "WhackAMole,ReactionTest,SpeedClick,AimTrainer,FruitSlice,TimingTap,RhythmTap,ColorSwitch,ArrowDodge,BubblePop,ShootingGallery,RopeCut,StroopTest,BombDefuse",
        word:     "TypingWarrior,NonsenseQuiz,CipherDecode,DrawAndGuess",

        brain:    "MathChallenge,NBack,SimonSays,PatternRecognition,NumberMemory,BalanceScale,SequenceComplete,Game24,PrimeCheck,LogicGate,BaseConvert,UnitConvert,FractionCompare,MathBreakout",
        creative: "PixelArt,ShadowMatch,ColorMixer,DotConnect,FlagQuiz,EmojiCombo,MandalaPaint,GradientSort,JigsawPuzzle,SpotDifference,TileMosaic,SymmetryDraw,SpriteAnimator",
        luck:     "CoinFlip,DicePredict,Roulette,ScratchCard,RPS,LuckyBox,FortuneWheel,SlotMachine,BingoGame,TreasureMap,DicePoker,TreasureDig,LuckySeven,CardFortune",
        puzzle:   "Game2048,Minesweeper,MiniSudoku,SlidePuzzle,Match3,LightsOut,PipeConnect,Sokoban,TileMatch,Nonogram,HanoiTower,ColorCode,BlockStack,ColorSort,KillerSudoku,OneStroke,ColumnsPuzzle,NumberCrossword,RubiksCube2x2",
        sports:   "GolfPutt,DartGame,BasketballShoot,SoccerPK,ArcheryGame,BowlingGame,FishingGame,SkiSlalom,PingPongRally,RocketLaunch",
        strategy: "TowerDefense,ResourceManager,StockSim,FarmManager,MazeEscape,PlacementPuzzle,StrategyRPG,DeckBuilder,TerritoryWar,TradeSim,MiniWar,RoomEscape,DeliveryRoute,MerchantSim,EnergyManager",
        cards:    "Blackjack,HighLow,MemoryMatch,SpeedCard,PokerHand,WarCard,ConnectFour,Othello,MiniGomoku,DominoChain,MiniGo,ChessPuzzle,MiniCheckers,MiniSolitaire,TripleTriad",
    })) {
        if (paths.split(",").includes(name)) return cat;
    }
    return "unknown";
};

/* Resolve emoji + description for a given game name */
export const resolveMeta = (name) => {
    const direct = GAME_META[name];
    if (direct) return direct;
    const cat = catOf(name);
    const catLabel = CATEGORY_META[cat]?.label || "mini game";
    return { emoji: "🎮", desc: `Play ${name} — ${catLabel} mini game` };
};

export const slugify = (name) => name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Za-z])(\d)/g, "$1-$2")
    .toLowerCase();


export const GAME_COUNT = GAME_NAMES.length;

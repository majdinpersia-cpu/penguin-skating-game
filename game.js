const gameContainer = document.querySelector('.game-container');
const penguin = document.getElementById('penguin');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const gameOverScreen = document.getElementById('gameOver');
const finalScoreDisplay = document.getElementById('finalScore');

let penguinX = 380;
const penguinY = gameContainer.offsetHeight - 100;
const penguinWidth = 40;
const penguinHeight = 50;
const moveSpeed = 15;
const gameWidth = gameContainer.offsetWidth;
const gameHeight = gameContainer.offsetHeight;

let score = 0;
let lives = 3;
let gameActive = true;
let fish = [];
let fishId = 0;

const keys = {};

// Keyboard controls
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Update penguin position
function updatePenguin() {
    if (keys['ArrowLeft'] && penguinX > 0) {
        penguinX -= moveSpeed;
    }
    if (keys['ArrowRight'] && penguinX < gameWidth - penguinWidth) {
        penguinX += moveSpeed;
    }
    penguin.style.left = penguinX + 'px';
}

// Create fish
function createFish() {
    const fishElement = document.createElement('div');
    fishElement.className = 'fish';
    const fishX = Math.random() * (gameWidth - 30);
    const fishY = gameHeight * 0.5 + Math.random() * (gameHeight * 0.4);
    fishElement.style.left = fishX + 'px';
    fishElement.style.top = fishY + 'px';
    gameContainer.appendChild(fishElement);

    const id = fishId++;
    fish.push({
        id: id,
        element: fishElement,
        x: fishX,
        y: fishY,
        velocityX: (Math.random() - 0.5) * 4,
        velocityY: (Math.random() - 0.5) * 3
    });
}

// Update fish positions
function updateFish() {
    fish = fish.filter(f => {
        f.x += f.velocityX;
        f.y += f.velocityY;

        // Bounce off walls
        if (f.x <= 0 || f.x >= gameWidth - 30) {
            f.velocityX *= -1;
            f.x = Math.max(0, Math.min(gameWidth - 30, f.x));
        }

        if (f.y <= gameHeight * 0.5 || f.y >= gameHeight - 20) {
            f.velocityY *= -1;
            f.y = Math.max(gameHeight * 0.5, Math.min(gameHeight - 20, f.y));
        }

        f.element.style.left = f.x + 'px';
        f.element.style.top = f.y + 'px';

        // Check collision with penguin
        if (checkCollision(penguinX, penguinY, penguinWidth, penguinHeight, f.x, f.y, 30, 20)) {
            f.element.remove();
            score += 10;
            scoreDisplay.textContent = score;
            return false;
        }

        return true;
    });
}

// Collision detection
function checkCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
    return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
}

// Create snowflakes for decoration
function createSnowflakes() {
    for (let i = 0; i < 20; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.textContent = '❄';
        snowflake.style.left = Math.random() * gameWidth + 'px';
        snowflake.style.top = Math.random() * (gameHeight * 0.5) + 'px';
        snowflake.style.animation = `fall ${3 + Math.random() * 4}s linear infinite`;
        gameContainer.appendChild(snowflake);
    }
}

// Add animation for falling snowflakes
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        0% {
            transform: translateY(-20px);
            opacity: 1;
        }
        100% {
            transform: translateY(${gameHeight}px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Game loop
function gameLoop() {
    if (!gameActive) return;

    updatePenguin();
    updateFish();

    requestAnimationFrame(gameLoop);
}

// Spawn fish periodically
function spawnFish() {
    if (gameActive) {
        createFish();
        setTimeout(spawnFish, 1500 - Math.min(score * 5, 800)); // Faster as score increases
    }
}

// End game
function endGame() {
    gameActive = false;
    gameOverScreen.style.display = 'block';
    finalScoreDisplay.textContent = score;
}

// Start game
function startGame() {
    createSnowflakes();
    gameLoop();
    spawnFish();
}

startGame();
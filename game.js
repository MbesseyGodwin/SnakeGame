const gameBoard = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
const bestScoreElement = document.getElementById('best-score');
let intervalId = null;
let score = 0;
let bestScore = localStorage.getItem('bestScore') || 0;
let gamePaused = false;
let snake = [{ x: 10, y: 10 }];
let dx = 0;
let dy = 0;
let food = { x: 5, y: 5 };

export function createGrid() {
    for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 20; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            gameBoard.appendChild(cell);
        }
    }
}

export function drawSnake() {
    snake.forEach(segment => {
        const snakeElement = document.createElement('div');
        snakeElement.classList.add('snake');
        snakeElement.style.gridColumn = segment.x;
        snakeElement.style.gridRow = segment.y;
        gameBoard.appendChild(snakeElement);
    });
}

export function drawFood() {
    const foodElement = document.createElement('div');
    foodElement.classList.add('food');
    foodElement.style.gridColumn = food.x;
    foodElement.style.gridRow = food.y;
    gameBoard.appendChild(foodElement);
}

export function generateFood() {
    food.x = Math.floor(Math.random() * 20) + 1;
    food.y = Math.floor(Math.random() * 20) + 1;
}

export function checkCollision() {
    const head = snake[0];
    if (
        head.x <= 0 || head.x > 20 ||
        head.y <= 0 || head.y > 20 ||
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
    ) {
        clearInterval(intervalId);
        alert('Game Over! Your score: ' + score);
        resetGame();
    }
}

export function gameLoop() {
    if (!gamePaused) {
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(head);
        if (head.x === food.x && head.y === food.y) {
            score++;
            scoreElement.textContent = score;
            bestScore = Math.max(bestScore, score);
            bestScoreElement.textContent = bestScore;
            localStorage.setItem('bestScore', bestScore);
            generateFood();
        } else {
            snake.pop();
        }
        gameBoard.innerHTML = '';
        drawSnake();
        drawFood();
        checkCollision();
    }
}

export function startGame() {
    intervalId = setInterval(gameLoop, 150);
}

export function resetGame() {
    clearInterval(intervalId);
    score = 0;
    scoreElement.textContent = score;
    snake = [{ x: 10, y: 10 }];
    dx = 0;
    dy = 0;
    generateFood();
    startGame();
}

export function togglePause() {
    gamePaused = !gamePaused;
}

export function handleStartDelay() {
    setTimeout(startGame, 3000);
}

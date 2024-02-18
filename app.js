document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const scoreElement = document.getElementById('score');
    const bestScoreElement = document.getElementById('best-score');
    const pauseButton = document.getElementById('pause-btn');
    const restartButton = document.getElementById('restart-btn');
    const useKeyboardButton = document.getElementById('use-keyboard');
    // const useMouseButton = document.getElementById('use-mouse');
    const difficultySelect = document.getElementById('difficulty');

    const upButton = document.getElementById('up-btn');
    const downButton = document.getElementById('down-btn');
    const leftButton = document.getElementById('left-btn');
    const rightButton = document.getElementById('right-btn');

    const boardSize = 20;
    const snakeSize = 3;
    let speed = 150; // Initial speed
    const startDelay = 3000; // 3 seconds delay

    let snake = [{ x: 10, y: 10 }];
    let food = { x: 5, y: 5 };
    let dx = 0;
    let dy = 0;
    let intervalId = null;
    let score = 0;
    let bestScore = localStorage.getItem('bestScore') || 0;
    let gamePaused = false;
    let gameStarted = false;

    function createGrid() {
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                gameBoard.appendChild(cell);
            }
        }
    }

    // Add event listeners for keyboard and mouse controls
    function addControlListeners() {
        useKeyboardButton.addEventListener('click', () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.addEventListener('keydown', handleKeyDown);
        });

        // useMouseButton.addEventListener('click', () => {
        //     document.removeEventListener('keydown', handleKeyDown);
        //     document.addEventListener('mousemove', handleMouseMove);
        // });
    }

    function updateSpeed(difficulty) {
        switch (difficulty) {
            case 'easy':
                speed = 200;
                break;
            case 'medium':
                speed = 150;
                break;
            case 'hard':
                speed = 100;
                break;
        }
    }

    function updateScore() {
        score++;
        scoreElement.textContent = score;
        if (score > bestScore) {
            bestScore = score;
            bestScoreElement.textContent = bestScore;
            localStorage.setItem('bestScore', bestScore);
        }
    }

    function updateSnake() {
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(head);
        if (head.x === food.x && head.y === food.y) {
            generateFood();
            updateScore();
        } else {
            snake.pop();
        }
    }

    function drawSnake() {
        snake.forEach((segment, index) => {
            const snakeElement = document.createElement('div');
            snakeElement.classList.add('snake');
            if (index === 0) {
                snakeElement.classList.add('snake-head'); // Add snake-head class to the head element
            }
            snakeElement.style.gridColumn = segment.x;
            snakeElement.style.gridRow = segment.y;
            gameBoard.appendChild(snakeElement);
        });
    }

    function drawFood() {
        const foodElement = document.createElement('div');
        foodElement.classList.add('food');
        foodElement.style.gridColumn = food.x;
        foodElement.style.gridRow = food.y;
        gameBoard.appendChild(foodElement);
    }

    function generateFood() {
        food.x = Math.floor(Math.random() * boardSize) + 1;
        food.y = Math.floor(Math.random() * boardSize) + 1;
    }

    function checkCollision() {
        if (
            snake[0].x <= 0 || snake[0].x > boardSize ||
            snake[0].y <= 0 || snake[0].y > boardSize ||
            snake.slice(1).some(segment => segment.x === snake[0].x && segment.y === snake[0].y)
        ) {
            clearInterval(intervalId);
            alert('Game Over! Your score: ' + score);
            resetGame();
        }
    }

    function gameLoop() {
        if (!gamePaused) {
            updateSnake();
            checkCollision();
            gameBoard.innerHTML = '';
            drawSnake();
            drawFood();
        }
    }

    function startGame() {
        gameStarted = true;
        intervalId = setInterval(gameLoop, speed);
    }

    function resetGame() {
        clearInterval(intervalId);
        score = 0;
        scoreElement.textContent = score;
        snake = [{ x: 10, y: 10 }];
        dx = 0;
        dy = 0;
        generateFood();
        startGame();
    }

    function togglePause() {
        gamePaused = !gamePaused;
        pauseButton.textContent = gamePaused ? 'Play' : 'Pause';
    }

    function handleStartDelay() {
        setTimeout(startGame, startDelay);
    }

     // Event listeners for button controls
     upButton.addEventListener('click', () => {
        if (!gamePaused && dy !== 1) {
            dx = 0;
            dy = -1;
        }
    });

    downButton.addEventListener('click', () => {
        if (!gamePaused && dy !== -1) {
            dx = 0;
            dy = 1;
        }
    });

    leftButton.addEventListener('click', () => {
        if (!gamePaused && dx !== 1) {
            dx = -1;
            dy = 0;
        }
    });

    rightButton.addEventListener('click', () => {
        if (!gamePaused && dx !== -1) {
            dx = 1;
            dy = 0;
        }
    });

    // Event handler for keyboard controls
    function handleKeyDown(event) {
        switch (event.key) {
            case 'ArrowUp':
                if (!gamePaused && dy !== 1) {
                    dx = 0;
                    dy = -1;
                }
                break;
            case 'ArrowDown':
                if (!gamePaused && dy !== -1) {
                    dx = 0;
                    dy = 1;
                }
                break;
            case 'ArrowLeft':
                if (!gamePaused && dx !== 1) {
                    dx = -1;
                    dy = 0;
                }
                break;
            case 'ArrowRight':
                if (!gamePaused && dx !== -1) {
                    dx = 1;
                    dy = 0;
                }
                break;
        }
    }

    // Event handler for mouse controls
    function handleMouseMove(event) {
        const x = event.clientX;
        const y = event.clientY;
        const rect = gameBoard.getBoundingClientRect();
        const cellSize = rect.width / boardSize;
        const col = Math.floor((x - rect.left) / cellSize) + 1;
        const row = Math.floor((y - rect.top) / cellSize) + 1;

        if (!gamePaused && Math.abs(dx) !== 1) {
            dx = col - snake[0].x > 0 ? 1 : -1;
            dy = 0;
        } else if (!gamePaused && Math.abs(dy) !== 1) {
            dy = row - snake[0].y > 0 ? 1 : -1;
            dx = 0;
        }
    }

    // Event listener for difficulty selection
    difficultySelect.addEventListener('change', (event) => {
        updateSpeed(event.target.value);
    });

    createGrid();
    addControlListeners(); // Add control listeners for keyboard and mouse
    drawSnake();
    drawFood();
    handleStartDelay();

    pauseButton.addEventListener('click', togglePause);
    restartButton.addEventListener('click', resetGame);

    document.addEventListener('keydown', handleKeyDown);
});

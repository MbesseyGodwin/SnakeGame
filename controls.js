// control.js
document.addEventListener('DOMContentLoaded', () => {
    const useKeyboardButton = document.getElementById('use-keyboard');
    const useMouseButton = document.getElementById('use-mouse');

    useKeyboardButton.addEventListener('click', () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.addEventListener('keydown', handleKeyDown);
    });

    useMouseButton.addEventListener('click', () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.addEventListener('mousemove', handleMouseMove);
    });
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

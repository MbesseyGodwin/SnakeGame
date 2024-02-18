let speed = 150; // Initial speed

document.getElementById('difficulty').addEventListener('change', (event) => {
    switch (event.target.value) {
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
});

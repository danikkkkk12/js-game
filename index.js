const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 30,
    width: 80,
    height: 10,
    color: '#4CAF50',
    speed: 10,
    dx: 0
};

const ai = {
    x: canvas.width / 2 - 40,
    y: 20,
    width: 80,
    height: 10,
    color: '#FF5733',
    speed: 4,
    dx: 0
};

const puck = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 10,
    color: '#FFF',
    dx: 4 * (Math.random() < 0.5 ? 1 : -1),
    dy: 4 * (Math.random() < 0.5 ? 1 : -1)
};

// Draw elements
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawPuck() {
    ctx.beginPath();
    ctx.arc(puck.x, puck.y, puck.size, 0, Math.PI * 2);
    ctx.fillStyle = puck.color;
    ctx.fill();
    ctx.closePath();
}

// Move puck and handle collisions
function movePuck() {
    puck.x += puck.dx;
    puck.y += puck.dy;

    // Wall collisions
    if (puck.x + puck.size > canvas.width || puck.x - puck.size < 0) {
        puck.dx *= -1;
    }

    if (puck.y - puck.size < 0 || puck.y + puck.size > canvas.height) {
        puck.dy *= -1;
    }

    // Player collision
    if (puck.x > player.x && puck.x < player.x + player.width && puck.y + puck.size > player.y) {
        puck.dy *= -1;
        puck.y = player.y - puck.size;
    }

    // AI collision
    if (puck.x > ai.x && puck.x < ai.x + ai.width && puck.y - puck.size < ai.y + ai.height) {
        puck.dy *= -1;
        puck.y = ai.y + ai.height + puck.size;
    }
}

// Move player
function movePlayer() {
    player.x += player.dx;

    // Wall boundary
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

// Move AI (simple AI with delays and "human-like" mistakes)
function moveAI() {
    const errorMargin = Math.random() < 0.2 ? 30 : 0; // AI sometimes moves a bit off target
    const inertia = Math.random() < 0.1 ? 0 : ai.speed; // Small chance AI delays movement

    if (puck.x < ai.x + ai.width / 2 - errorMargin) {
        ai.x -= inertia;
    } else if (puck.x > ai.x + ai.width / 2 + errorMargin) {
        ai.x += inertia;
    }

    // Wall boundary for AI
    if (ai.x < 0) ai.x = 0;
    if (ai.x + ai.width > canvas.width) ai.x = canvas.width - ai.width;
}

// Update game state
function update() {
    movePlayer();
    movePuck();
    moveAI();
}

// Clear canvas
function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Game loop
function gameLoop() {
    clear();
    drawRect(player.x, player.y, player.width, player.height, player.color);
    drawRect(ai.x, ai.y, ai.width, ai.height, ai.color);
    drawPuck();
    update();
    requestAnimationFrame(gameLoop);
}

// Key handlers
function keyDown(e) {
    if (e.key === 'ArrowRight' || e.key === 'd') {
        player.dx = player.speed;
    } else if (e.key === 'ArrowLeft' || e.key === 'a') {
        player.dx = -player.speed;
    }
}

function keyUp(e) {
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'ArrowLeft' || e.key === 'a') {
        player.dx = 0;
    }
}

// Event listeners
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

// Start game
gameLoop();
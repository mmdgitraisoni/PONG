const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Paddle settings
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 80;
const PADDLE_MARGIN = 18;

// Ball settings
const BALL_SIZE = 14;

// Game objects
let leftPaddle = {
    x: PADDLE_MARGIN,
    y: HEIGHT/2 - PADDLE_HEIGHT/2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0
};

let rightPaddle = {
    x: WIDTH - PADDLE_MARGIN - PADDLE_WIDTH,
    y: HEIGHT/2 - PADDLE_HEIGHT/2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0
};

let ball = {
    x: WIDTH/2 - BALL_SIZE/2,
    y: HEIGHT/2 - BALL_SIZE/2,
    size: BALL_SIZE,
    dx: Math.random() > 0.5 ? 4 : -4,
    dy: (Math.random() - 0.5) * 6
};

let leftScore = 0;
let rightScore = 0;

function resetBall() {
    ball.x = WIDTH/2 - BALL_SIZE/2;
    ball.y = HEIGHT/2 - BALL_SIZE/2;
    ball.dx = Math.random() > 0.5 ? 4 : -4;
    ball.dy = (Math.random() - 0.5) * 6;
}

canvas.addEventListener('mousemove', function(e) {
    // Get mouse position relative to canvas
    const rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    // Center paddle on mouse
    leftPaddle.y = mouseY - leftPaddle.height/2;
    // Clamp within boundaries
    if (leftPaddle.y < 0) leftPaddle.y = 0;
    if (leftPaddle.y + leftPaddle.height > HEIGHT)
        leftPaddle.y = HEIGHT - leftPaddle.height;
});

function drawRect(x, y, w, h, color='#fff') {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color='#fff') {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2);
    ctx.closePath();
    ctx.fill();
}

function drawText(text, x, y, color='#fff') {
    ctx.fillStyle = color;
    ctx.font = '32px Arial';
    ctx.fillText(text, x, y);
}

function drawNet() {
    ctx.strokeStyle = '#888';
    ctx.setLineDash([10, 16]);
    ctx.beginPath();
    ctx.moveTo(WIDTH/2, 0);
    ctx.lineTo(WIDTH/2, HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);
}

function render() {
    // Clear
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    // Net
    drawNet();
    // Paddles
    drawRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
    drawRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);
    // Ball
    drawRect(ball.x, ball.y, ball.size, ball.size);
    // Scores
    drawText(leftScore, WIDTH/2 - 64, 48);
    drawText(rightScore, WIDTH/2 + 32, 48);
}

function update() {
    // Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Top/bottom wall collision
    if (ball.y <= 0) {
        ball.y = 0;
        ball.dy *= -1;
    }
    if (ball.y + ball.size >= HEIGHT) {
        ball.y = HEIGHT - ball.size;
        ball.dy *= -1;
    }

    // Left paddle collision
    if (ball.x <= leftPaddle.x + leftPaddle.width &&
        ball.y + ball.size >= leftPaddle.y &&
        ball.y <= leftPaddle.y + leftPaddle.height) {
        
        ball.x = leftPaddle.x + leftPaddle.width;
        ball.dx *= -1.07; // Increase speed slightly
        // Change angle based on where ball hits
        let collidePoint = (ball.y + ball.size/2) - (leftPaddle.y + leftPaddle.height/2);
        collidePoint = collidePoint / (leftPaddle.height/2);
        ball.dy = collidePoint * 5;
    }

    // Right paddle collision
    if (ball.x + ball.size >= rightPaddle.x &&
        ball.y + ball.size >= rightPaddle.y &&
        ball.y <= rightPaddle.y + rightPaddle.height) {
        
        ball.x = rightPaddle.x - ball.size;
        ball.dx *= -1.07; // Increase speed slightly
        // Change angle based on where ball hits
        let collidePoint = (ball.y + ball.size/2) - (rightPaddle.y + rightPaddle.height/2);
        collidePoint = collidePoint / (rightPaddle.height/2);
        ball.dy = collidePoint * 5;
    }

    // AI paddle movement (basic)
    let target = ball.y + ball.size/2 - rightPaddle.height/2;
    let aiSpeed = 4.4;
    if (rightPaddle.y < target) {
        rightPaddle.y += aiSpeed;
        if (rightPaddle.y > target) rightPaddle.y = target;
    } else if (rightPaddle.y > target) {
        rightPaddle.y -= aiSpeed;
        if (rightPaddle.y < target) rightPaddle.y = target;
    }
    // Clamp AI paddle
    if (rightPaddle.y < 0) rightPaddle.y = 0;
    if (rightPaddle.y + rightPaddle.height > HEIGHT)
        rightPaddle.y = HEIGHT - rightPaddle.height;

    // Score
    if (ball.x < 0) {
        rightScore++;
        resetBall();
    }
    if (ball.x + ball.size > WIDTH) {
        leftScore++;
        resetBall();
    }
}

function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

gameLoop();

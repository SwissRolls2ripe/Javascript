// @charset "utf-8";

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const pauseButton = document.getElementById('pauseButton');
const eatSound = new Audio('eat.mp3');
const failedSound = new Audio('failed.mp3');
const backgroundMusic = new Audio('background.mp3');
let isPaused = false;

let highScore = parseInt(localStorage.getItem('snakeHighScore')) || 0;
highScoreElement.textContent = highScore;

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake;
let food;
let dx = 0;
let dy = 0;
let score = 0;
pauseButton.textContent = '暂停游戏（Space）';
canvas.tabIndex = 1; // 使 canvas 可以获得焦点
canvas.focus(); // 初始时让 canvas 获得焦点
backgroundMusic.loop = true; // 设置背景音乐循环播放

// 主函数，循环调用控制蛇移动
function drawGame() {
    if (isPaused) {
        // 在暂停时仍然绘制当前画面
        drawInitialScreen();
        
        // 绘制暂停文字
        ctx.fillStyle = 'black';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('游戏已暂停', canvas.width/2, canvas.height/2);

        setTimeout(drawGame, 100);
        return;
    }
    
    // 移动蛇
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    // 检查是否吃到食物
    if (head.x === food.x && head.y === food.y) {
        eatSound.currentTime = 0;
        eatSound.play();
        score += 10;
        scoreElement.textContent = score;
        // 更新最高分
        if (score > highScore) {
            highScore = score;
            highScoreElement.textContent = highScore;
            localStorage.setItem('snakeHighScore', highScore);
        }
        if (snake.length >= tileCount * tileCount) {
            // 游戏胜利或地图已满，无需再生成食物
            win();
            return;
        }
        food = generateFood();
    } else {
        snake.pop();
    }

    // 检查游戏结束条件
    if (gameOver()) {
        return; // 直接返回，不再显示额外的弹窗
    }

    drawInitialScreen();
    setTimeout(drawGame, 100);
}

// 游戏结束判断
function gameOver() {
    // 撞墙
    if (snake[0].x < 0 || snake[0].x >= tileCount || 
        snake[0].y < 0 || snake[0].y >= tileCount) {
        handleGameOver();
        return true;
    }

    // 撞到自己
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            handleGameOver();
            return true;
        }
    }

    return false;
}

// 游戏结束弹窗与重新开始
function handleGameOver() {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    failedSound.play();
    
    alert('游戏结束！得分：' + score);
    resetGame();
    drawGame();
    backgroundMusic.play();
}

// 游戏胜利或地图已满
function win() {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    
    alert('游戏胜利！得分：' + score);
    resetGame();
    drawGame();
    backgroundMusic.play();
}

// 重置游戏
function resetGame() {
    dx = 0;
    dy = 0;
    score = 0;
    scoreElement.textContent = score;
    generateElement();
}

// 生成蛇和食物
function generateElement() {
    const randomX = Math.floor(Math.random() * tileCount);
    const randomY = Math.floor(Math.random() * tileCount);
    snake = [{ x: randomX, y: randomY }];
    
    do {
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
    } while (food.x === snake[0].x && food.y === snake[0].y);
}

// 生成食物
function generateFood() {
    let newFood;
    let isOnSnake;

    do {
        isOnSnake = false;

        newFood = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };

        // 检查新生成的位置是否和蛇身体任何一节重合
        for (let i = 0; i < snake.length; i++) {
            if (snake[i].x === newFood.x && snake[i].y === newFood.y) {
                isOnSnake = true;
                break;
            }
        }

    } while (isOnSnake);

    return newFood;
}

// 初始化画布、蛇、食物
function drawInitialScreen() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制食物
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);

    // 绘制蛇
    ctx.fillStyle = 'green';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });
}

// 暂停与继续
function togglePause() {
    isPaused = !isPaused;
    pauseButton.textContent = isPaused ? '继续游戏（Space）' : '暂停游戏（Space）';
    if (isPaused) {
        backgroundMusic.pause();
    } else {
        backgroundMusic.play();
    }
    // 防止按钮点击后失去焦点
    canvas.focus();
}

// 按键判断
function changeDirection(event) {
    const key = event.code;

    // 空格键：控制暂停
    if (key === 'Space') {
        togglePause();
        return;
    }

    // 只允许在非暂停状态下控制方向
    if (isPaused) return;

    // 只处理方向键（ArrowLeft、ArrowRight、ArrowUp、ArrowDown）
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(key)) {
        return;
    }

    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;

    if (key === 'ArrowLeft' && !goingRight) {
        dx = -1;
        dy = 0;
    }
    if (key === 'ArrowUp' && !goingDown) {
        dx = 0;
        dy = -1;
    }
    if (key === 'ArrowRight' && !goingLeft) {
        dx = 1;
        dy = 0;
    }
    if (key === 'ArrowDown' && !goingUp) {
        dx = 0;
        dy = 1;
    }
}

// 开始游戏
function startGame(e) {
    const key = e.code;
    // 只处理方向键（ArrowLeft、ArrowRight、ArrowUp、ArrowDown）
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(key)) {
        return;
    }
    backgroundMusic.play();
    document.removeEventListener('keydown', startGame);
    document.addEventListener('keydown', changeDirection);
    
    // 立即处理当前方向按键
    changeDirection(e);
}

document.addEventListener('keydown', startGame);
pauseButton.addEventListener('click', togglePause);

generateElement();
drawInitialScreen();
drawGame();

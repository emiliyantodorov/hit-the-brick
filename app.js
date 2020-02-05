// remove event listener

const btnStart = document.querySelector(".btn-start");
const gameBoard = document.querySelector(".section-game-board");
const ball = document.querySelector(".ball");
const paddle = document.querySelector(".paddle");
const livesEl = document.querySelector(".lives");
const sectionGameOver = document.querySelector(".section-game-over");
const leftPad = document.querySelector(".arrow--left");
const rightPad = document.querySelector(".arrow--right");

let isGameRunning = false;
let isTheBallMoving = false;
let ballDirection = {
    x: 5,
    y: 5
};
let animationRepeat = null;

// //////////////////////////////////////
//////////////////////////////////////
function isTouched(a, b) {
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();

    if (aRect.right > bRect.left && aRect.left < bRect.right &&
        aRect.bottom > bRect.top && aRect.top < bRect.bottom) {
        return true;
    }

    return false;
}

function gameOver() {
    sectionGameOver.style.display = "flex";
    livesEl.dataset.lives = "3";
    livesEl.innerHTML = "3";
    ball.style.display = "none";
    isTheBallMoving = false;
    isGameRunning = false;
    cancelAnimationFrame(animationRepeat);
}

function liveDown() {
    return +livesEl.dataset.lives - 1;
}

function createBrick() {
    const newBrick = document.createElement("div");

    newBrick.setAttribute("class", "brick");

    return newBrick;
}

function createBricksWall(rowLength) {
    let fullBrickSpace = 90;
    const neededBricks = Math.floor(gameBoard.offsetWidth / fullBrickSpace);

    const moreSpace = (gameBoard.offsetWidth - (neededBricks * 90) + 10) / 2;

    for (let row = 0; row < rowLength; row++) {
        for (let col = 0; col < neededBricks; col++) {
            const newBrick = createBrick();
            newBrick.style.left = `${90 * col}px`;
            newBrick.style.top = `${40 * row}px`;

            gameBoard.appendChild(newBrick);
        }
    }

    document.querySelectorAll(".brick").forEach(brick => {
        brick.style.marginLeft = `${moreSpace}px`;
    });
}

function isBallHitBrick(allBricks) {
    return allBricks.find(brick => isTouched(ball, brick) === true)
}

function moveTheBall() {
    let curBallDirX = ball.offsetLeft;
    let curBallDirY = ball.offsetTop;

    if (curBallDirY > paddle.offsetTop) {
        isTheBallMoving = false;
        let tempLives = liveDown();
        if (tempLives === 0) {
            return gameOver();
        }
        livesEl.dataset.lives = tempLives;
        livesEl.innerHTML = tempLives;
        return setBallOnThePaddle();
    }

    if (isTouched(ball, paddle) === true) {
        ballDirection.y *= -1;
        ballDirection.x = (curBallDirX - paddle.offsetLeft) / 8;
    }

    let allBricks = Array.from(document.querySelectorAll(".brick"));
    let hitTheBrick = isBallHitBrick(Array.from(allBricks));

    if (hitTheBrick) {
        ballDirection.y *= -1;
        hitTheBrick.remove();

        if (allBricks.length === 1) {
            gameOver();
        }
    }

    if (ball.offsetLeft > (gameBoard.offsetWidth - ball.offsetWidth) || ball.offsetLeft < ball.offsetWidth) {
        ballDirection.x *= -1;
    } else if (ball.offsetTop > gameBoard.offsetHeight - 20 || ball.offsetTop < 0) {
        ballDirection.y *= -1;
    }

    curBallDirX += ballDirection.x;
    curBallDirY += ballDirection.y;

    ball.style.left = `${curBallDirX}px`;
    ball.style.top = `${curBallDirY}px`;

    animationRepeat = requestAnimationFrame(moveTheBall);
}

function setBallOnThePaddle(paddleCurrentX, paddleCurrentY) {
    ball.style.left = `${paddleCurrentX}px`;
    ball.style.top = `${paddleCurrentY - ball.offsetHeight - 5}px`;
    return this;
}

function update() {
    let paddleCurrentX = paddle.offsetLeft;
    let paddleCurrentY = paddle.offsetTop;

    if (isTheBallMoving === false) { // връщаме топката до началното й състояние
        setBallOnThePaddle(paddleCurrentX, paddleCurrentY);
    }

    if (paddle.dataset.pos === "right" && paddleCurrentX < gameBoard.offsetWidth) {
        paddleCurrentX += 10;
    } else if (paddle.dataset.pos === "left" && paddle.offsetLeft > 0) {
        paddleCurrentX -= 10;
    }

    paddle.style.left = `${paddleCurrentX}px`;

    animationRepeat = requestAnimationFrame(update);
}

btnStart.addEventListener("click", function () { // START THE GAME
    if (isGameRunning === false) {
        document.querySelectorAll(".brick").forEach(brick => brick.remove());
        createBricksWall(4, 80, 10);
        sectionGameOver.style.display = "none";
        ball.style.display = "inline-block";
        let paddleCurrentX = paddle.offsetLeft;
        let paddleCurrentY = paddle.offsetTop;

        setBallOnThePaddle(paddleCurrentX, paddleCurrentY);

        animationRepeat = requestAnimationFrame(update);
        isGameRunning = true;
        return isGameRunning;
    } else {
        return false;
    }
});

document.addEventListener("keydown", (evt) => {
    if (isGameRunning === true) {
        const pressedKey = evt.key;

        if (pressedKey === "ArrowRight") {
            paddle.dataset.pos = "right"
        } else if (pressedKey === "ArrowLeft") {
            paddle.dataset.pos = "left"
        } else if (pressedKey === "ArrowUp" && isTheBallMoving === false) {
            isTheBallMoving = true;
            moveTheBall();
        }
        return true;
    }

    return false;
});

document.addEventListener("keyup", () => {
    paddle.dataset.pos = "undefined";
});

//////////////////////// ARROW MOVEMENT
// const arrowEls = document.querySelectorAll(".arrow");

document.addEventListener("click", (evt) => {
    if (isGameRunning === true) {
        const clickedItem = evt.target;
        console.log(clickedItem);

        if (clickedItem.className.includes("right")) {
            paddle.dataset.pos = "right"
        } else if (clickedItem.className.includes("left")) {
            paddle.dataset.pos = "left"
        } else if (clickedItem.className.includes("fire")) {
            isTheBallMoving = true;
            moveTheBall();
        }
        return true;
    }

    return false;
});

document.addEventListener("mouseup", function () {
    paddle.dataset.pos = "undefined";
});














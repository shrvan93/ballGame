//setting the container with it's dimensions

const container = document.querySelector('.container');
let conDim = container.getBoundingClientRect(); 
const gameover = document.createElement('div');
gameover.textContent = "Start Game";
gameover.style.position = "absolute";
gameover.style.color = "white";
gameover.style.lineHeight = "60px";
gameover.style.height = "250px";
gameover.style.textAlign = "center";
gameover.style.fontSize = "3em";
gameover.style.textTransform = "uppercase";
gameover.style.backgroundColor = "lightpink";
gameover.style.width = "100%";
gameover.addEventListener('click', startGame);
container.appendChild(gameover);

// creating the ball with demensions 
const ball = document.createElement('div');
ball.style.position = "absolute";
ball.style.width = "20px";
ball.style.height = "20px";
ball.style.backgroundColor = "wheat";
ball.style.borderRadius = "25px";
ball.style.backgroundImage = "url('ball-game.png')";
ball.style.backgroundSize = "20px 20px";
ball.style.top = "70%";
ball.style.left = "50%";
ball.style.display = "none";
container.appendChild(ball);

// paddle with dimensions

const paddle = document.createElement('div');
paddle.style.position = "absolute";
paddle.style.backgroundColor = "white";
paddle.style.height = "20px";
paddle.style.width = "100px";
paddle.style.borderRadius = "25px";
paddle.style.bottom = "30px";
paddle.style.left = "50%";
container.appendChild(paddle);

//the paddle movement direction and command

document.addEventListener('keydown', function (e) {
    
    if (e.keyCode === 37) paddle.left = true;
    if (e.keyCode === 39) paddle.right = true;
    if (e.keyCode === 38 && !player.inPlay) player.inPlay = true;
})

document.addEventListener('keyup', function (e) {
    
    if (e.keyCode === 37) paddle.left = false;
    if (e.keyCode === 39) paddle.right = false;
})

//when the game ends..

const player = {
    gameover: true
};

// the function that start the game..
function startGame() {
    if (player.gameover) {
        player.gameover = false;
        gameover.style.display = "none";
        player.score = 0;
        player.lives = 2;
        player.inPlay = false; 
        ball.style.display = "block";
        ball.style.left = paddle.offsetLeft + 50 + "px";
        ball.style.top = paddle.offsetTop - 30 + "px";
        player.ballDir = [2, -5];
        player.num = 80; //bricks maximum number
        setupBricks(player.num);//hi
        scoreUpdater();
        player.ani = window.requestAnimationFrame(update);
    }
    
}

// bricks setup function
function setupBricks(num) {
    let row = {
        x: ((conDim.width % 100) / 2), //bricks in x row
        y: 50
    }
    let skip = false;
    //looping through every x row in our container
    for (let x = 0; x < num; x++) {
        
        if (row.x > (conDim.width - 100)) {
            row.y += 50;
            if (row.y > (conDim.height / 2)) {
                skip = true;
            }
            row.x = ((conDim.width % 100) / 2);
        }
        row.count = x;
        if (!skip) {
            createBrick(row);
        }
        row.x += 100;
    }
};

// the creation of the actuall brick
function createBrick(pos) {
    const div = document.createElement('div');
    div.setAttribute('class', 'brick');
    div.style.backgroundColor = rColor();
    div.textContent = pos.count + 1;
    div.style.left = pos.x + 'px';
    div.style.top = pos.y + 'px';
    container.appendChild(div);
}

// collision cases
function isCollide(a, b) {
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();
    return !((aRect.right < bRect.left) || (aRect.left > bRect.right) || (aRect.bottom < bRect.top) || (aRect.top > bRect.bottom));
}

// random hex color (total 16 color)
function rColor() {
    return '#' + Math.random().toString(16).substr(-6);
}

// score updater function..
function scoreUpdater() {
    document.querySelector('.score').textContent = player.score;
    document.querySelector('.lives').textContent = player.lives;
}

// this function updates the paddle, and the ball

function update() {
    if (!player.gameover) {
        let pCurrent = paddle.offsetLeft;
        if (paddle.left && pCurrent > 0) {
            pCurrent -= 5;
        }
        if (paddle.right && (pCurrent < (conDim.width - paddle.offsetWidth))) {
            pCurrent += 5;
        }
        paddle.style.left = pCurrent + 'px';
        if (!player.inPlay) {
            waitingOnPaddle();
        }
        else {
            moveBall();
        }
        player.ani = window.requestAnimationFrame(update);
    }
}

// when the ball hits the paddle

function waitingOnPaddle() {
    ball.style.top = (paddle.offsetTop - 22) + 'px';
    ball.style.left = (paddle.offsetLeft + 40) + 'px';
}

// when the ball fall off and lose the game..
function fallOff() {
    player.lives--;
    if (player.lives < 0) {
        endGame();
        player.lives = 0;
    }
    scoreUpdater();
    stopper();
}

//what appears in the screan when losing a game..
function endGame() {
    gameover.style.display = "block";
    gameover.innerHTML = "Game Over<br>Your score is " + player.score;
    player.gameover = true;
    ball.style.display = "none";
    let tempBricks = document.querySelectorAll('.brick');
    for (let tBrick of tempBricks) {
        tBrick.parentNode.removeChild(tBrick);
    }
    window.cancelAnimationFrame(player.ani);
}

//when you lose attempts => then game stopps..

function stopper() {
    player.inPlay = false;
    player.ballDir[0, -5];
    waitingOnPaddle();
    window.cancelAnimationFrame(player.ani);
}


// the most important function
// the ball movement directions and posibilities..

function moveBall() {
    //ball postioning on x and y axe's (left, top)
    let posBall = {
        x: ball.offsetLeft
        , y: ball.offsetTop
    }
    if (posBall.y > (conDim.height - 20) || posBall.y < 0) {
        if (posBall.y > (conDim.height - 20)) {
            fallOff();
        }
        else {
            player.ballDir[1] *= -1;
        }
    }
    if (posBall.x > (conDim.width - 20) || posBall.x < 0) {
        player.ballDir[0] *= -1;
    }
    if (isCollide(paddle, ball)) {
        let temp = ((posBall.x - paddle.offsetLeft) - (paddle.offsetWidth / 2)) / 10; // temmp => temporary
        //console.log('hit');
        player.ballDir[0] = temp;
        player.ballDir[1] *= -1;
    };
    let bricks = document.querySelectorAll('.brick');
    if (bricks.length == 0 && !player.gameover) {
        stopper();
        setupBricks(player.num);
    }

    //looping through every brick and checking for collision posibility with bricks => remove it
    for (let tBrick of bricks) {
        if (isCollide(tBrick, ball)) {
            player.ballDir[1] *= -1;
            tBrick.parentNode.removeChild(tBrick);
            player.score++;
            scoreUpdater();
        }

    }
    posBall.y += player.ballDir[1]; // starting pos for y axe
    posBall.x += player.ballDir[0]; // starting pos for x axe
    ball.style.top = posBall.y + 'px';
    ball.style.left = posBall.x + 'px';
};

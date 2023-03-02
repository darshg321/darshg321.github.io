const screen = document.getElementById("dinoGame");
const screenContext = screen.getContext("2d");
screen.width = 854;
screen.height = 260;
const xhr = new XMLHttpRequest();

function setup() {
    speed = 8;
    score = 0;
    scoreCounter = 0;
    cactusDelay = 0;
    cactusCounter = 0;
    cactusObjCounter = 0;
    // birdCounter = 0;
    // birdDelay = 0;
    // birdObjCounter = 0;
    cactusArray = [];
    // birdArray = [];

    ground = new Ground();
    ground.sprite.src = "assets/ground.png";
    dino = new Dinosaur();
    dino.images[0].src = "assets/dino right.png";
    dino.images[1].src = "assets/dino left.png";
    dino.duckingImages[0].src = "assets/dino down right.png";
    dino.duckingImages[1].src = "assets/dino down left.png";

    document.getElementById("gameOverText").style.display = "none";

    state.current = state.play;
}
function restartButtonClick() {
    setup();
    document.getElementById("restartButton").style.display = "none";
}

function gameOver() {
    state.current = state.gameOver;
    dino.sprite.src = "assets/dino dead.png";
    document.getElementById("restartButton").style.display = "block";
    document.getElementById("gameOverText").style.display = "block";
    document.getElementById("gameOverText").innerText = "Game Over";
    let username = prompt("Enter a Username to store your score");
    if (username === null || username === "" || username === " " || username === undefined) {
        console.log("username not sent");
        return;
    }

    if (username.indexOf(' ') >= 0 || username.length < 3) {
        username = prompt("Username must not contain spaces and must be 3-10 characters long");
    }
    if (username.indexOf(' ') === -1 && username.length >= 3 && username.length <= 10 &&
        !(username === null || username === "" || username === " " || username === undefined)) {

        let fullData = {
            Username: username,
            Score: score
        };
        xhr.open('POST', 'http://localhost:8080/api/sendscore', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(fullData));
    }
}

const state = {
    ready: "ready",
    play: "play",
    gameOver: "gameOver",
    current: "ready"
};

class Dinosaur {
    counter = 0;
    stepCooldown = 10;
    index = 0;
    vel = 6;
    images = [
        this.sprite = new Image(),
        this.sprite = new Image()
    ];
    duckingImages = [
        this.sprite = new Image(),
        this.sprite = new Image()
    ];

    x = 10;
    y = 160;
    jumping = false;
    ducking = false;

    animation() {
        this.counter++;

        if (this.counter > this.stepCooldown) {
            this.counter = 0;
            this.index++;
            if (this.index >= this.images.length) {
                this.index = 0;
            }
        }

        if (this.ducking) {
            this.sprite = this.duckingImages[this.index];
            this.y = 200;
        } else {
            this.sprite = this.images[this.index];
        }
    }

    draw() {
        screenContext.drawImage(this.sprite, this.x, this.y);
    }

    update() {
        this.animation();
        this.vel += 0.5;
        if (this.vel > 10) {
            this.vel = 8;
        }
        this.y += ~~this.vel;
        if (this.y >= 160) {
            this.y = 160;
            this.jumping = false;
        }
    }
    jump() {
        dino.jumping = true;
        dino.vel -= 21.5;
    }
    // checkCollisionWith(spriteArray) {
    //     const firstSprite = spriteArray[0];
    //     if (this !== firstSprite) {
    //         if (
    //             this.x < firstSprite.x + firstSprite.width &&
    //             this.x + this.width > firstSprite.x &&
    //             this.y < firstSprite.y + firstSprite.height &&
    //             this.y + this.height > firstSprite.y
    //         ) {
    //             console.log("coll");
    //         }
    //     }
    // }
    // get width() {
    //     return this.sprite.width;
    // }
    //
    // get height() {
    //     return this.sprite.height;
    // }
}

class Ground {
    sprite = new Image();

    x = 0;
    y = 240;

    draw() {
        screenContext.drawImage(this.sprite, this.x, this.y);
    }

    update() {
        if (state.current === state.play) {
            this.x -= speed;
        }
        if (this.x <= -1500) {
            this.x = 0;
        }
    }
}

class Cactus {
    sprite = new Image();
    x = 960;
    y = 15;
    // width = this.sprite.width;
    // height = this.sprite.height;

    whatCactus() {
        let cactusType = random(1, 2)
        let cactusNumber = random(1, 4)
        cactusType = cactusType === 1 ? "small" : "large";
        if (cactusNumber === 4) {
            this.sprite.src = "assets/4 large cactus.png"
        }
        else {
            this.sprite.src = `assets/${cactusNumber} ${cactusType} cactus.png`;
        }
    }
    draw() {
        screenContext.drawImage(this.sprite, this.x, (screen.height - this.sprite.height - this.y));
    }

    update() {
        this.x -= speed;
        if (this.x < -100) {
            cactusArray.shift();
        }
    }
}

// class Bird {
//     counter = 0;
//     index = 0;
//     flapCooldown = 5
//     images = [
//         this.sprite = new Image(),
//         this.sprite = new Image()
//     ];
//     x = 960;
//     y = 50;
//
//     animation() {
//         this.counter++;
//
//         if (this.counter > this.flapCooldown) {
//             this.counter = 0;
//             this.index++;
//             if (this.index >= this.images.length) {
//                 this.index = 0;
//             }
//         }
//         this.sprite = this.images[this.index];
//     }
//     whereBird() {
//         let birdHeight = random(1, 2);
//         this.y = birdHeight === 1 ? 50 : 200;
//         this.images[0].src = "assets/bird1.png";
//         this.images[1].src = "assets/bird2.png";
//     }
//
//     update() {
//         this.animation();
//         screenContext.drawImage(this.sprite, this.x, this.y);
//         if (state.current === state.play) {
//             this.x -= speed;
//         }
//         if (this.x < -100) {
//             birdArray.shift();
//         }
//     }
// }

window.addEventListener("keydown", function(event) {
    if (state.current === state.ready) {
        if (event.code === "Space" || event.code === "ArrowUp") {
            readyScreenDone();
        }
    }

    if ((event.code === "Space" || event.code === "ArrowUp") && !dino.jumping && !dino.ducking) {
        dino.jump();
    }
    else if ((event.code === "ArrowDown") && !dino.jumping) {
        dino.ducking = true;
    }
    else if (event.code === "ArrowDown" && dino.jumping) {
        if (dino.vel <= 5) {
            dino.vel = 6;
        }
        else if (dino.vel <= 8) {
            dino.vel += 2
        }
    }
});

window.addEventListener("keyup", function(event) {
    if (event.code === "ArrowDown") {
        dino.ducking = false;
    }
});

function readyScreenDone() {
    state.current = state.play;
    document.getElementById("readyImage").style.display = "none";
}

function scoreAdder() {
    scoreCounter++
    if (scoreCounter >= 5) {
        scoreCounter = 0;
        score++;
        if (score % 125 === 0) {speed++;}
    }
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function cactusDelayer() {
    cactusCounter++;
    if (cactusCounter > cactusDelay) {
        cactusCounter = 0;
        cactusDelay = random(75, 90);
        createCactusObject();
    }
}

function createCactusObject() {
    let objectName = 'cactus_' + cactusObjCounter;
    window[objectName] = new Cactus();
    cactusObjCounter++;
    cactusArray.push(objectName);
    window[objectName].whatCactus();
}

// function birdDelayer() {
//     birdCounter++;
//     if (birdCounter > birdDelay) {
//         birdCounter = 0;
//         birdDelay = random(45, 90);
//         createBirdObject();
//     }
// }

// function createBirdObject() {
//     let objectName = 'bird_' + birdObjCounter;
//     window[objectName] = new Bird();
//     birdObjCounter++;
//     birdArray.push(objectName);
//     window[objectName].whereBird();
// }

let speed = 8;
let score = 0;
let scoreCounter = 0;
let cactusDelay = 0;
let cactusCounter = 0;
let cactusObjCounter = 0;
// let birdCounter = 0;
// let birdDelay = 0;
// let birdObjCounter = 0;
let cactusArray = [];
// let birdArray = [];

let ground = new Ground();
ground.sprite.src = "assets/ground.png";

let dino = new Dinosaur();
dino.images[0].src = "assets/dino right.png";
dino.images[1].src = "assets/dino left.png";
dino.duckingImages[0].src = "assets/dino down right.png";
dino.duckingImages[1].src = "assets/dino down left.png";

const scoreText = document.getElementById("score");

fetch('http://localhost:8080/api/gettopten')
    .then((response) => response.json())
    .then((data) => createLeaderboard(data))

async function createLeaderboard(jsonString) {
    const data = JSON.parse(jsonString);

    const table = document.createElement('table');
    table.id = "Leaderboard";

    const headerRow = document.createElement('tr');
    headerRow.id = "HeaderRow";

    const rankHeader = document.createElement('th');
    rankHeader.textContent = 'Rank';
    const usernameHeader = document.createElement('th');
    usernameHeader.textContent = 'Username';
    const scoreHeader = document.createElement('th');
    scoreHeader.textContent = 'Score';
    headerRow.appendChild(rankHeader);
    headerRow.appendChild(usernameHeader);
    headerRow.appendChild(scoreHeader);
    table.appendChild(headerRow);

    for (let i = 0; i < data.length; i++) {
        const row = document.createElement('tr');

        const rankCell = document.createElement('td');
        rankCell.textContent = (i + 1).toString();
        row.appendChild(rankCell);

        const usernameCell = document.createElement('td');
        usernameCell.textContent = data[i].Username;
        row.appendChild(usernameCell);

        const scoreCell = document.createElement('td');
        scoreCell.textContent = data[i].Score;
        row.appendChild(scoreCell);

        table.appendChild(row);
    }

    document.body.appendChild(table);
}


function Main() {
    screenContext.fillStyle = "#ffffff";
    screenContext.fillRect(0, 0, screen.width, screen.height);
    ground.draw();
    dino.draw();
    cactusArray.forEach(cactus => window[cactus].draw());
    if (state.current === state.play) {
        ground.update();
        dino.update();
        scoreAdder();
        cactusDelayer();
        cactusArray.forEach(cactus => window[cactus].update());
        // dino.checkCollisionWith(cactusArray);
        // birdDelayer();
        // birdArray.forEach(bird => window[bird].update());
    }
    scoreText.innerText = `${score}`;

    requestAnimationFrame(Main);
}
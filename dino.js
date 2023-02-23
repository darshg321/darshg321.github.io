const screen = document.getElementById("dinogame");
const screenContext = screen.getContext("2d");
screen.width = 854;
screen.height = 260;

let speed = 8;
let score = 0;
let scoreCounter = 0;
let scoreText = document.getElementById("score");
let cactusDelay = 0;
let cactusCounter = 0;
let cactusObjCounter = 0;
let birdCounter = 0;
let birdDelay = 0;
let birdObjCounter = 0;

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

    update() {
        this.animation();
        screenContext.drawImage(this.sprite, this.x, this.y);
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
}
class Ground {
    sprite = new Image();

    x = 0;
    y = 240;

    update() {
        screenContext.drawImage(this.sprite, this.x, this.y);
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
    update() {
        screenContext.drawImage(this.sprite, this.x, (screen.height - this.sprite.height - this.y));
        if (state.current === state.play) {
            this.x -= speed;
        }
        if (this.x < -100) {
            cactusArray.shift();
        }
    }
}

class Bird {
    counter = 0;
    index = 0;
    flapCooldown = 5
    images = [
        this.sprite = new Image(),
        this.sprite = new Image()
    ];
    x = 960;
    y = 50;

    animation() {
        this.counter++;

        if (this.counter > this.flapCooldown) {
            this.counter = 0;
            this.index++;
            if (this.index >= this.images.length) {
                this.index = 0;
            }
        }
        this.sprite = this.images[this.index];
    }
    whereBird() {
        let birdHeight = random(1, 2);
        this.y = birdHeight === 1 ? 50 : 200;
        this.images[0].src = "assets/bird1.png";
        this.images[1].src = "assets/bird2.png";
    }

    update() {
        this.animation();
        screenContext.drawImage(this.sprite, this.x, this.y);
        if (state.current === state.play) {
            this.x -= speed;
        }
        if (this.x < -100) {
            birdArray.shift();
        }
    }
}

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

function birdDelayer() {
    birdCounter++;
    if (birdCounter > birdDelay) {
        birdCounter = 0;
        birdDelay = random(45, 90);
        createBirdObject();
    }
}

function createCactusObject() {
    let objectName = 'cactus_' + cactusObjCounter;
    window[objectName] = new Cactus();
    cactusObjCounter++;
    cactusArray.push(objectName);
    window[objectName].whatCactus();
}

function createBirdObject() {
    let objectName = 'bird_' + birdObjCounter;
    window[objectName] = new Bird();
    birdObjCounter++;
    birdArray.push(objectName);
    window[objectName].whereBird();
}

function collides(sprite_a, sprite_b) {
    if (sprite_a.x < sprite_b.x + sprite_b.width &&
        sprite_a.x + sprite_a.width > sprite_b.x &&
        sprite_a.y < sprite_b.y + sprite_b.height &&
        sprite_a.y + sprite_a.height > sprite_b.y)
    {
        console.log("coll");
    }
}

const ground = new Ground();
ground.sprite.src = "assets/ground.png";

const dino = new Dinosaur();
dino.images[0].src = "assets/dino right.png";
dino.images[1].src = "assets/dino left.png";
dino.duckingImages[0].src = "assets/dino down right.png";
dino.duckingImages[1].src = "assets/dino down left.png";

let cactusArray = [];
let birdArray = [];

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
    ground.update();
    dino.update();
    if (state.current === state.play) {
        scoreAdder();
        cactusDelayer();
        cactusArray.forEach(cactus => window[cactus].update());
        // birdDelayer();
        // birdArray.forEach(bird => window[bird].update());
    }
    scoreText.innerHTML = `Score: ${score}`;

    requestAnimationFrame(Main);
}
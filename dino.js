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
        // this.collisionDetection();
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
    // collisionDetection() {
    //     let dinoLeft = this.x;
    //     let dinoRight = this.x + this.sprite.width;
    //     let dinoTop = this.y;
    //     let dinoBottom = this.y + this.sprite.height;
    //
    //     for (let i = 0; i < cactusArray.length; i++) {
    //         let cactusLeft = cactusArray[i].x;
    //         let cactusRight = cactusArray[i].x + cactusArray[i].width;
    //         let cactusTop = cactusArray[i].y;
    //         let cactusBottom = cactusArray[i].y + cactusArray[i].height;
    //
    //         // Check if there is an overlap between dino and cactus
    //         if (dinoRight > cactusLeft && dinoLeft < cactusRight &&
    //             dinoBottom > cactusTop && dinoTop < cactusBottom) {
    //             console.log("coll")
    //         }
    //     }
    // }
    jump() {
        dino.jumping = true;
        dino.vel -= 21;
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
        if (score % 75 === 0) {speed++;}
    }
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function cactusDelayer() {
    cactusCounter++;
    if (cactusCounter > cactusDelay) {
        cactusCounter = 0;
        cactusDelay = random(45, 90);
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

const ground = new Ground();
ground.sprite.src = "assets/ground.png";

const dino = new Dinosaur();
dino.images[0].src = "assets/dino right.png";
dino.images[1].src = "assets/dino left.png";
dino.duckingImages[0].src = "assets/dino down right.png";
dino.duckingImages[1].src = "assets/dino down left.png";

let cactusArray = []

function Main() {
    screenContext.fillStyle = "#ffffff";
    screenContext.fillRect(0, 0, screen.width, screen.height);
    ground.update();
    dino.update();
    if (state.current === state.play) {
        scoreAdder();
        cactusDelayer();
        cactusArray.forEach(cactus => window[cactus].update());
    }
    scoreText.innerHTML = `Score: ${score}`;

    requestAnimationFrame(Main);
}
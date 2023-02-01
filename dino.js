const screen = document.getElementById("dinogame");
const screenContext = screen.getContext("2d");
screen.width = 854;
screen.height = 260;

let speed = 4;
let score = 0;
let scoreCounter = 0;
let scoreText = document.getElementById("score");

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
        }
        else {
            this.sprite = this.images[this.index];
        }
    }

    update() {
        this.animation();
        screenContext.drawImage(this.sprite, this.x, this.y);
        this.vel += 0.5;
        if (this.vel > 8) {
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
        dino.vel -= 19;
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

window.addEventListener("keydown", function(event) {
    if (state.current === state.ready) {
        if (event.code === "Space" || event.code === "ArrowUp") {
            ReadyScreen();
        }
    }

    if ((event.code === "Space" || event.code === "ArrowUp") && !dino.jumping && !dino.ducking) {
        dino.jump();
    }
    else if ((event.code === "ArrowDown") && !dino.jumping) {
        dino.ducking = true;

    }
});

window.addEventListener("keyup", function(event) {
    if (event.code === "ArrowDown") {
        dino.ducking = false;
    }
});

function ReadyScreen() {
    state.current = state.play;
    document.getElementById("readyImage").style.display = "none";
}

function scoreAdder() {
    scoreCounter++
    if (scoreCounter >= 6) {
        scoreCounter = 0;
        score++;
    }

}

let ground = new Ground();
ground.sprite.src = "assets/ground.png";

let dino = new Dinosaur();
dino.images[0].src = "assets/dino right.png";
dino.images[1].src = "assets/dino left.png";
dino.duckingImages[0].src = "assets/dino down right.png";
dino.duckingImages[1].src = "assets/dino down left.png";

function Main() {
    screenContext.fillStyle = "#ffffff";
    screenContext.fillRect(0, 0, screen.width, screen.height);
    ground.update();
    dino.update();
    if (state.current === state.play) {
        scoreAdder();
    }
    scoreText.innerHTML = `Score: ${score}`

    requestAnimationFrame(Main);
}
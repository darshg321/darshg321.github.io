const screen = document.getElementById("dinogame");
const screenContext = screen.getContext("2d");
screen.width = 854;
screen.height = 260;

let speed = 1;

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
    readyImage = [
        this.sprite = new Image()
    ];
    

    x = 10;
    y = 160;
    jumping = false;
    ducking = false;

    animation() {
        this.counter += 1;

        if (this.counter > this.stepCooldown) {
            this.counter = 0;
            this.index += 1;
            if (this.index >= this.images.length) {
                this.index = 0;
            }
        }
        
        if (state.current == state.ready) {
            this.sprite = this.readyImage[0];
        }
        else if (this.ducking) {
            this.sprite = this.duckingImages[this.index];
            this.y = 200;
        }
        else {
            this.sprite = this.images[this.index];
        }
    }

    update() {
        if (state.current === state.play) {
           this.animation(); 
        }
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
    }
}

window.addEventListener("keydown", function(event) {
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


let ground = new Ground();
ground.sprite.src = "assets/ground.png";

let dino = new Dinosaur();
dino.images[0].src = "assets/dino right.png";
dino.images[1].src = "assets/dino left.png";
dino.duckingImages[0].src = "assets/dino down right.png";
dino.duckingImages[1].src = "assets/dino down left.png";
//TODO: add the dino default image
dino.readyImage.src = "assets/dino ready.png";

function Main() {
    screenContext.fillStyle = "#ffffff";
    screenContext.fillRect(0, 0, screen.width, screen.height);
    ground.update();
    dino.update();

    requestAnimationFrame(Main);
}
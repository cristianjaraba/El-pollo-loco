class MovableObject extends DrawableObject{
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;
    gravityInterval;

    applyGravity() {
        this.gravityInterval = setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    isAboveGround() {
        if(this instanceof ThrowableObject){
            return true;
        }
        else{
            return this.y < 180;
        }
    }

    isColliding(mo) {
    let margin = 20;
    if (mo instanceof ThrowableObject) {
        margin = 0;
    }

    return this.x + this.width - margin > mo.x + margin &&
           this.y + this.height - margin > mo.y + margin &&
           this.x + margin < mo.x + mo.width - margin &&
           this.y + margin < mo.y + mo.height - margin;
}

    collisionTop(mo) {
    let distanceY = 10;
    let distanceX = 5;
    if (mo instanceof Chick) {
        distanceX = 10;
    }

    return this.isAboveGround() &&
           this.speedY < 0 &&
           this.x + this.width > mo.x - distanceX &&
           this.x < mo.x + mo.width + distanceX &&
           this.y < mo.y &&
           this.y + this.height >= mo.y - distanceY;
}
    

    hit(){
        this.energy -= 5;
        if (this.energy < 0) {
            this.energy = 0;
        } else{
            this.lastHit = new Date().getTime();
        }
    }

    isHurt(){
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 1;
    }

    isDead(){
        return this.energy == 0;
    }

    moveRight() {
        this.x += this.speed;
        this.otherDirection = false;

    }
    moveLeft(changeDirection) {
        this.x -= this.speed;
        this.otherDirection = changeDirection;
    }
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }
    jump() {
        this.speedY = 30;
    };

}
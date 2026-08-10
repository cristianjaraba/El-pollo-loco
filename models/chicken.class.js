class Chicken extends MovableObject {
    y = 380;
    height = 60;
    width = 60;
    IMAGES_WALKING;
    IMAGE_DEAD;
    energy = 5;
    chickenInterval1;
    chickenInterval2;

    constructor(IMAGES_WALKING, IMAGE_DEAD) {
    super().loadImage(IMAGES_WALKING[0]);

    this.IMAGES_WALKING = IMAGES_WALKING;
    this.IMAGE_DEAD = IMAGE_DEAD;
    this.x = 400 + Math.random() * 2500;
    this.y = Math.floor(Math.random() * (400 - 380 + 1)) + 380;
    this.speed = 0.15 + Math.random() * 0.25;
    this.loadImages(this.IMAGES_WALKING);
    this.animate();
}

    animate() {
        this.chickenInterval1 = setInterval(() => { 
            this.moveLeft(); 
        }, 1000 / 60);
        this.chickenInterval2 = setInterval(() => {
            if (this.isDead()) {
                this.loadImage(this.IMAGE_DEAD);
                clearInterval(this.chickenInterval1);
            }
            else{
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    }; 

}
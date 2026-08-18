/**
 * Represents a normal walking chicken enemy. Spawns at a random
 * x-position within the level, walks left continuously at a random
 * speed, and switches to its dead image once defeated, stopping
 * further movement.
 *
 * @extends MovableObject
 */
class Chicken extends MovableObject {
    y = 380;
    height = 60;
    width = 60;
    /** @type {string[]} Paths to the walking animation frames. */
    IMAGES_WALKING;
    /** @type {string} Path to the dead/defeated image. */
    IMAGE_DEAD;
    /** @type {number} Amount of damage this enemy deals/energy it has before dying. */
    energy = 5;
    /** @type {number} Interval ID for the continuous leftward movement loop. */
    chickenInterval1;
    /** @type {number} Interval ID for the animation/death-check loop. */
    chickenInterval2;

    /**
     * Creates a chicken enemy at a random x-position along the level,
     * with a randomized walking speed, and starts its movement/animation.
     *
     * @param {string[]} IMAGES_WALKING - Paths to the walking animation frames.
     * @param {string} IMAGE_DEAD - Path to the dead/defeated image.
     */
    constructor(IMAGES_WALKING, IMAGE_DEAD) {
    super().loadImage(IMAGES_WALKING[0]);

    this.IMAGES_WALKING = IMAGES_WALKING;
    this.IMAGE_DEAD = IMAGE_DEAD;
    this.x = 400 + Math.random() * 2500;
    this.y = 360;
    this.speed = 0.15 + Math.random() * 0.25;
    this.loadImages(this.IMAGES_WALKING);
    this.animate();
}

    /**
     * Starts two loops: one that continuously moves the chicken left,
     * and one that checks whether it has died — switching to the dead
     * image and stopping movement if so, otherwise continuing the
     * walking animation.
     *
     * @returns {void}
     */
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
/**
 * Represents a background cloud that drifts slowly to the left at a
 * randomized speed, spawning at a random x-position within the level.
 *
 * @extends MovableObject
 */
class Cloud extends MovableObject {
    y = 20;
    width = 500;
    height = 250;
    /** @type {number} Interval ID for the continuous leftward movement loop. */
    cloudInterval;

    /**
     * Creates a cloud at a random x-position with a randomized drift
     * speed, and starts its movement.
     */
    constructor() {
        super().loadImage('img/5_background/layers/4_clouds/1.png');
        this.x = Math.random() * 2500;
        this.animate();
        this.speed = Math.random() * (0.3 - 0.15) + 0.15;
    }

    /**
     * Starts the loop that continuously moves the cloud left.
     *
     * @returns {void}
     */
    animate() {
        this.cloudInterval = setInterval(() => { 
            this.moveLeft(); 
        }, 1000 / 60);
    }
}
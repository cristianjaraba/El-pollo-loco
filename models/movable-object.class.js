/**
 * Base class for any drawable object that can move, be affected by
 * gravity, take damage, and collide with other objects. Provides
 * shared physics (gravity, jumping), collision detection, health/hit
 * state, and frame-based animation playback.
 *
 * @extends DrawableObject
 */
class MovableObject extends DrawableObject{
    speed = 0.15;
    /** @type {boolean} Whether the object is currently facing/moving in the "other" (flipped) direction. */
    otherDirection = false;
    /** @type {number} Current vertical velocity, used for jumping/falling. */
    speedY = 0;
    /** @type {number} Gravitational deceleration applied to speedY each tick. */
    acceleration = 2.5;
    /** @type {number} Current health/energy; the object is considered dead at 0. */
    energy = 100;
    /** @type {number} Timestamp (ms) of the last time this object was hit. */
    lastHit = 0;
    /** @type {number} Interval ID for the gravity simulation loop. */
    gravityInterval;

    /**
     * Starts the gravity simulation loop, which applies vertical
     * movement and deceleration while the object is above ground or
     * still moving upward.
     *
     * @returns {void}
     */
    applyGravity() {
        this.gravityInterval = setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    /**
     * Checks whether the object is currently above the ground.
     * {@link ThrowableObject} instances are always considered above
     * ground (unaffected by the ground-level check), while all other
     * objects are above ground when their y-position is less than 180.
     *
     * @returns {boolean} True if the object is above ground.
     */
    isAboveGround() {
        if(this instanceof ThrowableObject){
            return true;
        }
        else{
            return this.y < 180;
        }
    }

    /**
     * Checks whether this object's bounding box overlaps with another
     * movable object's, using an inward margin to make collisions feel
     * tighter than the raw sprite bounds. {@link ThrowableObject}
     * targets use no margin for more precise hit detection.
     *
     * @param {MovableObject} mo - The other object to check collision against.
     * @returns {boolean} True if the two objects are colliding.
     */
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

    /**
     * Checks whether this object is landing on top of another object
     * (e.g. the player stomping an enemy): the object must be above
     * ground, falling (negative speedY), horizontally overlapping
     * (within a tolerance), and just above/at the target's top edge.
     * {@link Chick} targets use a wider horizontal tolerance to account
     * for their smaller size.
     *
     * @param {MovableObject} mo - The other object to check a top-collision against.
     * @returns {boolean} True if this object is landing on top of `mo`.
     */
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
    

    /**
     * Applies damage to this object, reducing its energy by 5 (floored
     * at 0), and records the hit timestamp if it survives the hit.
     *
     * @returns {void}
     */
    hit(){
        this.energy -= 5;
        if (this.energy < 0) {
            this.energy = 0;
        } else{
            this.lastHit = new Date().getTime();
        }
    }

    /**
     * Checks whether the object was hit within the last second.
     *
     * @returns {boolean} True if the object is currently in its "hurt" window.
     */
    isHurt(){
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 1;
    }

    /**
     * Checks whether the object's energy has been fully depleted.
     *
     * @returns {boolean} True if the object is dead.
     */
    isDead(){
        return this.energy == 0;
    }

    /**
     * Moves the object right by its speed and sets its facing
     * direction to the default (non-flipped).
     *
     * @returns {void}
     */
    moveRight() {
        this.x += this.speed;
        this.otherDirection = false;

    }
    /**
     * Moves the object left by its speed and sets its facing direction.
     *
     * @param {boolean} changeDirection - The direction flag to apply to {@link MovableObject#otherDirection}.
     * @returns {void}
     */
    moveLeft(changeDirection) {
        this.x -= this.speed;
        this.otherDirection = changeDirection;
    }
    /**
     * Advances and renders the next frame in a given animation frame
     * sequence, cycling back to the start once the end is reached.
     *
     * @param {string[]} images - Array of image paths making up the animation.
     * @returns {void}
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }
    /**
     * Triggers a jump by setting an initial upward vertical velocity,
     * which {@link MovableObject#applyGravity} then decelerates over time.
     *
     * @returns {void}
     */
    jump() {
        this.speedY = 30;
    };

}
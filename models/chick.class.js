/**
 * Represents a small chicken enemy — a smaller, lower-energy variant
 * of {@link Chicken}, positioned slightly higher on the ground (y: 370)
 * to account for its reduced height.
 *
 * @extends Chicken
 */
class Chick extends Chicken {
    height = 40;
    width = 40;
    y = 380;
    /** @type {number} Amount of damage this enemy deals/energy it has before dying. */
    energy = 5;

    /**
     * Creates a small chicken enemy with the given walking and dead images.
     *
     * @param {string[]} IMAGES_WALKING - Paths to the walking animation frames.
     * @param {string} IMAGE_DEAD - Path to the dead/defeated image.
     */
    constructor(IMAGES_WALKING, IMAGE_DEAD) {
        super(IMAGES_WALKING, IMAGE_DEAD);
        this.IMAGES_WALKING = IMAGES_WALKING;
        this.IMAGE_DEAD = IMAGE_DEAD;
        this.y = 370;

    }
}
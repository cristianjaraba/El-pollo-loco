/**
 * Represents a segmented status bar (e.g. health, coins, bottles, or
 * endboss energy) that displays one of six images based on the current
 * percentage value, in 20% increments.
 *
 * @extends DrawableObject
 */
class StatusBar extends DrawableObject {
    /** @type {number} Current fill percentage (0–100). */
    percentage = 100;

    /**
     * Creates a status bar at the given position, using a 6-frame image
     * set (one per 20% increment), and initializes it to 100%.
     *
     * @param {string[]} IMAGES - Array of 6 image paths, ordered from emptiest (index 0) to full (index 5).
     * @param {number} x - The horizontal position of the status bar.
     * @param {number} y - The vertical position of the status bar.
     */
    constructor(IMAGES, x, y) {
        super();
        this.IMAGES = IMAGES;
        this.loadImages(this.IMAGES);
        this.x = x;
        this.y = y;
        this.width = 200;
        this.height = 60;
        this.setPercentage(100);
    }

    /**
     * Updates the status bar's percentage and refreshes its displayed
     * image to match.
     *
     * @param {number} percentage - The new fill percentage (0–100).
     * @returns {void}
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
        
    }

    /**
     * Maps the current percentage to the corresponding image index
     * within {@link DrawableObject#IMAGES}: 5 at 100%, and one lower
     * for each 20-point bracket down to 0 (index 0 for anything below 20%).
     *
     * @returns {number} The image index (0–5) matching the current percentage.
     */
    resolveImageIndex() {
        if (this.percentage == 100) {
            return 5;
        }
        else if (this.percentage >= 80) {
            return 4;
        } else if (this.percentage >= 60) {
            return 3;
        }
        else if (this.percentage >= 40) {
            return 2;
        }
        else if (this.percentage >= 20) {
            return 1;
        } else {
            return 0;
        }

    }
}
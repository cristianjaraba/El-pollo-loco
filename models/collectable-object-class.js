/**
 * Represents a static collectable item (e.g. coin, bottle) placed at a
 * fixed position in the level. Alternates between two images to create
 * a simple two-frame "shimmer" animation.
 *
 * @extends DrawableObject
 */
class CollectableObject extends DrawableObject{

    /** @type {number} Interval ID for the two-frame shimmer animation loop. */
    collectablesInterval;

    /**
     * Creates a collectable object at the given position and size, and
     * starts its shimmer animation.
     *
     * @param {string[]} IMAGES - The two image paths to alternate between (e.g. [frame1, frame2]).
     * @param {number} x - The horizontal position of the object.
     * @param {number} y - The vertical position of the object.
     * @param {number} height - The height of the object.
     * @param {number} width - The width of the object.
     */
    constructor(IMAGES, x, y, height, width) {
        super();
        this.IMAGES = IMAGES;
        this.loadImages(this.IMAGES);
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.setImg();
    }

    /**
     * Sets the initial image and starts an interval that toggles
     * between the two frames in {@link CollectableObject#IMAGES}
     * every 500ms to create a shimmer effect.
     *
     * @returns {void}
     */
    setImg() {
        let index = 0;
        let path = this.IMAGES[index];
        this.img = this.imageCache[path];
        this.collectablesInterval = setInterval(()=>{
            if (index == 0) {
                index = 1;
            } else {
                index = 0
            }
            path = this.IMAGES[index];
            this.img = this.imageCache[path];
        }, 500)
    }
}
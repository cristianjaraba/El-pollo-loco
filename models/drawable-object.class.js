/**
 * Base class for any object that can be drawn onto the canvas.
 * Provides shared image-loading, drawing, and (debug) frame-outline
 * behavior for all game objects.
 */
class DrawableObject{
    /** @type {HTMLImageElement} The currently active image for this object. */
    img;
    /** @type {Object<string, HTMLImageElement>} Cache of preloaded images, keyed by their path. */
    imageCache = {};
    /** @type {number} Index of the current frame within an animation sequence. */
    currentImage = 0;
    x = 120;
    y = 280;
    height = 150;
    width = 100;
    /** @type {string[]} Paths to this object's animation frames, if any. */
    IMAGES;

    /**
     * Loads and sets a single image as this object's current image.
     *
     * @param {string} path - Path to the image to load.
     * @returns {void}
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Draws this object's current image onto the given canvas context
     * at its position and size.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context to draw on.
     * @returns {void}
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /**
     * Preloads a set of images and stores them in {@link DrawableObject#imageCache},
     * keyed by their path, for later use in animations.
     *
     * @param {string[]} arr - Array of image paths to preload.
     * @returns {void}
     */
    loadImages(arr) {
        arr.forEach(path => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
     * Debug helper that draws a blue outline around this object's
     * bounding box, but only if it's a {@link Character} or {@link Chicken}
     * instance.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context to draw on.
     * @returns {void}
     */
    drawFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken) {
            ctx.beginPath();
            ctx.lineWidth = "5";
            ctx.strokeStyle = "blue";
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
        }

    }

}
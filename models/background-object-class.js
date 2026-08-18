/**
 * Represents a static parallax background layer (e.g. sky, mountains, ground).
 * Positioned at a fixed x-coordinate and aligned to the bottom of the canvas
 * by default. Extends {@link MovableObject} for shared image-loading behavior,
 * though background objects don't move on their own.
 *
 * @extends MovableObject
 */
class BackgroundObject extends MovableObject{

    /**
     * Creates a new background layer, loads its image, and positions it
     * so its bottom edge aligns with the bottom of the 480px-tall canvas.
     *
     * @param {string} imagePath - Path to the background image.
     * @param {number} x - The horizontal position of this layer.
     * @param {number} width - The width of this layer.
     * @param {number} height - The height of this layer.
     */
    constructor(imagePath, x, width, height){
    super().loadImage(imagePath);
    this.x = x;
    this.height = height;
    this.width = width;
    this.y = 480 - this.height;

  }

  /**
   * Repositions this object to the center of a 720x480 canvas,
   * based on its current width and height.
   *
   * @returns {void}
   */
  setInTheMiddle(){
    this.x = (720 - this.width) / 2;
    this.y = (480 - this.height) / 2;
  }
}
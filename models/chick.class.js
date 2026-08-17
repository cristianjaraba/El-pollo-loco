class Chick extends Chicken {
    height = 40;
    width = 40;
    y = 380;
    energy = 5;

    constructor(IMAGES_WALKING, IMAGE_DEAD) {
        super(IMAGES_WALKING, IMAGE_DEAD);
        this.IMAGES_WALKING = IMAGES_WALKING;
        this.IMAGE_DEAD = IMAGE_DEAD;
        this.y = 370;

    }
}
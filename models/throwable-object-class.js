/**
 * Represents a thrown salsa bottle projectile. Launched with an
 * upward velocity and constant rightward drift, rotating in the air
 * under gravity until it falls low enough to trigger its splash
 * animation and impact sound.
 *
 * @extends MovableObject
 */
class ThrowableObject extends MovableObject {
    /** @type {string[]} Frames for the in-flight rotating animation. */
    IMAGES_ROTATING = ['img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];
    /** @type {string[]} Frames for the splash/impact animation. */
    IMAGES_SPLASH = ['img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];
    /** @type {number} Interval ID for the constant rightward drift loop. */
    animationIntervalBottle1;
    /** @type {number} Interval ID for the rotating/splash animation loop. */
    animationIntervalBottle2;

    /**
     * Creates a thrown bottle at the given starting position, preloads
     * its animation frames, and immediately launches it.
     *
     * @param {number} x - The starting horizontal position.
     * @param {number} y - The starting vertical position.
     */
    constructor(x, y) {
        super().loadImage('img/6_salsa_bottle/salsa_bottle.png');
        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 50;
        this.loadImages(this.IMAGES_ROTATING);
        this.loadImages(this.IMAGES_SPLASH);
        this.throw(100, 150);
    }

    /**
     * Launches the bottle: gives it an initial upward velocity and
     * enables gravity, starts a constant rightward drift, and plays
     * the rotating animation while airborne. Once the bottle falls
     * below y=350, plays the impact sound and switches to the splash
     * animation, stopping the rotation loop.
     *
     * Note: declared with no parameters; the `(100, 150)` arguments
     * passed by the constructor are currently unused.
     *
     * @returns {void}
     */
    throw() {
        this.speedY = 30;
        this.applyGravity();
        this.animationIntervalBottle1 = setInterval(() => {
            if (world.character.otherDirection == false) {
                this.x += 5;
            } else {
                this.x -= 5;
            }   
        }, 25);
        this.animationIntervalBottle2 = setInterval(() => {
            if (this.y > 350) {
                AudioHub.playOne(AudioHub.BOTTLE_HIT);
                this.playAnimation(this.IMAGES_SPLASH);
                clearInterval(this.animationIntervalBottle2);
            } else {
                this.playAnimation(this.IMAGES_ROTATING);
            }
        }, 100);
    }
}
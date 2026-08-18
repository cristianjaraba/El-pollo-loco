/**
 * Represents the playable character (Pepe). Handles keyboard-driven
 * movement, jumping, and gravity, and derives its current animation
 * (idle, long-idle, walking, jumping, hurt, dead) from its state each
 * animation tick. Also tracks collected coins and bottles.
 *
 * @extends MovableObject
 */
class Character extends MovableObject {
    y = 80;
    height = 250;

    /** @type {string[]} Frames for the short idle animation. */
    IMAGES_IDLE = ['img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png',
    ];
    /** @type {string[]} Frames for the "falling asleep" long idle animation, shown after 5s of inactivity. */
    IMAGES_LONGIDLE = ['img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png',
    ];
    /** @type {string[]} Frames for the walking animation. */
    IMAGES_WALKING = ['img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];
    /** @type {string[]} Frames for the jumping animation. */
    IMAGES_JUMPING = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png',
    ]
    /** @type {World} Reference to the game world, set externally after construction. */
    world;
    speed = 10;
    /** @type {string[]} Frames for the death animation. */
    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png'
    ];
    /** @type {string[]} Frames for the hurt animation. */
    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];
    /** @type {number} Number of coins collected. */
    coins = 0;
    /** @type {number} Number of bottles collected. */
    bottles = 0;
    /** @type {number} Timestamp (ms) marking when the character last entered a non-idle state, used to decide when to switch to the long-idle animation. */
    idleStautsStart;
    /** @type {number} Interval ID for the input/camera update loop. */
    characterInterval1;
    /** @type {number} Interval ID for the status/animation check loop. */
    characterInterval2;
    /** @type {number|null} Interval ID for the repeating snore sound during long idle. */
    snoreInterval;

    /**
     * Creates the character, loads all animation frame sets, records
     * the initial idle timestamp, and starts gravity and animation loops.
     */
    constructor() {
        super().loadImage('img/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONGIDLE);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.idleStautsStart = new Date().getTime();
        this.applyGravity();
        this.animate();
    }

    // ---------- MOVEMENT / INPUT ----------

    /**
     * Starts the two main update loops for the character: one at 60fps
     * that reads keyboard input and updates the camera position, and
     * one every 150ms that re-evaluates and applies the current status
     * animation.
     *
     * @returns {void}
     */
    animate() {

        this.characterInterval1 = setInterval(() => {
            this.checkKeyboardInput();
            this.world.camera_x = -this.x + 100;
        }, 1000 / 60);

        this.characterInterval2 = setInterval(() => {
            this.checkStatus();
        }, 150);
    }

    /**
     * Reads the current keyboard state and moves/jumps the character
     * accordingly, respecting the level boundaries. Plays the jump
     * sound when a jump is triggered.
     *
     * @returns {void}
     */
    checkKeyboardInput() {
        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.moveRight();
            this.otherDirection = false;

        }
        if (this.world.keyboard.LEFT && this.x > 0) {
            this.moveLeft();
            this.otherDirection = true;
        }

        if (this.world.keyboard.SPACE && !this.isAboveGround()) {
            AudioHub.playOne(AudioHub.PEPE_JUMPING);
            this.jump();
        }
    }

    // ---------- STATUS / ANIMATION STATE ----------

    /**
     * Determines the character's current status in priority order
     * (dead > hurt > above ground > walking > idle) and applies the
     * matching animation/sound state.
     *
     * @returns {void}
     */
    checkStatus() {
        if (this.isDead()) {
            this.setDeadStatus();
        }

        else if (this.isHurt()) {
            this.setHurtStatus();
        }

        else if (this.isAboveGround()) {
            this.setAboveGroundStatus();
        }
        else if ((this.world.keyboard.RIGHT || this.world.keyboard.LEFT)) {
            this.setWalkingStatus();
        }
        else {
            this.playIdleAnimiations();
        }
    }

    /**
     * Stops the snoring sound and plays the death animation.
     *
     * @returns {void}
     */
    setDeadStatus() {
        this.stopSnoringSound();
        this.playAnimation(this.IMAGES_DEAD);
    }

    /**
     * Stops the snoring sound, plays the hurt animation, and resets
     * the idle timer.
     *
     * @returns {void}
     */
    setHurtStatus() {
        this.stopSnoringSound();
        this.playAnimation(this.IMAGES_HURT);
        this.idleStautsStart = new Date().getTime();
    }

    /**
     * Stops the snoring sound, plays the jumping animation, and resets
     * the idle timer.
     *
     * @returns {void}
     */
    setAboveGroundStatus() {
        this.stopSnoringSound();
        this.playAnimation(this.IMAGES_JUMPING);
        this.idleStautsStart = new Date().getTime();
    }

    /**
     * Stops the snoring sound, plays the walking sound and animation,
     * and resets the idle timer.
     *
     * @returns {void}
     */
    setWalkingStatus() {
        this.stopSnoringSound();
        AudioHub.playOne(AudioHub.PEPE_WALKING);
        this.playAnimation(this.IMAGES_WALKING);
        this.idleStautsStart = new Date().getTime();
    }

    /**
     * Plays the appropriate idle animation based on how long the
     * character has been idle: the short idle animation for the first
     * 5 seconds, then the long idle ("falling asleep") animation with
     * a repeating snore sound thereafter.
     *
     * @returns {void}
     */
    playIdleAnimiations() {
        let timepassedIdleStatus = (new Date().getTime() - this.idleStautsStart) / 1000;
        if (timepassedIdleStatus > 5) {
            this.playAnimation(this.IMAGES_LONGIDLE);
            if (!this.snoreInterval) {
                this.snoreInterval = setInterval(() => {
                    AudioHub.playOne(AudioHub.PEPE_SNORE);
                }, 2000);
            }
        } else {
            this.playAnimation(this.IMAGES_IDLE);
            clearInterval(this.snoreInterval);
            this.snoreInterval = null;
        }
    }

    // ---------- SOUND ----------

    /**
     * Stops the repeating snore sound, if currently active.
     *
     * @returns {void}
     */
    stopSnoringSound() {
        if (this.snoreInterval) {
            clearInterval(this.snoreInterval);
            this.snoreInterval = null;
        }
    }

}
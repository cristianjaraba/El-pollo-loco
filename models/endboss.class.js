/**
 * Represents the final boss enemy (giant chicken). Walks left across
 * the level, and switches into an attack state when the player gets
 * close, lunging toward them while playing an attack animation and
 * sound. Reacts to being hurt and plays a death sequence once defeated.
 *
 * @extends MovableObject
 */
class Endboss extends MovableObject {
    height = 400;
    width = 250;
    y = 55;
    /** @type {number} Amount of damage this boss deals/energy it has before dying. */
    energy = 25;

    /** @type {string[]} Frames for the default walking animation. */
    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    /** @type {string[]} Frames for the death animation. */
    IMAGES_DEAD = ['img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ];
    /** @type {string[]} Frames for the hurt animation. */
    IMAGES_HURT = ['img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];
    /** @type {string[]} Frames for the alert animation (currently unused, duplicates IMAGES_WALKING). */
    IMAGES_ALERT = ['img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png'
    ];
    /** @type {string[]} Frames for the attack animation, played when close to the player. */
    IMAGES_ATTACK = ['img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png'
    ];
    /** @type {number} Interval ID for the continuous leftward movement loop. */
    endBossInterval1;
    /** @type {number} Interval ID for the status/animation check loop. */
    endBossInterval2;
    /** @type {number} Timestamp (ms) of the last attack sound played, used to throttle repeated playback. */
    lastHurtSound = 0;
    speed = 2;

    /**
     * Creates the endboss at a fixed starting x-position at the end of
     * the level, preloads all animation frame sets, and starts its
     * movement/behavior loops.
     */
    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.x = 5000;
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.animate();
    }

    // ---------- MOVEMENT / LOOP ----------

    /**
     * Starts two loops: one that continuously moves the boss left,
     * and one that re-evaluates and applies its current status
     * (dead, hurt, attacking, or walking).
     *
     * @returns {void}
     */
    animate() {
        this.endBossInterval1 = setInterval(() => {
            if (world.character.x > 4000) {
                if (world.character.x > this.x) {
                    this.moveRight();
                } else {
                    this.moveLeft();
                }
            }
        }, 1000 / 60);
        this.endBossInterval2 = setInterval(() => {
            this.checkEndbossStatus();
        }, 200);
    };

    // ---------- STATUS / BEHAVIOR ----------

    /**
     * Determines the boss's current status in priority order (dead >
     * hurt > close to player > walking) and applies the matching
     * animation, playing the death sound when it dies.
     *
     * @returns {void}
     */
    checkEndbossStatus() {
        if (this.isDead()) {
            this.playAnimation(this.IMAGES_DEAD);
            AudioHub.playOne(AudioHub.ENDBOSS_DEAD);
        }
        else if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);
        }
        else if (this.isCloseToPepe()) {
            this.setAttackStatus();
        }
        else {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }

    /**
     * Checks whether the player character is within 300px of the boss
     * on the x-axis.
     *
     * @returns {boolean} True if the player is close enough to trigger an attack.
     */
    isCloseToPepe() {
        return Math.abs(this.x - world.character.x) < 300 ||
            Math.abs(world.character.x - this.x) < 300;
    }

    // ---------- ATTACK ----------

    /**
     * Lunges the boss toward the player, plays the attack animation,
     * and triggers the (throttled) attack sound.
     *
     * @returns {void}
     */
    setAttackStatus() {
        this.x += -30;
        this.playAnimation(this.IMAGES_ATTACK);
        this.playAttackSound();
    }

    /**
     * Plays the attack sound, but at most once per second, to avoid
     * overlapping/spamming playback while the boss remains in attack range.
     *
     * @returns {void}
     */
    playAttackSound() {
        if (Date.now() - this.lastHurtSound > 1000) {
            AudioHub.playOne(AudioHub.ENDBOSS_ATTACK);
            this.lastHurtSound = Date.now();
        }
    }
}
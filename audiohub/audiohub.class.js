/**
 * Central hub for managing all audio assets in the game.
 * Provides static properties for each sound effect/track and
 * static methods to play, stop, mute, and loop sounds.
 */
class AudioHub {
    /** @type {HTMLAudioElement} Sound played when a coin is collected. */
    static COIN = new Audio('audio/pick_coin.mp3');
    /** @type {HTMLAudioElement} Sound played when a bottle is collected. */
    static BOTTLE = new Audio('audio/pick_bottle.mp3');
    /** @type {HTMLAudioElement} Sound played when a thrown bottle hits something. */
    static BOTTLE_HIT = new Audio('audio/bottle_hit.mp3');
    /** @type {HTMLAudioElement} Sound played when a bottle is thrown. */
    static BOTTLE_THROW = new Audio('audio/throw-bottle.mp3');
    /** @type {HTMLAudioElement} Sound played when an enemy dies. */
    static DEADENEMY = new Audio('audio/dead_chicken.mp3');
    /** @type {HTMLAudioElement} Sound played when Pepe gets hurt. */
    static PEPE_HURT = new Audio('audio/pepe_hurt.mp3');
    /** @type {HTMLAudioElement} Sound played when Pepe dies. */
    static PEPE_DEAD = new Audio('audio/pepe_dead.mp3');
    /** @type {HTMLAudioElement} Sound played when Pepe is idle/snoring. */
    static PEPE_SNORE = new Audio('audio/pepe-snore.mp3');
    /** @type {HTMLAudioElement} Sound played while Pepe is walking. */
    static PEPE_WALKING = new Audio('audio/pepe-walking.mp3');
    /** @type {HTMLAudioElement} Sound played when Pepe jumps. */
    static PEPE_JUMPING = new Audio('audio/pepe-jumping.mp3');
    /** @type {HTMLAudioElement} Sound played when the endboss gets hurt. */
    static ENDBOSS_HURT = new Audio('audio/endboss_hurt.mp3');
    /** @type {HTMLAudioElement} Sound played when the endboss dies. */
    static ENDBOSS_DEAD = new Audio('audio/endboss_dead.mp3');
    /** @type {HTMLAudioElement} Sound played when the endboss attacks. */
    static ENDBOSS_ATTACK = new Audio('audio/endboss_attack.mp3');
    /** @type {HTMLAudioElement} Sound played when the player wins the game. */
    static YOU_WIN = new Audio('audio/youwin.mp3');
    /** @type {HTMLAudioElement} Sound played when the game is over. */
    static GAMEOVER = new Audio('audio/gameover.mp3');
    /** @type {HTMLAudioElement} Background sound loop for chickens. */
    static CHICKEN_BG = new Audio('audio/chicken-bg.mp3');
    /** @type {HTMLAudioElement} Main background music track. */
    static BG_MUSIC = new Audio('audio/bg-music.mp3');

    /** @type {number} Interval ID used for looping a sound via {@link AudioHub.playLoop}. */
    static loopInterval;

    /** @type {boolean} Whether all sounds are currently muted. */
    static isMuted;

    /**
     * Collection of all sound instances, used for bulk operations
     * like {@link AudioHub.stopAll}, {@link AudioHub.mute}, and {@link AudioHub.unmute}.
     * @type {HTMLAudioElement[]}
     */
    static allSounds = [
        this.COIN,
        this.BOTTLE,
        this.BOTTLE_HIT,
        this.BOTTLE_THROW,
        this.DEADENEMY,
        this.PEPE_HURT,
        this.PEPE_DEAD,
        this.PEPE_SNORE,
        this.PEPE_WALKING,
        this.PEPE_JUMPING,
        this.ENDBOSS_HURT,
        this.ENDBOSS_DEAD,
        this.ENDBOSS_ATTACK,
        this.YOU_WIN,
        this.GAMEOVER,
        this.CHICKEN_BG,
        this.BG_MUSIC
    ];

    /**
     * Plays a single sound from the beginning, respecting the current mute state.
     * Any playback errors other than 'AbortError' are logged to the console.
     *
     * @param {HTMLAudioElement} sound - The sound to play.
     * @returns {void}
     */
    static playOne(sound) {
        if (this.isMuted) {
            sound.volume = 0;
        } else {
            sound.volume = 0.2;
        }
        sound.currentTime = 0;

        const promise = sound.play();

        if (promise !== undefined) {
            promise.catch(err => {
                if (err.name !== 'AbortError') {
                    console.error(err);
                }
            });
        }
    }

    /**
     * Pauses a single sound without resetting its playback position.
     *
     * @param {HTMLAudioElement} sound - The sound to stop.
     * @returns {void}
     */
    static stopOne(sound) {
        sound.pause();
    }

    /**
     * Stops all sounds, resets their playback position to the start,
     * and clears any active loop interval.
     *
     * @returns {void}
     */
    static stopAll() {
        clearInterval(this.loopInterval);
        AudioHub.allSounds.forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
    }

    /**
     * Mutes all sounds by setting their volume to 0
     * and marks the AudioHub as muted.
     *
     * @returns {void}
     */
    static mute() {
        AudioHub.allSounds.forEach(sound => {
            sound.volume = 0;
        });
        this.isMuted = true;
    }

    /**
     * Unmutes all sounds by restoring their default volume
     * and marks the AudioHub as unmuted.
     *
     * @returns {void}
     */
    static unmute() {
        AudioHub.allSounds.forEach(sound => {
            sound.volume = 0.2;
        });
        this.isMuted = false;
    }

    /**
     * Plays a sound once immediately, then repeatedly replays it
     * at a fixed interval to create a looping effect.
     *
     * @param {HTMLAudioElement} sound - The sound to loop.
     * @param {number} duration - The interval duration in milliseconds between repeats.
     * @returns {void}
     */
    static playLoop(sound, duration) {
        this.playOne(sound);
        this.loopInterval = setInterval(() => {
            this.playOne(sound)
        }, duration);
    }
}
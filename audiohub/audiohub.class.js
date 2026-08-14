class AudioHub {
    static COIN = new Audio('audio/pick_coin.mp3');
    static BOTTLE = new Audio('audio/pick_bottle.mp3');
    static BOTTLE_HIT = new Audio('audio/bottle_hit.mp3');
    static BOTTLE_THROW = new Audio('audio/throw-bottle.mp3');
    static DEADENEMY = new Audio('audio/dead_chicken.mp3');
    static PEPE_HURT = new Audio('audio/pepe_hurt.mp3');
    static PEPE_DEAD = new Audio('audio/pepe_dead.mp3');
    static PEPE_SNORE = new Audio('audio/pepe-snore.mp3');
    static PEPE_WALKING = new Audio('audio/pepe-walking.mp3');
    static PEPE_JUMPING = new Audio('audio/pepe-jumping.mp3');
    static ENDBOSS_HURT = new Audio('audio/endboss_hurt.mp3');
    static ENDBOSS_DEAD = new Audio('audio/endboss_dead.mp3');
    static YOU_WIN = new Audio('audio/youwin.mp3');
    static GAMEOVER = new Audio('audio/gameover.mp3');
    static CHICKEN_BG = new Audio('audio/chicken-bg.mp3');
    static BG_MUSIC = new Audio('audio/bg-music.mp3');
    static loopInterval;
    static isMuted; 

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
        this.YOU_WIN,
        this.GAMEOVER,
        this.CHICKEN_BG,
        this.BG_MUSIC
    ];

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

    static stopOne(sound) {
        sound.pause();
    }

    static stopAll() {
        clearInterval(this.loopInterval);
        AudioHub.allSounds.forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
    }

    static mute(){
        AudioHub.allSounds.forEach(sound => {
            sound.volume = 0;
        });
        this.isMuted = true;
    }

    static unmute(){
        AudioHub.allSounds.forEach(sound => {
            sound.volume = 0.2;
        });
        this.isMuted = false;
    }

    static playLoop(sound, duration){
        this.playOne(sound);
        this.loopInterval = setInterval(()=>{
            this.playOne(sound)
        }, duration);
    }
}
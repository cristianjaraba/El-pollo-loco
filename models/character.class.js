class Character extends MovableObject {
    y = 80;
    height = 250;
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
    IMAGES_WALKING = ['img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];
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
    world;
    speed = 10;
    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png'
    ];
    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];
    coins = 0;
    bottles = 0;
    idleStautsStart;
    characterInterval1;
    characterInterval2;
    snoreInterval;

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

    animate() {

        this.characterInterval1 = setInterval(() => {
            this.checkKeyboardInput();
            this.world.camera_x = -this.x + 100;
        }, 1000 / 60);

        this.characterInterval2 = setInterval(() => {
            this.checkStatus();
        }, 150);
    }

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

    setDeadStatus() {
        this.stopSnoringSound();
        this.playAnimation(this.IMAGES_DEAD);
    }

    setHurtStatus() {
        this.stopSnoringSound();
        this.playAnimation(this.IMAGES_HURT);
        this.idleStautsStart = new Date().getTime();
    }

    setAboveGroundStatus() {
        this.stopSnoringSound();
        this.playAnimation(this.IMAGES_JUMPING);
        this.idleStautsStart = new Date().getTime();
    }

    setWalkingStatus() {
        this.stopSnoringSound();
        AudioHub.playOne(AudioHub.PEPE_WALKING);
        this.playAnimation(this.IMAGES_WALKING);
        this.idleStautsStart = new Date().getTime();
    }

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

    stopSnoringSound() {
        if (this.snoreInterval) {
            clearInterval(this.snoreInterval);
            this.snoreInterval = null;
        }
    }

}
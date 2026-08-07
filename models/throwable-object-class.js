class ThrowableObject extends MovableObject {
    throw_sound = new Audio('./audio/throw-bottle.mp3');
    IMAGES_ROTATING = ['img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];
    IMAGES_SPLASH = ['img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];
    bottel_hit_sound = new Audio('./audio/bottle_hit.mp3');

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

    throw() {
        this.throw_sound.play();
        this.speedY = 30;
        this.applyGravity();
        let animationIntervalBottle1 = setInterval(() => {
            this.x += 5;
        }, 25);
        let animationIntervalBottle2 = setInterval(() => {
            if (this.y > 350) {
                this.playAnimation(this.IMAGES_SPLASH);
                this.bottel_hit_sound.play();

                clearInterval(animationIntervalBottle2);
            } else {
                this.playAnimation(this.IMAGES_ROTATING);
            }
        }, 100);
    }
}
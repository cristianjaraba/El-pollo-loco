class Chicken extends MovableObject {
    y = 380;
    height = 60;
    width = 60;
    IMAGES_WALKING = ['img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
            'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
            'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
        ];
    IMAGE_DEAD = "img/3_enemies_chicken/chicken_normal/2_dead/dead.png";
    energy = 5;

    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.x = 400 + Math.random() * 2500;
        this.y = Math.floor(Math.random() * (400 - 380 + 1)) + 380;
        this.speed = 0.15 + Math.random() * 0.25;
        this.loadImages(this.IMAGES_WALKING);
        this.animate();
    }

    animate() {
        let chickenInterval = setInterval(() => { 
            this.moveLeft(); 
        }, 1000 / 60);
        setInterval(() => {
            if (this.isDead()) {
                this.loadImage(this.IMAGE_DEAD);
                clearInterval(chickenInterval);
            }
            else{
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    };

}
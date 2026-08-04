class Chick extends Chicken{
    height = 40;
    width = 40;
    y = 400;
    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.x = 200 + Math.random() * 2500;
        this.speed = 0.15 + Math.random() * 0.25;
        this.IMAGES_WALKING = ['img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
            'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
            'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
        ];
        this.loadImages(this.IMAGES_WALKING);
        this.animate();
    }
}
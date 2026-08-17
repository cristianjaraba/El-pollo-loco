class Cloud extends MovableObject {
    y = 20;
    width = 500;
    height = 250;
    cloudInterval;

    constructor() {
        super().loadImage('/img/5_background/layers/4_clouds/1.png');
        this.x = Math.random() * 2500;
        this.animate();
        this.speed = Math.random() * (0.3 - 0.15) + 0.15;
    }

    animate() {
        this.cloudInterval = setInterval(() => { 
            this.moveLeft(); 
        }, 1000 / 60);
    }
}
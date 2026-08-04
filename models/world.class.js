class World {
    character = new Character();
    level = level1;
    ctx;
    canvas;
    keyboard;
    camera_x = 0;
    statusBarLife = new StatusBar(['img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png'
    ], 40, 0);
    statusBarCoins = new StatusBar(['img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png', 
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/60.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/80.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/100.png'
    ], 40, 40);
    statusBarBottles = new StatusBar(['img/7_statusbars/1_statusbar/3_statusbar_bottle/green/0.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/20.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/40.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.png'
    ], 40, 80);
    statusBarEndBoss = new StatusBar(['img/7_statusbars/2_statusbar_endboss/blue/blue0.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue20.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue40.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue60.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue80.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue100.png'
    ], 480, 5)
    throwableObjects = [];

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.run();
    }

    setWorld() {
        this.character.world = this;
    }

    run(){
        setInterval(() => {
            this.checkBottles();
            this.checkCoins();
            this.checkCollisions();
            this.checkBottleImpact();
            this.collectCoins(this.level.coins);
            this.collectBottles(this.level.bottles); 
            this.checkThrowObjects();
        }, 200);
    } 
    checkCoins(){
      this.statusBarCoins.setPercentage(this.character.coins);
    }

    checkBottles(){
        this.statusBarBottles.setPercentage(this.character.bottles)
    }

    checkThrowObjects(){
        if (this.keyboard.D && this.character.bottles > 0) {
            let throwableObject = new ThrowableObject(this.character.x + 100, this.character.y + 100);
            this.throwableObjects.push(throwableObject);
            this.character.bottles -= 20;
        }
    }

    checkCollisions(){
        this.level.enemies.forEach((enemy)=>{
                if (this.character.isColliding(enemy)) {
                    this.character.hit();
                    this.statusBarLife.setPercentage(this.character.energy);
                }
            });
    }

    checkBottleImpact(){
        let boss = this.level.enemies[this.level.enemies.length - 1];
        this.throwableObjects.forEach((element)=>{
            if (boss.isColliding(element)) {
                boss.hit();
                this.removeObjectFromArray(element.x, this.throwableObjects); 
                this.statusBarEndBoss.setPercentage(boss.energy * 4) ;
            }
        }); 
    }

    collectCoins(coinsList){
        coinsList.forEach((coin)=>{
                if (this.character.isColliding(coin)) {
                    this.character.coins += 10;  
                    this.removeObjectFromArray(coin.x, this.level.coins);
                  }
        }
        ); 
    }

    collectBottles(bottlesList){
        bottlesList.forEach((bottle)=>{
                if (this.character.isColliding(bottle)) {
                    this.character.bottles += 20;  
                    this.removeObjectFromArray(bottle.x, this.level.bottles);
                  }
        }
        ); 
    }

    removeObjectFromArray(value, array){
        const removeIndex = array.findIndex(item => item.x === value);
        array.splice(removeIndex, 1);
    }

    draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.throwableObjects);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
    this.ctx.translate(-this.camera_x, 0);

    this.addToMap(this.statusBarLife);
    this.addToMap(this.statusBarCoins);
    this.addToMap(this.statusBarBottles);
    this.addToMap(this.statusBarEndBoss);

    

    let self = this;
    requestAnimationFrame(function () {
        self.draw();
    });
}

    addObjectsToMap(objects) {
        objects.forEach(object => { this.addToMap(object); });
    }

    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);

        mo.drawFrame(this.ctx);

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}
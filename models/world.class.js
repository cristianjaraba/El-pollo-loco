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
    coin_sound = new Audio('./audio/pick_coin.mp3');
    bottle_sound = new Audio('./audio/pick_bottle.mp3');
    chicken_bg = new Audio('./audio/chicken-bg.mp3');
    dead_chicken_sound = new Audio('audio/dead_chicken.mp3');
    gameoveImg = new BackgroundObject('img/You won, you lost/Game Over.png', 0, 500, 300);
    youwinImg = new BackgroundObject('img/You won, you lost/You Win A.png', 0, 500, 300);
    gameoverSound = new Audio('audio/gameover.mp3');
    youwinSound = new Audio('audio/youwin.mp3');
    endOfgame = false;
    gameover = false;
    youwin = false;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.run();
        this.checkEndOfGame();
    }

    stopAllEnemies() {
        this.level.enemies.forEach((enemy) => {
            clearInterval(enemy.chickenInterval1);
            clearInterval(enemy.chickenInterval2);
        });
    }

    stopEndBoss() {
        clearInterval(this.level.enemies[this.level.enemies.length - 1].endBossInterval1);
        clearInterval(this.level.enemies[this.level.enemies.length - 1].endBossInterval2);
    }

    stopPepe() {
        clearInterval(this.character.characterInterval1);
        clearInterval(this.character.characterInterval2);
    }
    checkEndOfGame() {
        setInterval(() => {
            if (this.gameover == true && this.endOfgame == false) {
                this.stopAllEnemies();
                this.stopEndBoss();
                this.character.dead_sound_pepe.play();
                this.gameoverSound.play();
                this.endOfgame = true;
                this.deactivateKeyboard();
                setTimeout(() => {
                    this.stopPepe();
                }, 3000);
                this.showEndButtons();
                this.activateEndButtons();

            }
            if (this.youwin == true && this.endOfgame == false) {
                this.stopEndBoss();
                this.stopPepe();
                this.stopAllEnemies();
                this.youwinSound.play();
                this.endOfgame = true;
                this.deactivateKeyboard();
                this.showEndButtons();
                this.activateEndButtons();
            }

        }, 1000);
    }

    deactivateKeyboard(){
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
    }

    activateKeyboard(){
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
    }

    showEndButtons() {
        document.getElementById('neu_starten_btn').style.display = 'flex';
        document.getElementById('zur_startseite_btn').style.display = 'flex';
        
    }

    activateEndButtons() {
        document.getElementById('zur_startseite_btn').addEventListener('click', () => {location.reload();});
        
        document.getElementById('neu_starten_btn').addEventListener('click', () => {
            this.character.dead_sound_pepe.pause();
            this.gameoverSound.pause();
            this.character.youwinSound.pause();
            this.level.enemies[this.level.enemies.length - 1].dead_sound_boss.pause();
            startGame();
            this.reanimateEnemies();
            this.activateKeyboard();
            document.getElementById('neu_starten_btn').style.display = 'none';
            document.getElementById('zur_startseite_btn').style.display = 'none';
            
        });
    }

    reanimateEnemies(){
        this.level.enemies.forEach((enemy) => {
            enemy.animate();
        });
    }

    setWorld() {
        this.character.world = this;
    }

    run() {
        let worldInterval1 = setInterval(() => {
            this.checkBottles();
            this.checkCoins();
            this.checkCollisions();
            this.checkBottleImpactOnChicken();
            this.collectCoins(this.level.coins);
            this.collectBottles(this.level.bottles);
            this.checkThrowObjects();
        }, 200);
    }

    checkCoins() {
        this.statusBarCoins.setPercentage(this.character.coins);
    }

    checkBottles() {
        this.statusBarBottles.setPercentage(this.character.bottles)
    }

    checkThrowObjects() {
        if (this.keyboard.D && this.character.bottles > 0) {
            let throwableObject = new ThrowableObject(this.character.x + 100, this.character.y + 100);
            this.throwableObjects.push(throwableObject);
            this.character.bottles -= 20;
            this.character.idleStautsStart = new Date().getTime();
            this.character.snore.pause();
        }
    }


    checkCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy)) {
                this.character.hit();
                this.statusBarLife.setPercentage(this.character.energy);
            }
        });
        if (this.character.isDead()) {
        }
    }

    checkBottleImpactOnChicken() {
        this.throwableObjects.forEach((bottle) => {
            this.level.enemies.forEach((enemy) => {
                if (enemy.isColliding(bottle)) {
                    enemy.hit();
                    this.dead_chicken_sound.play();
                    this.removeObjectFromArray(bottle.x, this.throwableObjects);
                    if (enemy instanceof Endboss) {
                        this.statusBarEndBoss.setPercentage(enemy.energy * 4);
                    }
                    else {
                        setTimeout(() => {
                            this.removeObjectFromArray(enemy.x, this.level.enemies);
                        }, 3000);
                    }
                }
            });
        });
    }

    collectCoins(coinsList) {
        coinsList.forEach((coin) => {
            if (this.character.isColliding(coin)) {
                this.coin_sound.play();
                this.character.coins += 10;
                this.removeObjectFromArray(coin.x, this.level.coins);
            }
        }
        );
    }

    collectBottles(bottlesList) {
        bottlesList.forEach((bottle) => {
            if (this.character.isColliding(bottle)) {
                this.bottle_sound.play();
                this.character.bottles += 20;
                this.removeObjectFromArray(bottle.x, this.level.bottles);
            }
        }
        );
    }

    removeObjectFromArray(value, array) {
        const removeIndex = array.findIndex(item => item.x === value);
        array.splice(removeIndex, 1);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.throwableObjects);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);

        this.ctx.translate(-this.camera_x, 0);

        this.addToMap(this.statusBarLife);
        this.addToMap(this.statusBarCoins);
        this.addToMap(this.statusBarBottles);
        this.addToMap(this.statusBarEndBoss);

        if (this.character.isDead()) {
            this.gameoveImg.setInTheMiddle();
            this.addToMap(this.gameoveImg);
            this.gameover = true;
        }

        if (this.level.enemies[this.level.enemies.length - 1].isDead()) {
            this.youwinImg.setInTheMiddle();
            this.addToMap(this.youwinImg);
            this.youwin = true;
        }

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

        // mo.drawFrame(this.ctx);

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
class World {
    character = new Character();
    level;
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
    gameoveImg = new BackgroundObject('img/You won, you lost/Game Over.png', 0, 500, 300);
    youwinImg = new BackgroundObject('img/You won, you lost/You Win A.png', 0, 500, 300);

    endOfgame = false;
    gameover = false;
    youwin = false;
    worldInterval1;
    worldInterval2;
    endGameInterval;
    animationFrameId;
    stopPepeTimeout;
    lastHurtSound = 0;
    isPaused = false;

    constructor(canvas, keyboard) {
        this.level = new Level(
            generateEnemiesList(),
            [new Cloud(), new Cloud(), new Cloud(), new Cloud(), new Cloud()],
            generateBackgroundObjectsList(),
            generateCoinsList(),
            generateBottlesList()
        );
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.run();
        this.runSlowlier();
        this.checkEndOfGame();
    }

    setWorld() {
        this.character.world = this;
    }

    // ---------- GAME LOOP ----------

    run() {
        this.worldInterval1 = setInterval(() => {
            this.checkBottles();
            this.checkCoins();
            if (!this.checkCollisionsOnTop()) {
                this.checkCollisions();
            }
            this.checkBottleImpactOnChicken();
            this.collectCoins(this.level.coins);
            this.collectBottles(this.level.bottles);
        }, 100);
    }
    runSlowlier() {
        this.worldInterval2 = setInterval(() => {
            this.checkThrowObjects();
        }, 200);
    }

    // ---------- STATUS BARS ----------

    checkCoins() {
        this.statusBarCoins.setPercentage(this.character.coins);
    }

    checkBottles() {
        this.statusBarBottles.setPercentage(this.character.bottles)
    }

    // ---------- THROWABLE OBJECTS ----------

    checkThrowObjects() {
        if (this.keyboard.D && this.character.bottles > 0) {
            let throwableObject = new ThrowableObject(this.character.x + 100, this.character.y + 100);
            AudioHub.playOne(AudioHub.BOTTLE_THROW);
            this.throwableObjects.push(throwableObject);
            this.character.bottles -= 10;
            this.character.idleStautsStart = new Date().getTime();
        }
    }

    // ---------- COLLISIONS ----------

    checkCollisionsOnTop() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.collisionTop(enemy) &&
                !(enemy instanceof Endboss)
            ) {
                this.character.speedY = 20;
                AudioHub.playOne(AudioHub.DEADENEMY);
                enemy.hit();
                setTimeout(() => {
                    this.removeObjectFromArray(enemy.x, this.level.enemies)
                }, 300);
                return true;
            }
            return false;
        });
    }

    checkCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy)) {
                this.character.hit();
                this.statusBarLife.setPercentage(this.character.energy);
                if (Date.now() - this.lastHurtSound > 500) {
                    AudioHub.playOne(AudioHub.PEPE_HURT);
                    this.lastHurtSound = Date.now();
                }
            }

        });
    }

    setBossHitSActions(bottle, enemy) {
        this.removeObjectFromArray(bottle.x, this.throwableObjects);
        AudioHub.playOne(AudioHub.ENDBOSS_HURT);
        enemy.hit();
        this.statusBarEndBoss.setPercentage(enemy.energy * 4);
    }

    setEnemyHitActions(bottle, enemy) {
        bottle.playAnimation(bottle.IMAGES_SPLASH);
        AudioHub.playOne(AudioHub.BOTTLE_HIT);
        AudioHub.playOne(AudioHub.DEADENEMY);
        enemy.hit();
        setTimeout(() => {
            this.removeObjectFromArray(bottle.x, this.throwableObjects);
        }, 300);
        setTimeout(() => {
            this.removeObjectFromArray(enemy.x, this.level.enemies);
        }, 300);
    }

    checkBottleImpactOnChicken() {
        this.throwableObjects.forEach((bottle) => {
            this.level.enemies.forEach((enemy) => {
                if (enemy.isColliding(bottle)) {
                    if (enemy instanceof Endboss) {
                        this.setBossHitSActions(bottle, enemy);
                    }
                    else {
                        this.setEnemyHitActions(bottle, enemy);
                    }
                }
            });
        });
    }

    // ---------- COLLECTABLES ----------

    collectCoins(coinsList) {
        coinsList.forEach((coin) => {
            if (this.character.isColliding(coin)) {
                AudioHub.playOne(AudioHub.COIN);
                this.character.coins += 10;
                this.removeObjectFromArray(coin.x, this.level.coins);
            }
        }
        );
    }

    collectBottles(bottlesList) {
        bottlesList.forEach((bottle) => {
            if (this.character.isColliding(bottle)) {
                AudioHub.playOne(AudioHub.BOTTLE);
                this.character.bottles += 10;
                this.removeObjectFromArray(bottle.x, this.level.bottles);
            }
        }
        );
    }

    removeObjectFromArray(value, array) {
        const removeIndex = array.findIndex(item => item.x === value);
        array.splice(removeIndex, 1);
    }

    // ---------- STOP / CLEANUP ----------

    destroy() {
        clearInterval(this.worldInterval1);
        clearInterval(this.worldInterval2);
        clearInterval(this.endGameInterval);
        cancelAnimationFrame(this.animationFrameId);
    }
    stopCollectableObjects() {
        this.level.bottles.forEach((bottle) => { clearInterval(bottle.collectablesInterval); });
        this.level.coins.forEach((coin) => { clearInterval(coin.collectablesInterval); });
    }

    stopAllEnemies() {
        this.level.enemies.forEach((enemy) => {
            clearInterval(enemy.chickenInterval1);
            clearInterval(enemy.chickenInterval2);
        });
    }

    stopEndBoss() {
        const endBoss = this.level.enemies.find(enemy => enemy instanceof Endboss);
        if (endBoss) {
            clearInterval(endBoss.endBossInterval1);
            clearInterval(endBoss.endBossInterval2);
        }
    }

    stopPepe() {
        clearInterval(this.character.characterInterval1);
        clearInterval(this.character.characterInterval2);
        clearInterval(this.character.gravityInterval);
        this.character.stopSnoringSound();
        clearTimeout(this.stopPepeTimeout);
    }
    stopClouds() {
        this.level.clouds.forEach((cloud) => {
            clearInterval(cloud.cloudInterval);
        });
    }
    stopThrowableObjects() {
        this.throwableObjects.forEach((bottle) => {
            clearInterval(bottle.animationIntervalBottle1);
            clearInterval(bottle.animationIntervalBottle2);
            clearInterval(bottle.gravityInterval);
        });
    }
    stopAllMovableObjects() {
        this.stopThrowableObjects();
        this.stopAllEnemies();
        this.stopEndBoss();
        this.stopCollectableObjects();
        this.stopPepe();
        this.stopClouds();
    }
    unpauseAllMovableObjects(){
        this.throwableObjects.forEach((bottle) => {bottle.setImg();});
        this.level.enemies.forEach((enemy)=>{enemy.animate();});
        this.level.bottles.forEach((bottle) => {bottle.setImg();});
        this.level.coins.forEach((coin) => {coin.setImg();});
        this.character.animate();
        this.character.applyGravity();
        this.level.clouds.forEach((cloud) => {cloud.animate();});
    }
    clearWorldIntervals() {
        clearInterval(this.worldInterval1);
        clearInterval(this.worldInterval2);
    }

    // ---------- END OF GAME STATE ----------

    checkEndOfGame() {
        this.endGameInterval = setInterval(() => {
            if (this.gameover == true && this.endOfgame == false) {
                this.setGameOverStates();
                return;
            }
            if (this.youwin == true && this.endOfgame == false) {
                this.setYouWinStates();
                return;
            }
        }, 1000);
    }

    setGameOverStates() {
        this.stopAllMovableObjects();
        this.clearWorldIntervals();
        this.endOfgame = true;
        this.switchToEndState();
        clearInterval(this.endGameInterval);
        this.playEndAudios();
    }
    setYouWinStates() {
        this.stopAllMovableObjects();
        this.clearWorldIntervals();
        this.endOfgame = true;
        this.switchToEndState();
        clearInterval(this.endGameInterval);
        this.playEndAudios();
    }

    switchToEndState() {
        this.deactivateKeyboard();
        this.showEndButtons();
        this.activateEndButtons();
    }

    playEndAudios() {
        if (this.gameover == true) {
            AudioHub.stopAll();
            AudioHub.playOne(AudioHub.PEPE_DEAD);
            AudioHub.playOne(AudioHub.GAMEOVER);
            return;
        }
        if (this.youwin == true) {
            AudioHub.stopAll();
            AudioHub.playOne(AudioHub.ENDBOSS_DEAD);
            AudioHub.playOne(AudioHub.YOU_WIN);
            return;
        }
    }

    // ---------- KEYBOARD ----------

    deactivateKeyboard() {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);
    }

    activateKeyboard() {
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
    }

    // ---------- END BUTTONS ----------

    showEndButtons() {
        document.getElementById('neu_starten_btn').style.display = 'flex';
        document.getElementById('zur_startseite_btn').style.display = 'flex';

    }

    goToStartScreen() {
        AudioHub.stopAll();
        this.destroy();
        init();
        document.getElementById('neu_starten_btn').style.display = 'none';
        document.getElementById('zur_startseite_btn').style.display = 'none';
        document.getElementById('full-screen-btn').style.display = 'none';
        document.getElementById('play-pause-btn').style.display = 'none';
        keyboard = new Keyboard();
        world.activateKeyboard();
        hideVolumeBtns();
    }

    restartGame() {
        AudioHub.stopAll();
        document.getElementById('neu_starten_btn').style.display = 'none';
        document.getElementById('zur_startseite_btn').style.display = 'none';
        document.getElementById('full-screen-btn').style.display = 'flex';
        this.destroy();
        keyboard = new Keyboard();
        world = new World(canvas, keyboard);
        world.activateKeyboard();
        AudioHub.playOne(AudioHub.CHICKEN_BG);
        AudioHub.playLoop(AudioHub.BG_MUSIC, 21000);
    }

    activateEndButtons() {
        document.getElementById('zur_startseite_btn').onclick = () => this.goToStartScreen();
        document.getElementById('neu_starten_btn').onclick = () => this.restartGame();
    }

    // ---------- RENDERING ----------

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.renderCameraView();
        this.addStatusBarsToMapp();
        this.addGameOverToMap();
        this.addYouWinnToMap();
        let self = this;
        this.animationFrameId = requestAnimationFrame(function () {
            self.draw();
        });
    }

    renderCameraView() {
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.coins);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.throwableObjects);
        this.ctx.translate(-this.camera_x, 0);
    }

    addStatusBarsToMapp(){
        const endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
        this.addToMap(this.statusBarLife);
        this.addToMap(this.statusBarCoins);
        this.addToMap(this.statusBarBottles);
        if (endboss && this.isVisible(endboss)) {
            this.addToMap(this.statusBarEndBoss);
        }
    }

    addGameOverToMap(){
        if (this.character.isDead()) {
            this.gameoveImg.setInTheMiddle();
            this.addToMap(this.gameoveImg);
            this.gameover = true;
        }
    }

    addYouWinnToMap(){
        const endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
        if (endboss && endboss.isDead()) {
            this.youwinImg.setInTheMiddle();
            this.addToMap(this.youwinImg);
            this.youwin = true;
        }
    }

    isVisible(boss) {
        const screenX = boss.x + this.camera_x;
        return screenX + boss.width > 0 &&
            screenX < 720;
    }

    addObjectsToMap(objects) {
        objects.forEach(object => { this.addToMap(object); });
    }

    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);

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
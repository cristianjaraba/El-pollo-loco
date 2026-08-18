/**
 * The main game world/orchestrator. Owns the character, level, status
 * bars, throwable objects, and the render/update loops. Handles
 * collision detection, collectable pickup, throwing bottles, and
 * rendering everything to the canvas. Pausing, cleanup, keyboard
 * control, and end-of-game housekeeping are delegated to {@link Helper}.
 */
class World {
    /** @type {Character} The player character. */
    character = new Character();
    /** @type {Level} The current level data (enemies, clouds, background, collectables). */
    level;
    /** @type {CanvasRenderingContext2D} The 2D rendering context for the game canvas. */
    ctx;
    /** @type {HTMLCanvasElement} The game canvas element. */
    canvas;
    /** @type {Keyboard} The shared keyboard input state. */
    keyboard;
    /** @type {number} Horizontal camera offset used to scroll the world with the character. */
    camera_x = 0;
    /** @type {StatusBar} Status bar showing the character's health. */
    statusBarLife = new StatusBar(['img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png'
    ], 40, 0);
    /** @type {StatusBar} Status bar showing collected coins. */
    statusBarCoins = new StatusBar(['img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/60.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/80.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/100.png'
    ], 40, 40);
    /** @type {StatusBar} Status bar showing collected bottles. */
    statusBarBottles = new StatusBar(['img/7_statusbars/1_statusbar/3_statusbar_bottle/green/0.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/20.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/40.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.png'
    ], 40, 80);
    /** @type {StatusBar} Status bar showing the endboss's remaining energy, only shown while the boss is visible. */
    statusBarEndBoss = new StatusBar(['img/7_statusbars/2_statusbar_endboss/blue/blue0.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue20.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue40.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue60.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue80.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue100.png'
    ], 480, 5)
    /** @type {ThrowableObject[]} Currently active thrown bottles. */
    throwableObjects = [];
    /** @type {BackgroundObject} The "Game Over" overlay image. */
    gameoveImg = new BackgroundObject('img/You won, you lost/Game Over.png', 0, 500, 300);
    /** @type {BackgroundObject} The "You Win" overlay image. */
    youwinImg = new BackgroundObject('img/You won, you lost/You Win A.png', 0, 500, 300);

    /** @type {boolean} Whether the game has fully ended (either won or lost) and end-state cleanup has run. */
    endOfgame = false;
    /** @type {boolean} Whether the player has died. */
    gameover = false;
    /** @type {boolean} Whether the player has defeated the endboss. */
    youwin = false;
    /** @type {number} Interval ID for the main (fast) game update loop. */
    worldInterval1;
    /** @type {number} Interval ID for the slower update loop (throwable objects). */
    worldInterval2;
    /** @type {number} Interval ID for polling the end-of-game condition. */
    endGameInterval;
    /** @type {number} Animation frame ID for the render loop, used to cancel it on destroy. */
    animationFrameId;
    /** @type {number} Timeout ID reserved for delayed character-stop logic (currently unused/cleared only). */
    stopPepeTimeout;
    /** @type {number} Timestamp (ms) of the last time the "Pepe hurt" sound played, used to throttle repeated playback. */
    lastHurtSound = 0;
    /** @type {boolean} Whether the game is currently paused. */
    isPaused = false;
    /** @type {Helper} Manages pausing, cleanup, keyboard control, and end-of-game transitions for this world. */
    helper;

    /**
     * Creates the game world: builds the level (enemies, clouds,
     * background, coins, bottles), binds the canvas and keyboard, and
     * starts the render and update loops.
     *
     * @param {HTMLCanvasElement} canvas - The canvas to render the game onto.
     * @param {Keyboard} keyboard - The shared keyboard input state.
     */
    constructor(canvas, keyboard) {
        this.helper = new Helper(this);
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
        this.helper.checkEndOfGame();
    }

    /**
     * Gives the character a reference back to this world, so it can
     * read keyboard state, level bounds, and camera position.
     *
     * @returns {void}
     */
    setWorld() {
        this.character.world = this;
    }

    // ---------- GAME LOOP ----------

    /**
     * Starts the main game update loop (every 100ms): refreshes the
     * coin/bottle status bars, checks collisions (top-stomp first,
     * falling back to side collisions), checks bottle-vs-enemy impacts,
     * and handles collectable pickups.
     *
     * @returns {void}
     */
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
    /**
     * Starts the slower update loop (every 200ms) that checks for and
     * handles bottle-throwing input.
     *
     * @returns {void}
     */
    runSlowlier() {
        this.worldInterval2 = setInterval(() => {
            this.checkThrowObjects();
        }, 200);
    }

    // ---------- STATUS BARS ----------

    /**
     * Syncs the coin status bar with the character's current coin count.
     *
     * @returns {void}
     */
    checkCoins() {
        this.statusBarCoins.setPercentage(this.character.coins);
    }

    /**
     * Syncs the bottle status bar with the character's current bottle count.
     *
     * @returns {void}
     */
    checkBottles() {
        this.statusBarBottles.setPercentage(this.character.bottles)
    }

    // ---------- THROWABLE OBJECTS ----------

    /**
     * If the throw key is pressed and the character has bottles,
     * spawns a new thrown bottle near the character, plays the throw
     * sound, deducts bottle "ammo", and resets the idle timer.
     *
     * @returns {void}
     */
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

    /**
     * Checks whether the character is landing on top of any non-boss
     * enemy; if so, bounces the character up, plays the defeat sound,
     * damages the enemy, and removes it from the level shortly after.
     *
     * Note: due to `forEach`'s return value being discarded, this
     * method always returns `undefined` (falsy) regardless of whether
     * a top-collision occurred, so the caller's `if (!checkCollisionsOnTop())`
     * always falls through to {@link World#checkCollisions} as well.
     *
     * @returns {void}
     */
    checkCollisionsOnTop() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.collisionTop(enemy) &&
                !(enemy instanceof Endboss)
            ) {
                this.character.speedY = 20;
                AudioHub.playOne(AudioHub.DEADENEMY);
                enemy.hit();
                setTimeout(() => {
                    this.helper.removeObjectFromArray(enemy.x, this.level.enemies)
                }, 300);
                return true;
            }
            return false;
        });
    }

    /**
     * Checks whether the character is side-colliding with any enemy;
     * if so, damages the character, updates the health status bar,
     * and plays the hurt sound (throttled to once per 500ms).
     *
     * @returns {void}
     */
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

    /**
     * Handles a bottle hitting the endboss: removes the bottle, plays
     * the boss-hurt sound, damages the boss, and updates its status bar.
     *
     * @param {ThrowableObject} bottle - The bottle that hit the boss.
     * @param {Endboss} enemy - The endboss that was hit.
     * @returns {void}
     */
    setBossHitSActions(bottle, enemy) {
        this.helper.removeObjectFromArray(bottle.x, this.throwableObjects);
        AudioHub.playOne(AudioHub.ENDBOSS_HURT);
        enemy.hit();
        this.statusBarEndBoss.setPercentage(enemy.energy * 4);
    }

    /**
     * Handles a bottle hitting a regular enemy: plays the splash
     * animation, impact and defeat sounds, damages the enemy, and
     * removes both the bottle and the enemy shortly after.
     *
     * @param {ThrowableObject} bottle - The bottle that hit the enemy.
     * @param {Chicken|Chick} enemy - The enemy that was hit.
     * @returns {void}
     */
    setEnemyHitActions(bottle, enemy) {
        bottle.playAnimation(bottle.IMAGES_SPLASH);
        AudioHub.playOne(AudioHub.BOTTLE_HIT);
        AudioHub.playOne(AudioHub.DEADENEMY);
        enemy.hit();
        setTimeout(() => {
            this.helper.removeObjectFromArray(bottle.x, this.throwableObjects);
        }, 300);
        setTimeout(() => {
            this.helper.removeObjectFromArray(enemy.x, this.level.enemies);
        }, 300);
    }

    /**
     * Checks every thrown bottle against every enemy for collisions,
     * dispatching to the boss-specific or regular-enemy hit handler
     * as appropriate.
     *
     * @returns {void}
     */
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

    /**
     * Checks the character against each coin in the given list;
     * on collision, plays the coin sound, credits the character,
     * and removes the coin from the level.
     *
     * @param {CollectableObject[]} coinsList - The coins to check.
     * @returns {void}
     */
    collectCoins(coinsList) {
        coinsList.forEach((coin) => {
            if (this.character.isColliding(coin)) {
                AudioHub.playOne(AudioHub.COIN);
                this.character.coins += 10;
                this.helper.removeObjectFromArray(coin.x, this.level.coins);
            }
        }
        );
    }

    /**
     * Checks the character against each bottle in the given list;
     * on collision, plays the bottle sound, credits the character,
     * and removes the bottle from the level.
     *
     * @param {CollectableObject[]} bottlesList - The bottles to check.
     * @returns {void}
     */
    collectBottles(bottlesList) {
        bottlesList.forEach((bottle) => {
            if (this.character.isColliding(bottle)) {
                AudioHub.playOne(AudioHub.BOTTLE);
                this.character.bottles += 10;
                this.helper.removeObjectFromArray(bottle.x, this.level.bottles);
            }
        }
        );
    }

    // ---------- RENDERING ----------

    /**
     * Clears the canvas and redraws the full scene (camera view,
     * status bars, and end-of-game overlays) every animation frame.
     *
     * @returns {void}
     */
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

    /**
     * Draws all camera-relative content (background layers, clouds,
     * coins, the character, enemies, bottles, and thrown bottles),
     * translating the canvas by the current camera offset for the
     * duration of the draw calls.
     *
     * @returns {void}
     */
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

    /**
     * Draws the health, coin, and bottle status bars, and the endboss
     * status bar as well if the boss exists and is currently visible
     * on screen.
     *
     * @returns {void}
     */
    addStatusBarsToMapp(){
        const endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
        this.addToMap(this.statusBarLife);
        this.addToMap(this.statusBarCoins);
        this.addToMap(this.statusBarBottles);
        if (endboss && this.isVisible(endboss)) {
            this.addToMap(this.statusBarEndBoss);
        }
    }

    /**
     * If the character is dead, centers and draws the "Game Over"
     * overlay and marks {@link World#gameover} as true.
     *
     * @returns {void}
     */
    addGameOverToMap(){
        if (this.character.isDead()) {
            this.gameoveImg.setInTheMiddle();
            this.addToMap(this.gameoveImg);
            this.gameover = true;
        }
    }

    /**
     * If the endboss exists and is dead, centers and draws the
     * "You Win" overlay and marks {@link World#youwin} as true.
     *
     * @returns {void}
     */
    addYouWinnToMap(){
        const endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
        if (endboss && endboss.isDead()) {
            this.youwinImg.setInTheMiddle();
            this.addToMap(this.youwinImg);
            this.youwin = true;
        }
    }

    /**
     * Checks whether the given object is currently within the visible
     * horizontal bounds of the 720px-wide canvas, accounting for the
     * current camera offset.
     *
     * @param {MovableObject} boss - The object to check visibility for.
     * @returns {boolean} True if the object is at least partially on screen.
     */
    isVisible(boss) {
        const screenX = boss.x + this.camera_x;
        return screenX + boss.width > 0 &&
            screenX < 720;
    }

    /**
     * Draws each object in the given list onto the canvas.
     *
     * @param {DrawableObject[]} objects - The objects to draw.
     * @returns {void}
     */
    addObjectsToMap(objects) {
        objects.forEach(object => { this.addToMap(object); });
    }

    /**
     * Draws a single object onto the canvas, flipping it horizontally
     * around its drawing first if it's currently facing the "other"
     * direction.
     *
     * @param {DrawableObject} mo - The object to draw.
     * @returns {void}
     */
    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    /**
     * Applies a horizontal flip transform to the canvas context
     * around the given object, and inverts its x-coordinate so it
     * draws correctly mirrored. Must be paired with a call to
     * {@link World#flipImageBack} after drawing.
     *
     * @param {DrawableObject} mo - The object being flipped.
     * @returns {void}
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Reverts the x-coordinate inversion and restores the canvas
     * context state set up by {@link World#flipImage}.
     *
     * @param {DrawableObject} mo - The object that was flipped.
     * @returns {void}
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}
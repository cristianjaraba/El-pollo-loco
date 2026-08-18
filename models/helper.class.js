/**
 * Manages the game's lifecycle around a {@link World} instance: pausing
 * and resuming all movable/animated objects, tearing down intervals,
 * end-of-game state transitions, keyboard activation, and end-of-game
 * UI/navigation (restart, back to start). Keeps {@link World} focused
 * on simulation and rendering while this class owns "start/stop/transition"
 * concerns.
 */
class Helper {
    /** @type {World} Reference to the game world this helper operates on. */
    world;

    /**
     * @param {World} world - The game world instance to manage.
     */
    constructor(world) {
        this.world = world;
    }

    // ---------- PLAY~PAUSE / STOP / CLEANUP ----------

    /**
     * Fully tears down the world's own loops: clears the update
     * intervals, the end-of-game poll interval, and cancels the
     * render animation frame. Does not stop individual game objects'
     * own intervals — use {@link Helper#stopAllMovableObjects} for that.
     *
     * @returns {void}
     */
    destroy() {
        clearInterval(this.world.worldInterval1);
        clearInterval(this.world.worldInterval2);
        clearInterval(this.world.endGameInterval);
        cancelAnimationFrame(this.world.animationFrameId);
    }

    /**
     * Stops the shimmer animation loops on all remaining collectable
     * bottles and coins.
     *
     * @returns {void}
     */
    stopCollectableObjects() {
        this.world.level.bottles.forEach((bottle) => { clearInterval(bottle.collectablesInterval); });
        this.world.level.coins.forEach((coin) => { clearInterval(coin.collectablesInterval); });
    }

    /**
     * Stops the movement and animation loops on all non-boss enemies.
     *
     * @returns {void}
     */
    stopAllEnemies() {
        this.world.level.enemies.forEach((enemy) => {
            clearInterval(enemy.chickenInterval1);
            clearInterval(enemy.chickenInterval2);
        });
    }

    /**
     * Stops the movement and status loops on the endboss, if present
     * in the current level.
     *
     * @returns {void}
     */
    stopEndBoss() {
        const endBoss = this.world.level.enemies.find(enemy => enemy instanceof Endboss);
        if (endBoss) {
            clearInterval(endBoss.endBossInterval1);
            clearInterval(endBoss.endBossInterval2);
        }
    }

    /**
     * Stops the character's input, status, and gravity loops, silences
     * its snoring sound, and clears any pending stop timeout.
     *
     * @returns {void}
     */
    stopPepe() {
        clearInterval(this.world.character.characterInterval1);
        clearInterval(this.world.character.characterInterval2);
        clearInterval(this.world.character.gravityInterval);
        this.world.character.stopSnoringSound();
        clearTimeout(this.world.stopPepeTimeout);
    }

    /**
     * Stops the drift animation loop on all background clouds.
     *
     * @returns {void}
     */
    stopClouds() {
        this.world.level.clouds.forEach((cloud) => {
            clearInterval(cloud.cloudInterval);
        });
    }

    /**
     * Stops the drift, animation, and gravity loops on all currently
     * active thrown bottles.
     *
     * @returns {void}
     */
    stopThrowableObjects() {
        this.world.throwableObjects.forEach((bottle) => {
            clearInterval(bottle.animationIntervalBottle1);
            clearInterval(bottle.animationIntervalBottle2);
            clearInterval(bottle.gravityInterval);
        });
    }

    /**
     * Pauses the game by stopping every movable/animated object's
     * loops: thrown bottles, enemies, the endboss, collectables, the
     * character, and clouds.
     *
     * @returns {void}
     */
    stopAllMovableObjects() {
        this.stopThrowableObjects();
        this.stopAllEnemies();
        this.stopEndBoss();
        this.stopCollectableObjects();
        this.stopPepe();
        this.stopClouds();
    }

    /**
     * Resumes the game after a pause by restarting every object's
     * animation/movement loops: thrown bottles, enemies, collectables,
     * the character (including gravity), and clouds.
     *
     * @returns {void}
     */
    unpauseAllMovableObjects() {
        this.world.throwableObjects.forEach((bottle) => { bottle.setImg(); });
        this.world.level.enemies.forEach((enemy) => { enemy.animate(); });
        this.world.level.bottles.forEach((bottle) => { bottle.setImg(); });
        this.world.level.coins.forEach((coin) => { coin.setImg(); });
        this.world.character.animate();
        this.world.character.applyGravity();
        this.world.level.clouds.forEach((cloud) => { cloud.animate(); });
    }

    /**
     * Clears just the world's own main update intervals (without
     * touching individual game objects or the render loop).
     *
     * @returns {void}
     */
    clearWorldIntervals() {
        clearInterval(this.world.worldInterval1);
        clearInterval(this.world.worldInterval2);
    }

    // ---------- UTILITY ----------

    /**
     * Removes the first object from an array whose `x` property
     * matches the given value.
     *
     * @param {number} value - The `x` value identifying the object to remove.
     * @param {Array<Object>} array - The array to remove the object from.
     * @returns {void}
     */
    removeObjectFromArray(value, array) {
        const removeIndex = array.findIndex(item => item.x === value);
        array.splice(removeIndex, 1);
    }

    // ---------- END OF GAME STATE ----------

    /**
     * Starts a polling loop (every second) that checks whether the
     * game has been lost or won, and triggers the corresponding
     * end-of-game state transition exactly once.
     *
     * @returns {void}
     */
    checkEndOfGame() {
        this.world.endGameInterval = setInterval(() => {
            if (this.world.gameover == true && this.world.endOfgame == false) {
                this.setGameOverStates();
                return;
            }
            if (this.world.youwin == true && this.world.endOfgame == false) {
                this.setYouWinStates();
                return;
            }
        }, 1000);
    }

    /**
     * Transitions the world into the "game over" end state: stops all
     * movement, clears update intervals, marks the game as ended,
     * switches to the end-of-game UI, and plays the game-over audio.
     *
     * @returns {void}
     */
    setGameOverStates() {
        this.stopAllMovableObjects();
        this.clearWorldIntervals();
        this.world.endOfgame = true;
        this.switchToEndState();
        clearInterval(this.world.endGameInterval);
        this.playEndAudios();
    }

    /**
     * Transitions the world into the "you win" end state: stops all
     * movement, clears update intervals, marks the game as ended,
     * switches to the end-of-game UI, and plays the victory audio.
     *
     * @returns {void}
     */
    setYouWinStates() {
        this.stopAllMovableObjects();
        this.clearWorldIntervals();
        this.world.endOfgame = true;
        this.switchToEndState();
        clearInterval(this.world.endGameInterval);
        this.playEndAudios();
    }

    /**
     * Common end-of-game UI transition: disables keyboard input and
     * reveals/activates the "restart" and "back to start" buttons.
     *
     * @returns {void}
     */
    switchToEndState() {
        this.deactivateKeyboard();
        this.showEndButtons();
        this.activateEndButtons();
    }

    /**
     * Plays the appropriate end-of-game audio sequence depending on
     * whether the player lost ({@link World#gameover}) or won
     * ({@link World#youwin}), stopping all other audio first.
     *
     * @returns {void}
     */
    playEndAudios() {
        if (this.world.gameover == true) {
            AudioHub.stopAll();
            AudioHub.playOne(AudioHub.PEPE_DEAD);
            AudioHub.playOne(AudioHub.GAMEOVER);
            return;
        }
        if (this.world.youwin == true) {
            AudioHub.stopAll();
            AudioHub.playOne(AudioHub.ENDBOSS_DEAD);
            AudioHub.playOne(AudioHub.YOU_WIN);
            return;
        }
    }

    // ---------- KEYBOARD ----------

    /**
     * Removes the global keydown/keyup listeners, disabling character
     * control via the keyboard.
     *
     * @returns {void}
     */
    deactivateKeyboard() {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);
    }

    /**
     * Adds the global keydown/keyup listeners, enabling character
     * control via the keyboard.
     *
     * @returns {void}
     */
    activateKeyboard() {
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
    }

    // ---------- END BUTTONS ----------

    /**
     * Reveals the "restart" and "back to start" buttons.
     *
     * @returns {void}
     */
    showEndButtons() {
        document.getElementById('neu_starten_btn').style.display = 'flex';
        document.getElementById('zur_startseite_btn').style.display = 'flex';
    }

    /**
     * Returns to the start screen: stops all audio, tears down the
     * world, re-initializes the start UI, hides in-game controls, and
     * resets keyboard state.
     *
     * @returns {void}
     */
    goToStartScreen() {
        AudioHub.stopAll();
        this.destroy();
        init();
        document.getElementById('neu_starten_btn').style.display = 'none';
        document.getElementById('zur_startseite_btn').style.display = 'none';
        document.getElementById('full-screen-btn').style.display = 'none';
        document.getElementById('play-pause-btn').style.display = 'none';

        keyboard = new Keyboard();
        world.helper.activateKeyboard();
        hideVolumeBtns();
    }

    /**
     * Restarts the game from scratch: stops all audio, hides
     * end-of-game buttons, tears down the current world, and creates
     * a fresh {@link World} with a new keyboard and background audio.
     *
     * @returns {void}
     */
    restartGame() {
        AudioHub.stopAll();
        document.getElementById('neu_starten_btn').style.display = 'none';
        document.getElementById('zur_startseite_btn').style.display = 'none';
        document.getElementById('full-screen-btn').style.display = 'flex';
        this.destroy();
        keyboard = new Keyboard();
        world = new World(canvas, keyboard);
        world.helper.activateKeyboard();
        AudioHub.playOne(AudioHub.CHICKEN_BG);
        AudioHub.playLoop(AudioHub.BG_MUSIC, 21000);
    }

    /**
     * Wires up the click handlers for the "back to start" and
     * "restart" end-of-game buttons.
     *
     * @returns {void}
     */
    activateEndButtons() {
        document.getElementById('zur_startseite_btn').onclick = () => this.goToStartScreen();
        document.getElementById('neu_starten_btn').onclick = () => this.restartGame();
    }
}
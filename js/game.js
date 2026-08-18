// ---------- DOM REFERENCES ----------

const dialog = document.getElementById('dialog');
const rotateIcon = document.getElementById('mobile_rotate_icon');
const title = document.querySelector('h1');
const canvasWrapper = document.querySelector('.canvas-wrapper');
const impressumBtn = document.querySelector('.impressum_btn');
const arrowsContainerRef = document.getElementById('arrows-container');
const throwContainerRef = document.getElementById('throw-container');
const btnUpRef = document.getElementById('up_btn');
const btnLeftRef = document.getElementById('left_btn');
const btnRightRef = document.getElementById('right_btn');
const THROWABLERightRef = document.getElementById('throw_btn');

// ---------- MEDIA QUERIES ----------

/** @type {MediaQueryList} Matches touch devices in portrait orientation. */
const portraitQuery = window.matchMedia('(hover: none) and (orientation: portrait)');
/** @type {MediaQueryList} Matches touch devices in landscape orientation. */
const landscapeQuery = window.matchMedia('(hover: none) and (orientation: landscape)');

// ---------- GLOBAL STATE ----------

/** @type {World} The current game world instance, created on game start. */
let world;
/** @type {Keyboard} Tracks the current pressed/released state of control keys. */
let keyboard = new Keyboard();
/** @type {boolean} Whether sound is currently enabled, based on stored user preference. */
let sound = getSoundFromLocalStorage();

// ---------- GAME START / INIT ----------

/**
 * Starts the game by creating a new World instance bound to the canvas,
 * revealing the volume and play/pause controls, showing the fullscreen
 * button, and applying the correct layout for the current orientation.
 *
 * @returns {void}
 */
function startGame() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
    showVolumeBtns();
    showPlayPauseBtn();
    document.getElementById('full-screen-btn').style.display = 'flex';
    handleOrientationChange();
}

/**
 * Initializes the start screen: applies the correct orientation layout,
 * shows the start screen image and buttons, and wires up the click
 * handler that begins the game and starts the background audio.
 *
 * @returns {void}
 */
function init() {
    handleOrientationChange();
    document.getElementById('start_img').style.display = 'flex';
    document.getElementById('start_btn').style.display = 'flex';
    document.getElementById('anleitung_btn').style.display = 'flex';

    document.getElementById('start_btn').onclick = () => {
        document.getElementById('start_img').style.display = 'none';
        document.getElementById('start_btn').style.display = 'none';
        document.getElementById('anleitung_btn').style.display = 'none';

        startGame();
        AudioHub.playOne(AudioHub.CHICKEN_BG);
        AudioHub.playLoop(AudioHub.BG_MUSIC, 21000);
    };
}

// ---------- SOUND / VOLUME ----------

/**
 * Reads the stored sound preference from localStorage and syncs
 * {@link AudioHub.isMuted} accordingly. Defaults to sound enabled
 * (and {@link AudioHub.isMuted} set to false) if no value is stored.
 *
 * Note: the return value follows the stored 'sound' flag directly,
 * where `true` means unmuted and no stored value also resolves to `true`.
 *
 * @returns {boolean} Whether sound should be considered "on".
 */
function getSoundFromLocalStorage() {

    let data = localStorage.getItem('sound');

    if (data != null) {
        if (data == 'true') {
            AudioHub.isMuted = false;
            return true;
        }
        else {
            AudioHub.isMuted = true;
            return false;
        }
    }
    else {
        AudioHub.isMuted = false;
        return true;
    }
}

/**
 * Shows the correct volume icon (on/off) based on the current
 * `sound` state, hiding the other one.
 *
 * @returns {void}
 */
function showVolumeBtns() {
    if (sound) {
        document.getElementById('volume-off').style.display = 'none';
        document.getElementById('volume-on').style.display = 'flex';
    } else {
        document.getElementById('volume-off').style.display = 'flex';
        document.getElementById('volume-on').style.display = 'none';
    }
}

/**
 * Hides both the volume-on and volume-off buttons.
 *
 * @returns {void}
 */
function hideVolumeBtns() {
    document.getElementById('volume-off').style.display = 'none';
    document.getElementById('volume-on').style.display = 'none';
}

/**
 * Reveals the play/pause button.
 *
 * @returns {void}
 */
function showPlayPauseBtn() {
    document.getElementById('play-pause-btn').style.display = 'flex';
}

// ---------- KEYBOARD ----------

/**
 * Handles the `keydown` event and sets the corresponding
 * {@link Keyboard} property to `true` based on the pressed key code.
 *
 * @param {KeyboardEvent} event - The keydown event.
 * @returns {void}
 */
function handleKeyDown(event) {
    switch (event.keyCode) {
        case 68:
            keyboard.D = true;
            break;
        case 40:
            keyboard.DOWN = true;
            break;
        case 38:
            keyboard.UP = true;
            break;
        case 39:
            keyboard.RIGHT = true;
            break;
        case 37:
            keyboard.LEFT = true;
            break;
        case 32:
            keyboard.SPACE = true;
            break;
        default:
            break;
    }
}

/**
 * Handles the `keyup` event and sets the corresponding
 * {@link Keyboard} property to `false` based on the released key code.
 *
 * @param {KeyboardEvent} event - The keyup event.
 * @returns {void}
 */
function handleKeyUp(event) {
    switch (event.keyCode) {
        case 68:
            keyboard.D = false;
            break;
        case 40:
            keyboard.DOWN = false;
            break;
        case 38:
            keyboard.UP = false;
            break;
        case 39:
            keyboard.RIGHT = false;
            break;
        case 37:
            keyboard.LEFT = false;
            break;
        case 32:
            keyboard.SPACE = false;
            break;
        default:
            break;
    }
}

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

// ---------- TOUCH / MOBILE CONTROLS ----------

/**
 * Wires up touch event listeners on a control element so that touching
 * it sets the given {@link Keyboard} property to `true`, and releasing
 * or cancelling the touch sets it back to `false`.
 *
 * @param {HTMLElement} element - The touch control element (e.g. an arrow button).
 * @param {string} keyProp - The {@link Keyboard} property to toggle (e.g. 'LEFT', 'RIGHT', 'SPACE', 'D').
 * @returns {void}
 */
function addTouchControl(element, keyProp) {
    element.addEventListener('touchstart', function() {
        keyboard[keyProp] = true;
    });
    element.addEventListener('touchend', function() {
        keyboard[keyProp] = false;
    });
    element.addEventListener('touchcancel', function() {
        keyboard[keyProp] = false;
    });
}

addTouchControl(btnLeftRef, 'LEFT');
addTouchControl(btnRightRef, 'RIGHT');
addTouchControl(btnUpRef, 'SPACE');
addTouchControl(THROWABLERightRef, 'D');

// ---------- ORIENTATION / RESPONSIVE LAYOUT ----------

/**
 * Applies the layout used on touch devices in portrait orientation:
 * shows the rotate-device prompt and hides the title, canvas, and
 * impressum link, since the game isn't playable in this orientation.
 *
 * @param {SVGElement} rotateIcon - The "please rotate your device" icon element.
 * @param {HTMLElement} title - The page title element.
 * @param {HTMLElement} canvasWrapper - The wrapper element containing the game canvas.
 * @param {HTMLElement} impressumBtn - The impressum link element.
 * @returns {void}
 */
function showPortraitLayout(rotateIcon, title, canvasWrapper, impressumBtn) {
    rotateIcon.style.cssText = `
        display: flex;
        position: absolute;
        inset: 0;
        margin: auto;
        height: 100px;
        width: auto;
    `;
    title.style.display = 'none';
    canvasWrapper.style.display = 'none';
    impressumBtn.style.display = 'none';
    document.body.style.backgroundImage = 'none';
}

/**
 * Applies the normal playable layout: hides the rotate-device prompt
 * and shows the title, canvas, and impressum link, restoring the
 * background image.
 *
 * @param {SVGElement} rotateIcon - The "please rotate your device" icon element.
 * @param {HTMLElement} title - The page title element.
 * @param {HTMLElement} canvasWrapper - The wrapper element containing the game canvas.
 * @param {HTMLElement} impressumBtn - The impressum link element.
 * @returns {void}
 */
function showLandscapeLayout(rotateIcon, title, canvasWrapper, impressumBtn) {
    rotateIcon.style.display = 'none';
    title.style.display = 'flex';
    canvasWrapper.style.display = 'flex';
    impressumBtn.style.display = 'flex';
    document.body.style.backgroundImage = `url('img/5_background/bg_img.png')`;
}

/**
 * Responds to changes in device orientation/type. Shows or hides the
 * touch controls and switches between the portrait and landscape
 * layouts. On touch portrait, pauses an active game (stops movable
 * objects and deactivates the keyboard); on touch landscape, resumes
 * it if it was paused. Non-touch devices always use the landscape
 * layout with touch controls hidden.
 *
 * @returns {void}
 */
function handleOrientationChange() {
    if (portraitQuery.matches) {
        arrowsContainerRef.style.display = 'none';
        throwContainerRef.style.display = 'none';
        showPortraitLayout(rotateIcon, title, canvasWrapper, impressumBtn);
        if (world && !world.isPaused) {
            world.helper.stopAllMovableObjects();
            world.helper.deactivateKeyboard();
            world.isPaused = true;
        }

    } else if (landscapeQuery.matches) {
        arrowsContainerRef.style.display = (world && !world.endOfgame) ? 'flex' : 'none';
        throwContainerRef.style.display = (world && !world.endOfgame) ? 'flex' : 'none';
        showLandscapeLayout(rotateIcon, title, canvasWrapper, impressumBtn);
        if (world && world.isPaused) {
            world.helper.unpauseAllMovableObjects();
            world.helper.activateKeyboard();
            world.isPaused = false;
        }

    } else {
        arrowsContainerRef.style.display = 'none';
        throwContainerRef.style.display = 'none';
        showLandscapeLayout(rotateIcon, title, canvasWrapper, impressumBtn);
    }
}

portraitQuery.addEventListener('change', handleOrientationChange);
landscapeQuery.addEventListener('change', handleOrientationChange);

// ---------- UI BUTTON HANDLERS ----------

document.getElementById('anleitung_btn').onclick = () => {
    dialog.showModal();
}

document.getElementById('close-dialog').onclick = () => {
    dialog.close();
}

document.getElementById('volume-on').onclick = () => {
    document.getElementById('volume-on').style.display = 'none';
    document.getElementById('volume-off').style.display = 'flex';
    AudioHub.mute();
    sound = false;
    localStorage.setItem('sound', 'false');
}

document.getElementById('volume-off').onclick = () => {
    document.getElementById('volume-off').style.display = 'none';
    document.getElementById('volume-on').style.display = 'flex';
    AudioHub.unmute();
    sound = true;
    localStorage.setItem('sound', 'true');
}

document.getElementById('full-screen-btn').onclick = () => {
    canvas.requestFullscreen();
}

document.getElementById('play-pause-btn').onclick = () => {
    if (world.isPaused) {
        world.helper.unpauseAllMovableObjects();
        world.helper.activateKeyboard();
        world.isPaused = false;
    } else {
        world.helper.stopAllMovableObjects();
        world.helper.deactivateKeyboard();
        world.isPaused = true;
    }
}

// ---------- Canceling the contextmenu event ----------

arrowsContainerRef.addEventListener('contextmenu', (e)=>{
    e.preventDefault();
});

throwContainerRef.addEventListener('contextmenu', (e)=>{
    e.preventDefault();
});
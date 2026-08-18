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

const portraitQuery = window.matchMedia('(hover: none) and (orientation: portrait)');
const landscapeQuery = window.matchMedia('(hover: none) and (orientation: landscape)');

// ---------- GLOBAL STATE ----------

let world;
let keyboard = new Keyboard();
let sound = getSoundFromLocalStorage();

// ---------- GAME START / INIT ----------

function startGame() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
    showVolumeBtns();
    showPlayPauseBtn();
    document.getElementById('full-screen-btn').style.display = 'flex';
    handleOrientationChange();
}

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

function showVolumeBtns() {
    if (sound) {
        document.getElementById('volume-off').style.display = 'none';
        document.getElementById('volume-on').style.display = 'flex';
    } else {
        document.getElementById('volume-off').style.display = 'flex';
        document.getElementById('volume-on').style.display = 'none';
    }
}

function hideVolumeBtns() {
    document.getElementById('volume-off').style.display = 'none';
    document.getElementById('volume-on').style.display = 'none';
}

function showPlayPauseBtn() {
    document.getElementById('play-pause-btn').style.display = 'flex';
}

// ---------- KEYBOARD ----------

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

function showLandscapeLayout(rotateIcon, title, canvasWrapper, impressumBtn) {
    rotateIcon.style.display = 'none';
    title.style.display = 'flex';
    canvasWrapper.style.display = 'flex';
    impressumBtn.style.display = 'flex';
    document.body.style.backgroundImage = `url('img/5_background/bg_img.png')`;
}

function handleOrientationChange() {
    if (portraitQuery.matches) {
        arrowsContainerRef.style.display = 'none';
        throwContainerRef.style.display = 'none';
        showPortraitLayout(rotateIcon, title, canvasWrapper, impressumBtn);
        if (world && !world.isPaused) {
            world.stopAllMovableObjects();
            world.deactivateKeyboard();
            world.isPaused = true;
        }

    } else if (landscapeQuery.matches) {
        arrowsContainerRef.style.display = (world && !world.endOfgame) ? 'flex' : 'none';
        throwContainerRef.style.display = (world && !world.endOfgame) ? 'flex' : 'none';
        showLandscapeLayout(rotateIcon, title, canvasWrapper, impressumBtn);
        if (world && world.isPaused) {
            world.unpauseAllMovableObjects();
            world.activateKeyboard();
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
        world.unpauseAllMovableObjects();
        world.activateKeyboard();
        world.isPaused = false;
    } else {
        world.stopAllMovableObjects();
        world.deactivateKeyboard();
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

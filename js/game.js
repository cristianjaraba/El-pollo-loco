const dialog = document.getElementById('dialog');
let world;
let keyboard = new Keyboard();
let sound = getSoundFromLocalStorage();

function startGame() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
    showVolumeBtns();
    showPlayPauseBtn();
    document.getElementById('full-screen-btn').style.display = 'flex';
}

function init() {
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

    function getSoundFromLocalStorage(){

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

function showPlayPauseBtn() {
    document.getElementById('play-pause-btn').style.display = 'flex';
}

function hideVolumeBtns() {
    document.getElementById('volume-off').style.display = 'none';
    document.getElementById('volume-on').style.display = 'none';
}

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



document.getElementById('anleitung_btn').onclick = ()=>{
    dialog.showModal();
}

document.getElementById('close-dialog').onclick = ()=>{
    dialog.close();
}

document.getElementById('volume-on').onclick = ()=>{
    document.getElementById('volume-on').style.display = 'none';
    document.getElementById('volume-off').style.display = 'flex';
    AudioHub.mute();
    sound = false;
    localStorage.setItem('sound', 'false');
}

document.getElementById('volume-off').onclick = ()=>{
    document.getElementById('volume-off').style.display = 'none';
    document.getElementById('volume-on').style.display = 'flex';
    AudioHub.unmute();
    sound = true;
    localStorage.setItem('sound', 'true');
}

document.getElementById('full-screen-btn').onclick = ()=>{
    canvas.requestFullscreen();
}

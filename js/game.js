let world;
let keyboard = new Keyboard();

function startGame() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
}

function init() {
    document.getElementById('start_img').style.display = 'flex';
    document.getElementById('start_btn').style.display = 'flex';
    document.getElementById('start_menu_btn').style.display = 'flex';

    document.getElementById('start_btn').onclick = () => {
        document.getElementById('start_img').style.display = 'none';
        document.getElementById('start_btn').style.display = 'none';
        document.getElementById('start_menu_btn').style.display = 'none';

        startGame();
    };
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


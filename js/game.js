let world;
let keyword = new Keyboard();
let walking_sound = new Audio('./audio/pepe-walking.mp3');
let jumping_sound = new Audio('./audio/pepe-sprung.mp3');

function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyword);
}

document.addEventListener('keydown', (event) => {
    switch (event.keyCode) {
        case 68:
            keyword.D = true;
            break;
        case 40:
            keyword.DOWN = true;
            break;
        case 38:
            jumping_sound.play();
            keyword.UP = true;
            break;
        case 39:
            walking_sound.play()
            keyword.RIGHT = true;
            break;
        case 37:
            walking_sound.play()
            keyword.LEFT = true;
            break;
        case 32:
            jumping_sound.play();
            keyword.SPACE = true;
            break;
        default:
            break;
    }
})

document.addEventListener('keyup', (event) => {
    switch (event.keyCode) {
        case 68:
            keyword.D = false;
            break;
        case 40:
            keyword.DOWN = false;
            break;
        case 38:
            keyword.UP = false;
            break;
        case 39:
            keyword.RIGHT = false;
            break;
        case 37:
            keyword.LEFT = false;
            break;
        case 32:
            keyword.SPACE = false;
            break;
        default:
            break;
    }
})
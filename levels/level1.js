/**
 * Generates the full list of enemies for a level: 8 normal chickens,
 * 8 small chicks, and a single endboss, in that order (endboss last).
 *
 * @returns {(Chicken|Chick|Endboss)[]} The generated list of enemy objects.
 */
function generateEnemiesList() {
    let chickens = [];
    let chicks = [];

    for (let index = 0; index < 8; index++) {
        chickens.push(new Chicken([
            'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
            'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
            'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
        ], "img/3_enemies_chicken/chicken_normal/2_dead/dead.png"));
    }

    for (let index = 0; index < 8; index++) {
        chicks.push(new Chick([
            'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
            'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
            'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
        ], 'img/3_enemies_chicken/chicken_small/2_dead/dead.png'));
    }

    return [...chickens, ...chicks, new Endboss()];
}

/**
 * Generates the parallax background for the level, made up of four
 * layers (air, third, second, first) repeated across four consecutive
 * 719px-wide segments so the background can scroll seamlessly.
 *
 * @returns {BackgroundObject[]} The generated list of background layer objects.
 */
function generateBackgroundObjectsList(){
    return [
        new BackgroundObject('img/5_background/layers/air.png', -719, 720, 480),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', -719, 720, 480),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', -719, 720, 480),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', -719, 720, 480),

        new BackgroundObject('img/5_background/layers/air.png', 0, 720, 480),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 0, 720, 480),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 0, 720, 480),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 0, 720, 480),
        new BackgroundObject('img/5_background/layers/air.png', 719, 720, 480),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719, 720, 480),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719, 720, 480),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719, 720, 480),

        new BackgroundObject('img/5_background/layers/air.png', 719 * 2, 720, 480),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 719 * 2, 720, 480),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 719 * 2, 720, 480),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 719 * 2, 720, 480),
        new BackgroundObject('img/5_background/layers/air.png', 719 * 3, 720, 480),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719 * 3, 720, 480),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719 * 3, 720, 480),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719 * 3, 720, 480)
    ];
}

/**
 * Generates 10 collectable coins at random positions within the level,
 * with x in [200, 2000] and y in [150, 350].
 *
 * @returns {CollectableObject[]} The generated list of coin objects.
 */
function generateCoinsList() {
    let coinsList = [];
    for (let index = 0; index < 10; index++) {
        let x = Math.floor(Math.random() * (2000 - 200 + 1)) + 200;
        let y = Math.floor(Math.random() * (200 - 75 + 1)) + 150;
        coinsList.push(new CollectableObject(['img/8_coin/coin_1.png',
            'img/8_coin/coin_2.png'
        ], x, y, 80, 80))
    }
    return coinsList;
}

/**
 * Generates 10 collectable salsa bottles at random positions within
 * the level, with x in [200, 2000] and y in [330, 350].
 *
 * @returns {CollectableObject[]} The generated list of bottle objects.
 */
function generateBottlesList() {
    let bottlesList = [];
    for (let index = 0; index < 10; index++) {
        let x = Math.floor(Math.random() * (2000 - 200 + 1)) + 200;
        let y = Math.floor(Math.random() * (350 - 330 + 1)) + 330;
        bottlesList.push(new CollectableObject(['img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
            'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
        ], x, y, 60, 50))
    }
    return bottlesList;
}
let coinsList = [];
for (let index = 0; index < 10 ; index++) {
    let x = Math.floor(Math.random() * (2000 - 200 + 1)) + 200;
    let y = Math.floor(Math.random() * (200 - 75 + 1)) + 150;
    coinsList.push(new CollectableObject(['img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ], x, y, 80, 80 ))
}
let bottlesList = [];
for (let index = 0; index < 5 ; index++) {
    let x = Math.floor(Math.random() * (2000 - 200 + 1)) + 200;
    let y = Math.floor(Math.random() * (350 - 330 + 1)) + 330;
    bottlesList.push(new CollectableObject(['img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ], x, y, 60, 50 ))
}

const level1 = new Level(
    [
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Endboss()
    ],
    [new Cloud()],
    [
        new BackgroundObject('img/5_background/layers/air.png', -719),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', -719),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', -719),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', -719),

        new BackgroundObject('img/5_background/layers/air.png', 0),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 0),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 0),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 0),
        new BackgroundObject('img/5_background/layers/air.png', 719),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719),

        new BackgroundObject('img/5_background/layers/air.png', 719 * 2),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 719 * 2),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 719 * 2),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 719 * 2),
        new BackgroundObject('img/5_background/layers/air.png', 719 * 3),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719*3),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719*3),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719*3)
    ],
    coinsList,
    bottlesList
);
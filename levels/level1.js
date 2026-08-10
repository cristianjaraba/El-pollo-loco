let coinsList = [];
for (let index = 0; index < 10 ; index++) {
    let x = Math.floor(Math.random() * (2000 - 200 + 1)) + 200;
    let y = Math.floor(Math.random() * (200 - 75 + 1)) + 150;
    coinsList.push(new CollectableObject(['img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ], x, y, 80, 80 ))
}
let bottlesList = [];
for (let index = 0; index < 10 ; index++) {
    let x = Math.floor(Math.random() * (2000 - 200 + 1)) + 200;
    let y = Math.floor(Math.random() * (350 - 330 + 1)) + 330;
    bottlesList.push(new CollectableObject(['img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ], x, y, 60, 50 ))
}
let gameoverImgs = [];

const level1 = new Level(
    [
        new Chicken(['img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
            'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
            'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
        ], "img/3_enemies_chicken/chicken_normal/2_dead/dead.png"),
        new Chicken(['img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
            'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
            'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
        ], "img/3_enemies_chicken/chicken_normal/2_dead/dead.png"),
        new Chicken(['img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
            'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
            'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
        ], "img/3_enemies_chicken/chicken_normal/2_dead/dead.png"),
        new Chicken(['img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
            'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
            'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
        ], "img/3_enemies_chicken/chicken_normal/2_dead/dead.png"),
        new Chicken(['img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
            'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
            'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
        ], "img/3_enemies_chicken/chicken_normal/2_dead/dead.png"),
        new Chicken(['img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
            'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
            'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
        ], "img/3_enemies_chicken/chicken_normal/2_dead/dead.png"),
        new Chicken(['img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
            'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
            'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
        ], "img/3_enemies_chicken/chicken_normal/2_dead/dead.png"),
        new Chicken(['img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
            'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
            'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
        ], "img/3_enemies_chicken/chicken_normal/2_dead/dead.png"),
        new Chick(['img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
            'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
            'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
        ], 'img/3_enemies_chicken/chicken_small/2_dead/dead.png'),
         new Chick(['img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
            'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
            'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
        ], 'img/3_enemies_chicken/chicken_small/2_dead/dead.png'),
         new Chick(['img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
            'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
            'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
        ], 'img/3_enemies_chicken/chicken_small/2_dead/dead.png'),
         new Chick(['img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
            'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
            'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
        ], 'img/3_enemies_chicken/chicken_small/2_dead/dead.png'),
         new Chick(['img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
            'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
            'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
        ], 'img/3_enemies_chicken/chicken_small/2_dead/dead.png'),
         new Chick(['img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
            'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
            'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
        ], 'img/3_enemies_chicken/chicken_small/2_dead/dead.png'),
         new Chick(['img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
            'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
            'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
        ], 'img/3_enemies_chicken/chicken_small/2_dead/dead.png'),
         new Chick(['img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
            'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
            'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
        ], 'img/3_enemies_chicken/chicken_small/2_dead/dead.png'),
        new Endboss()
    ],
    [new Cloud()],
    [
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
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719*3, 720, 480),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719*3, 720, 480),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719*3, 720, 480)
    ],
    coinsList,
    bottlesList
);
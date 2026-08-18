/**
 * Simple data container representing a game level: its enemies,
 * clouds, background layers, and collectable coins/bottles, along
 * with the x-position marking the end of the level.
 */
class Level{
    /** @type {(Chicken|Chick|Endboss)[]} The level's enemies. */
    enemies;
    /** @type {Cloud[]} The level's background clouds. */
    clouds;
    /** @type {BackgroundObject[]} The level's background layer objects. */
    backgroundObjects;
    /** @type {CollectableObject[]} The level's collectable coins. */
    coins;
    /** @type {CollectableObject[]} The level's collectable bottles. */
    bottles;
    /** @type {number} The x-coordinate marking the end of the level. */
    level_end_x = 5000;

    /**
     * Creates a level from its constituent object lists.
     *
     * @param {(Chicken|Chick|Endboss)[]} enemies - The level's enemies.
     * @param {Cloud[]} clouds - The level's background clouds.
     * @param {BackgroundObject[]} backgroundObjects - The level's background layer objects.
     * @param {CollectableObject[]} coins - The level's collectable coins.
     * @param {CollectableObject[]} bottles - The level's collectable bottles.
     */
    constructor(enemies, clouds, backgroundObjects, coins, bottles){
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bottles = bottles;
    }
}
const { diceDotCountPadding, diceSize } = require("./Settings");
const BasicGame = require("./BasicGame");
const Minion = require("./Minion");
const Bullet = require("./Bullet");

/**
 * @param { DiceConfig } config - The dice config
 * @param { Deck } config - The deck the dice is in
 *
 */

function Dice(config, deck) {
    this.deck = deck;
    this.game = undefined;
    this.name = undefined;
    this.type = undefined;
    this.target = undefined;
    this.targetType = undefined;
    this.bulletSpeed = undefined;
    this.attackSpeed = undefined;
    this.basicDamage = undefined;
    this.dotCount = 1;
    this.color = undefined;
    this.attackCooldown = 0;
    this.position = {
        x: undefined,
        y: undefined,
        centerX: undefined,
        centerY: undefined,
        top: undefined,
        left: undefined,
        right: undefined,
        bottom: undefined,
        spawnX: undefined,
        spawnY: undefined,
    };

    this.setConfig(config);
}

Dice.prototype.isDice = function () {
    return true;
};

/**
 * @typedef { Object } DiceConfig
 * @property { String } name - The name of the dice
 * @property { String } type - The type of the dice
 * @property { String } targetType - The target of the dice
 * @property { Number } attackSpeed - The attack speed of the dice in seconds
 * @property { Number } basicDamage - The basic damage of the dice
 * @property { String } color - The color of the dice
 *
 * @param { DiceConfig } config
 */
Dice.prototype.setConfig = function ({
    name,
    type,
    targetType,
    attackSpeed,
    basicDamage,
    color,
    bulletSpeed,
    level,
    powerUp,
}) {
    this.name = name;
    this.type = type;
    this.targetType = targetType;
    this.attackSpeed = attackSpeed;
    this.basicDamage = basicDamage;
    this.color = color;
    this.bulletSpeed = bulletSpeed;
    this.level = level;
    this.powerUp = powerUp;
};

/**
 * @param { Number } x - The x coordinate to change to
 * @param { Number } y - The y coordinate to change to
 */
Dice.prototype.setPosition = function (x, y) {
    this.position.x = x;
    this.position.y = y;
    this.calculatePositionValues();
};

/**
 * @param { Number } x - The amount of x coordinates to move the dice
 * @param { Number } y - The amount of y coordinates to move the dice
 */
Dice.prototype.movePosition = function (x, y) {
    this.position.x += x;
    this.position.y += y;
    this.calculatePositionValues();
};

Dice.prototype.calculatePositionValues = function () {
    const { x, y } = this.position;
    this.position.centerX = diceSize / 2 + x;
    this.position.centerY = diceSize / 2 + y;
    this.position.top = y;
    this.position.left = x;
    this.position.right = x + diceSize;
    this.position.bottom = y + diceSize;
};

/**
 * @typedef { Object } Position
 * @property { Number } x - The x coordinate of the dice
 * @property { Number } y - The y coordinate of the dice
 * @property { Number } centerX - The x coordinate in the center of the dice
 * @property { Number } centerY - The y coordinate in the center of the dice
 * @property { Number } top - The coordinate at the top of the dice
 * @property { Number } left - The coordinate at the left of the dice
 * @property { Number } right - The coordinate at the right of the dice
 * @property { Number } bottom - The coordinate at the bottom of the dice
 * @returns { Position } - Returns the position of the dice
 */
Dice.prototype.getPosition = function () {
    return this.position;
};

/**
 * @param { Number } x - The x coordinate to spawn on
 * @param { Number } y - The y coordinate to spawn on
 */
Dice.prototype.setSpawnPosition = function (x, y) {
    this.position.spawnX = x;
    this.position.spawnY = y;
};

Dice.prototype.handleMerge = function () {
    this.dotCount++;

    const newConfig = this.deck.getNewDiceConfig();
    this.setConfig(newConfig);
};

/**
 * Sets the game object for the dice.
 * @param { BasicGame } game - The game object
 */
Dice.prototype.setGame = function (game) {
    this.game = game;
};

Dice.prototype.attack = function () {
    const minions = this.game.sortedMinions;

    if (this.targetType === "front") this.target = minions[0];
    else if (this.targetType === "random")
        this.target = minions[Math.floor(Math.random() * minions.length)];

    if (this.target) {
        const dots = [];
        var x, y;

        x = diceDotCountPadding * diceSize;
        y = diceDotCountPadding * diceSize;
        dots.push({ x, y });

        y = diceSize * 0.5;
        dots.push({ x, y });

        y = diceSize * (1 - diceDotCountPadding);
        dots.push({ x, y });

        x = diceSize * 0.5;
        y = diceSize * 0.5;
        dots.push({ x, y });

        x = diceSize * (1 - diceDotCountPadding);
        y = diceDotCountPadding * diceSize;
        dots.push({ x, y });

        y = diceSize * 0.5;
        dots.push({ x, y });

        y = diceSize * (1 - diceDotCountPadding);
        dots.push({ x, y });

        var dotsToDraw;
        if (this.dotCount == 1) dotsToDraw = [3];
        else if (this.dotCount == 2) dotsToDraw = [0, 6];
        else if (this.dotCount == 3) dotsToDraw = [0, 3, 6];
        else if (this.dotCount == 4) dotsToDraw = [0, 2, 4, 6];
        else if (this.dotCount == 5) dotsToDraw = [0, 2, 3, 4, 6];
        else if (this.dotCount == 6) dotsToDraw = [0, 1, 2, 4, 5, 6];

        for (var i = 0; i < dotsToDraw.length; i++) {
            var j = dotsToDraw[i];
            const bullet = new Bullet(this, {
                x: dots[j].x + this.position.x,
                y: dots[j].y + this.position.y,
            });
            this.game.shapes.push(bullet);
        }

        this.attackCooldown = this.attackSpeed;
        if (this.target.isDead) {
            this.target = undefined;
        }
    }
};

Dice.prototype.handleGameTick = function () {
    if (this.attackCooldown > 0) {
        this.attackCooldown -= 0.01;
    } else {
        this.attack();
    }
};

module.exports = Dice;

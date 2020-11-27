const Dice = require("./Dice");

/**
 * A deck of dices
 * @constructor
 * @param { Array } diceConfigs - An array of 5 dice configs
 */

function Deck(diceConfigs) {
    this.diceConfigs = [];
    this.powerUpPrices = [100, 200, 400, 700];

    diceConfigs.forEach((config, index) => {
        if (index < 5) {
            this.diceConfigs.push({
                ...config,
                level: 1,
                powerUpPrice: 100,
            });
        }
    });
}

Deck.prototype.getNewDiceConfig = function () {
    const index = Math.floor(Math.random() * 5);
    const config = this.diceConfigs[index];
    return config;
};

Deck.prototype.getNewDice = function () {
    const config = this.getNewDiceConfig();
    return new Dice(config, this);
};

Deck.prototype.getDices = function () {
    return this.diceConfigs;
};

Deck.prototype.upgradeDice = function (index) {
    const conf = this.diceConfigs[index];

    Object.entries(conf.powerUp).forEach(([key, value]) => {
        conf[key] += value;
    });

    if (conf.level === 4) {
        conf.level = "MAX";
        conf.powerUpPrice = 0;
    } else if (conf.level !== "MAX") {
        const newPowerUpPriceIndex =
            this.powerUpPrices.findIndex((_) => _ === conf.powerUpPrice) + 1;
        conf.powerUpPrice = this.powerUpPrices[newPowerUpPriceIndex];
        conf.level++;
    }
};

Deck.prototype.reset = function () {
    this.diceConfigs = this.diceConfigs.map((conf) => ({
        ...conf,
        level: 1,
        powerUpPrice: 100,
    }));
};

module.exports = Deck;

module.exports = [
    {
        name: "Basic Dice",
        type: "physical",
        targetType: "front",
        attackSpeed: 1,
        basicDamage: 100,
        color: "gray",
        bulletSpeed: 10,
        powerUp: {
            basicDamage: 10,
        },
    },

    {
        name: "Fire Dice",
        type: "magic",
        targetType: "front",
        attackSpeed: 0.73,
        basicDamage: 41,
        color: "red",
        bulletSpeed: 10,
        powerUp: {
            basicDamage: 10,
        },
    },

    {
        name: "Electric Dice",
        type: "magic",
        targetType: "front",
        attackSpeed: 0.56,
        basicDamage: 51,
        color: "yellow",
        bulletSpeed: 10,
        powerUp: {
            basicDamage: 10,
        },
    },

    {
        name: "Wind Dice",
        type: "physical",
        targetType: "front",
        attackSpeed: 0.45,
        basicDamage: 41,
        color: "cyan",
        bulletSpeed: 10,
        powerUp: {
            basicDamage: 15,
        },
    },

    {
        name: "Poison Dice",
        type: "debuff",
        targetType: "random",
        attackSpeed: 1.3,
        basicDamage: 34,
        color: "green",
        bulletSpeed: 10,
        powerUp: {
            basicDamage: 10,
        },
    },

    {
        name: "Ice Dice",
        type: "debuff",
        targetType: "front",
        attackSpeed: 1.36,
        basicDamage: 51,
        color: "blue",
        bulletSpeed: 10,
        powerUp: {
            basicDamage: 30,
        },
    },
];

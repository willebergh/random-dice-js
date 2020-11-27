const BasicGame = require("./BasicGame");
const Deck = require("./Deck");
const Dice = require("./Dice");
const Minion = require("./Minion");
const Settings = require("./Settings");
const [BasicDice, FireDice, ElectricDice, WindDice, PoisonDice, IceDice] = require("./diceConfigs");

const BasicDeck = new Deck([BasicDice, FireDice, ElectricDice, WindDice, IceDice]);
const game = new BasicGame(BasicDeck);

const container = document.createElement("div");
container.style.position = "fixed";
container.style.bottom = 0;
document.body.appendChild(container);

function AddButton(text, onClick) {
    const button = document.createElement("button");
    button.innerHTML = text;
    button.addEventListener("click", onClick);
    container.appendChild(button);
}

AddButton("New Dice", () => game.spawnDice());
AddButton("New Minion", () => game.spawnMinion());
AddButton("New Fast Minion", () => game.spawnMinion({ speed: 1 }));
AddButton("LOG", () => [console.log(game.shapes.filter((_) => _ instanceof Dice))]);

AddButton("START", () => {
    var wave = 0;

    const waveFunc = () => {
        wave++;
        for (var i = 0; i < 10; i++) {
            setTimeout(() => {
                game.spawnMinion({ hp: wave * 100 });
            }, 500 * i);

            if (i === 9) {
                setTimeout(() => waveFunc(), 500 * i + 3000);
            }
        }
    };

    waveFunc();
});

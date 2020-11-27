const Deck = require("./Deck");
const Settings = require("./Settings");
const Minion = require("./Minion");
const Dice = require("./Dice");
const Shape = require("./Shape");
const Bullet = require("./Bullet");
const {
    canvasWidth,
    canvasHeight,

    boardWidth,
    boardHeight,
    boardX,
    boardY,

    minionPath,

    diceSize,
    diceBorderSize,
    diceDotCountPadding,

    diceUpgradeBoardSpacing,
    diceUpgradeBoardHeight,
    diceUpgradeBoardWidth,
    diceUpgradeBoardX,
    diceUpgradeBoardY,
} = Settings;

/**
 * Basic game logic
 * @param { Deck } deck - Choosen deck to play with
 */

function BasicGame(deck) {
    this.deck = deck;

    this.shapes = [];

    this.sp = 100;
    this.newDicePrice = 10;
    this.powerUpButtons = [];

    this.isDraggingDice = false;
    this.draggingDice = undefined;
    this.mouseStartingPosition = { x: undefined, y: undefined };

    this.render = this.render.bind(this);

    this.createElements().then(() => {
        this.handleMouse();
        window.requestAnimationFrame(this.render);
    });
}

BasicGame.prototype.createElements = function () {
    return new Promise((resolve) => {
        // CONTAINER
        this.container = document.createElement("div");
        this.container.setAttribute("class", "random-dice__container");

        // CANVAS
        this.canvas = document.createElement("canvas");
        this.canvas.setAttribute("width", canvasWidth);
        this.canvas.setAttribute("height", canvasHeight);
        this.canvas.setAttribute("class", "random-dice__canvas");
        this.context = this.canvas.getContext("2d");
        this.container.appendChild(this.canvas);

        // SPAWN NEW DICE BUTTON AND SP COUNTER
        this.spCounterElement = document.createElement("span");
        this.spCounterElement.setAttribute("class", "random-dice__spCounterElement");
        this.spCounterElement.innerHTML = `Sp: ${this.sp}`;
        this.container.appendChild(this.spCounterElement);

        this.spawnNewDiceButton = document.createElement("button");
        this.spawnNewDiceButton.setAttribute("class", "random-dice__button");
        this.spawnNewDiceButton.innerHTML = `New dice<br>Sp: ${this.newDicePrice}`;
        this.spawnNewDiceButton.addEventListener("click", () => this.spawnDice());
        this.container.appendChild(this.spawnNewDiceButton);

        this.powerUpBoardContainer = document.createElement("div");
        this.powerUpBoardContainer.setAttribute("class", "random-dice__powerUpBoardContainer");
        this.deck.getDices().forEach((dice, index) => {
            const button = document.createElement("button");
            button.setAttribute("class", "random-dice__button");
            button.style.backgroundColor = dice.color;
            button.innerHTML = `Level: ${dice.level}<br>Sp: ${dice.powerUpPrice}`;
            this.powerUpButtons.push(button);

            button.addEventListener("click", (e) => {
                this.deck.upgradeDice(index);
                this.powerUpButtons[index].innerHTML = `Level: ${dice.level}${
                    dice.powerUpPrice !== 0 ? `<br> Sp: ${dice.powerUpPrice}` : ""
                } `;

                this.shapes
                    .filter((_) => _ instanceof Dice)
                    .forEach((dice) => {
                        Object.entries(dice.powerUp).forEach(([key, value]) => {
                            dice[key] += value;
                        });
                    });
            });

            this.powerUpBoardContainer.appendChild(button);
        });
        this.container.appendChild(this.powerUpBoardContainer);

        // STYLE
        this.styleSheet = document.createElement("style");
        this.styleSheet.innerHTML = `
             .random-dice__canvas {
                 width: ${canvasWidth}px;
                 height: ${canvasHeight}px;
                 border: solid black 1px;
             }
 
             .random-dice__container {
                 width: ${canvasWidth}px;
             }

             .random-dice__button {
                border: none;
                padding: 16px;
             }

             .random-dice__spCounterElement {
                background-color: cyan;
                padding: 16px;
             }

             .random-dice__powerUpBoardContainer {
                 display: flex;
                 justify-content: center;
             }
 
         `;

        document.body.appendChild(this.styleSheet);
        document.body.appendChild(this.container);

        resolve();
    });
};

BasicGame.prototype.render = function () {
    // CLEAR CANVAS
    this.context.clearRect(0, 0, canvasWidth, canvasHeight);

    // RENDER MINION PATH
    this.context.beginPath();
    minionPath.forEach(({ x, y }, index) => {
        if (index === 0) {
            this.context.moveTo(x, y);
        }

        this.context.lineTo(x, y);
    });
    this.context.stroke();

    // RENDER SHAPES
    this.shapes.forEach((shape, index) => {
        if (shape instanceof Dice) {
            const dice = shape;
            dice.handleGameTick();
            this.context.fillStyle = dice.color;
            this.context.fillRect(dice.position.x, dice.position.y, diceSize, diceSize);

            this.context.fillStyle = "white";
            this.context.fillRect(
                dice.position.x + diceBorderSize,
                dice.position.y + diceBorderSize,
                diceSize - diceBorderSize * 2,
                diceSize - diceBorderSize * 2
            );

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
            if (dice.dotCount == 1) dotsToDraw = [3];
            else if (dice.dotCount == 2) dotsToDraw = [0, 6];
            else if (dice.dotCount == 3) dotsToDraw = [0, 3, 6];
            else if (dice.dotCount == 4) dotsToDraw = [0, 2, 4, 6];
            else if (dice.dotCount == 5) dotsToDraw = [0, 2, 3, 4, 6];
            else if (dice.dotCount == 6) dotsToDraw = [0, 1, 2, 4, 5, 6];

            this.context.fillStyle = dice.color;
            for (var i = 0; i < dotsToDraw.length; i++) {
                this.context.beginPath();
                var j = dotsToDraw[i];
                this.context.arc(
                    dots[j].x + dice.position.x,
                    dots[j].y + dice.position.y,
                    diceSize * 0.07,
                    0,
                    2 * Math.PI
                );
                this.context.fill();
            }
        }

        if (shape instanceof Minion) {
            if (shape.isDead) {
                this.shapes.splice(index, 1);
                this.updateSpCount("+", 10);
            } else {
                shape.move();

                this.context.fillStyle = shape.color;
                this.context.fillRect(shape.position.x, shape.position.y, shape.size, shape.size);

                this.context.fillStyle = "rgba(0,0,0,0.5)";
                this.context.fillRect(
                    shape.position.x + shape.boarderSize,
                    shape.position.y + shape.boarderSize,
                    shape.size - shape.boarderSize * 2,
                    shape.size - shape.boarderSize * 2
                );

                this.context.font = "24px Arial";
                this.context.fillStyle = "white";
                this.context.textAlign = "center";
                this.context.fillText(
                    shape.hp.toString(),
                    shape.position.centerX,
                    shape.position.centerY + 10
                );
            }
        }

        if (shape instanceof Bullet) {
            if (shape.hasHit) {
                this.shapes.splice(index, 1);
            } else {
                shape.move();

                this.context.beginPath();
                this.context.fillStyle = shape.color;
                this.context.arc(shape.position.x, shape.position.y, shape.size, 0, 2 * Math.PI);
                this.context.fill();
            }
        }
    });

    this.sortedMinions = this.shapes
        .filter((_) => _ instanceof Minion)
        .sort((a, b) => b.position.distanceTraveled - a.position.distanceTraveled);

    window.requestAnimationFrame(this.render);
};

BasicGame.prototype.handleMouse = function () {
    var offsetX, offsetY;

    const recalculateOffset = () => {
        const { left, top } = this.canvas.getBoundingClientRect();
        offsetX = left;
        offsetY = top;
    };

    recalculateOffset();

    window.onscroll = recalculateOffset;
    window.onresize = recalculateOffset;
    this.canvas.onresize = recalculateOffset;

    const isMouseInDice = (mx, my, dice) => {
        const dLeft = dice.position.x;
        const dTop = dice.position.y;
        const dRight = dice.position.x + diceSize;
        const dBottom = dice.position.y + diceSize;

        if (mx >= dLeft && mx <= dRight && my >= dTop && my <= dBottom) {
            return true;
        }

        return false;
    };

    const handleDropDice = () => {
        this.isDraggingDice = false;

        const { centerX, centerY } = this.draggingDice.getPosition();
        const droppedOnDice = this.shapes.find((shape) => {
            if (shape instanceof Dice) {
                const { top, left, right, bottom } = shape.getPosition();
                if (shape !== this.draggingDice) {
                    if (
                        centerX >= left &&
                        centerX <= right &&
                        centerY >= top &&
                        centerY <= bottom
                    ) {
                        return shape;
                    }
                }
            }
        });

        const handleInvalidDrop = () => {
            const { spawnX, spawnY } = this.draggingDice.position;
            this.draggingDice.setPosition(spawnX, spawnY);
        };

        if (droppedOnDice) {
            const hasSameName = droppedOnDice.name === this.draggingDice.name;
            const hasSameDotCount = droppedOnDice.dotCount === this.draggingDice.dotCount;
            if (hasSameName && hasSameDotCount) {
                droppedOnDice.handleMerge();

                const draggingDiceIndex = this.shapes.findIndex((_) => _ === this.draggingDice);
                this.shapes.splice(draggingDiceIndex, 1);
                this.draggingDice = undefined;
            } else {
                handleInvalidDrop();
            }
        } else {
            handleInvalidDrop();
        }
    };

    const handleMouseDown = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const mouseX = e.clientX - offsetX;
        const mouseY = e.clientY - offsetY;

        this.mouseStartingPosition = { x: mouseX, y: mouseY };

        this.shapes.forEach((shape) => {
            if (shape instanceof Dice) {
                if (isMouseInDice(mouseX, mouseY, shape)) {
                    this.isDraggingDice = true;
                    this.draggingDice = shape;
                }
            }
        });
    };

    const handleMouseMove = (e) => {
        if (!this.isDraggingDice) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        const mouseX = e.clientX - offsetX;
        const mouseY = e.clientY - offsetY;

        const dx = mouseX - this.mouseStartingPosition.x;
        const dy = mouseY - this.mouseStartingPosition.y;
        this.draggingDice.movePosition(dx, dy);

        this.mouseStartingPosition = { x: mouseX, y: mouseY };
    };

    const handleMouseUpAndOut = (e) => {
        if (!this.isDraggingDice) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();
        handleDropDice();
    };

    const handleMouseClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const mouseX = e.clientX - offsetX;
        const mouseY = e.clientY - offsetY;

        this.deck.getDices().forEach((dice, index) => {
            const y = diceUpgradeBoardY - diceBorderSize;
            const size = diceUpgradeBoardHeight;
            const x =
                diceUpgradeBoardX +
                size * index +
                diceUpgradeBoardSpacing * index +
                diceUpgradeBoardSpacing;
            if (isMouseInDice(mouseX, mouseY, { position: { x, y } })) {
                if (this.sp >= dice.upgradePrice) {
                    this.deck.upgradeDice(index);
                    this.sp -= dice.upgradePrice;
                }
            }
        });
    };

    this.canvas.addEventListener("mousedown", handleMouseDown);
    this.canvas.addEventListener("mousemove", handleMouseMove);
    this.canvas.addEventListener("mouseup", handleMouseUpAndOut);
    this.canvas.addEventListener("mouseout", handleMouseUpAndOut);
    this.canvas.addEventListener("click", handleMouseClick);
};

BasicGame.prototype.spawnDice = function () {
    if (this.sp >= this.newDicePrice) {
        this.updateSpCount("-", this.newDicePrice);
        this.newDicePrice += 10;
        this.spawnNewDiceButton.innerHTML = `New dice<br>Sp: ${this.newDicePrice}`;

        const newDice = this.deck.getNewDice();
        newDice.setGame(this);

        const randomizePos = () => {
            const pos = Math.floor(Math.random() * 15) * diceSize;
            const y = Math.floor(pos / boardWidth) * diceSize + boardY;
            const x = (pos % boardWidth) + boardX;

            const foundDiceAtPos = this.shapes.find(
                (shape) => shape instanceof Dice && shape.position.x === x && shape.position.y === y
            );

            if (foundDiceAtPos) {
                return randomizePos();
            } else {
                return { x, y };
            }
        };

        const { x, y } = randomizePos();
        newDice.setPosition(x, y);
        newDice.setSpawnPosition(x, y);
        this.shapes.push(newDice);
    }
};

BasicGame.prototype.spawnMinion = function (config) {
    config = {
        hp: 1000,
        size: 60,
        speed: 0.5,
        color: "gray",
        ...config,
    };

    const newMinion = new Minion(config, this);
    newMinion.setPosition(
        minionPath[0].x - newMinion.size / 2,
        minionPath[0].y - newMinion.size / 2
    );

    this.shapes.push(newMinion);
};

BasicGame.prototype.updateSpCount = function (operation, number) {
    if (operation === "+") {
        this.sp += number;
    } else if (operation === "-") {
        this.sp -= number;
    }
    this.spCounterElement.innerHTML = `Sp: ${this.sp}`;
};

BasicGame.prototype.test = function () {
    const minions = this.shapes
        .filter((_) => _ instanceof Minion)
        .sort((a, b) => b.position.distanceTraveled - a.position.distanceTraveled)
        .map(({ position: { distanceTraveled } }) => distanceTraveled);

    console.log(minions);
};

BasicGame.prototype.reset = function () {
    this.shapes = [];

    this.sp = 100;
    this.newDicePrice = 10;
    this.powerUpButtons = [];

    this.isDraggingDice = false;
    this.draggingDice = undefined;
    this.deck.reset();
};

module.exports = BasicGame;

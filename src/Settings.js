class Settings {
    constructor() {
        this.canvasWidth = 800;
        this.canvasHeight = 450;

        this.boardWidth = 500;
        this.boardHeight = 300;

        this.boardBottomPadding = 200;
        this.boardX = (this.canvasWidth - this.boardWidth) / 2;
        this.boardY = this.canvasHeight - this.boardHeight;

        this.minionPathPadding = 100;
        this.minionPath = [
            {
                x: this.boardX - this.minionPathPadding,
                y: this.canvasHeight,
            },
            { x: this.boardX - this.minionPathPadding, y: this.boardY - this.minionPathPadding },
            {
                x: this.boardX + this.boardWidth + this.minionPathPadding,
                y: this.boardY - this.minionPathPadding,
            },
            {
                x: this.boardX + this.boardWidth + this.minionPathPadding,
                y: this.canvasHeight,
            },
        ];

        this.diceSize = this.boardWidth / 5;
        this.diceBorderSize = this.diceSize / 10;
        this.diceDotCountPadding = 0.3;

        this.diceUpgradeBoardX = this.minionPath[0].x;
        this.diceUpgradeBoardHeight = this.diceSize;
        this.diceUpgradeBoardWidth = this.minionPath[2].x - this.minionPathPadding;
        this.diceUpgradeBoardY = this.canvasHeight - this.diceUpgradeBoardHeight;
        this.diceUpgradeBoardSpacing =
            (this.diceUpgradeBoardWidth - this.diceUpgradeBoardHeight * 5) / 6;
    }
}

module.exports = new Settings();

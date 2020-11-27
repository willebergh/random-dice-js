
/**
 * A shape that can be drawn on the canvas.
 * @class
 * 
 * @typedef     { Object } ShapeConfig
 * @property    { Number } size - The size of the shape 
 * @property    { String } color - The color of the shape
 * @property    { String } text - Text to be shown on the shape
 *  
 * @param       { ShapeConfig } config
 */
function Shape({ size, color, text }) {
    this.size = size;
    this.text = text;
    this.color = color;
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
}

/**
 * @access private
 */
Shape.prototype.calculatePositionValues = function () {
    const { x, y } = this.position;
    this.position.centerX = diceSize / 2 + x;
    this.position.centerY = diceSize / 2 + y;
    this.position.top = y;
    this.position.left = x;
    this.position.right = x + diceSize;
    this.position.bottom = y + diceSize;
}

/**
 * Set position of the shape.
 * @param { Number } x - The x coordinate to change to
 * @param { Number } y - The y coordinate to change to
 */
Shape.prototype.setPosition = function (x, y) {
    this.position.x = x;
    this.position.y = y;
    this.calculatePositionValues();
}

/**
 * Move the shape by some amount of units
 * @param { Number } x - The amount of x coordinates to move the dice
 * @param { Number } y - The amount of y coordinates to move the dice
 */
Shape.prototype.movePosition = function (x, y) {
    this.position.x += x;
    this.position.y += y;
    this.calculatePositionValues();
}

/**
 * Set the spawn point for the shape
 * @param { Number } x - The x coordinate to spawn on
 * @param { Number } y - The y coordinate to spawn on
 */
Shape.prototype.setSpawnPosition = function (x, y) {
    this.position.spawnX = x;
    this.position.spawnY = y;
}

/**
 * Get the position object of the shape
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
Shape.prototype.getPosition = function () {
    return this.position
}

module.exports = Shape;

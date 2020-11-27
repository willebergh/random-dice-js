module.exports = class Bullet {
    constructor(dice, position) {
        this.dice = dice;
        this.size = 10;
        this.speed = dice.bulletSpeed;
        this.color = dice.color;
        this.hasHit = false;
        this.position = {
            x: position.x,
            y: position.y,
            startX: position.x,
            startY: position.y,
        };
    }

    move() {
        if (this.dice.target) {
            const { startX, startY } = this.position;
            const target = this.dice.target.position;
            const angle = Math.atan2(target.centerY - startY, target.centerX - startX);

            this.position.x += this.speed * Math.cos(angle);
            this.position.y += this.speed * Math.sin(angle);
            this.calculatePositionValues();

            const { top, left, right, bottom } = target;
            const { centerX, centerY } = this.position;

            if (centerX >= left && centerX <= right && centerY >= top && centerY <= bottom) {
                this.hasHit = true;
                this.dice.target.takeDamage(this.dice);
            }
        }
    }

    calculatePositionValues() {
        const { x, y } = this.position;
        this.position.centerX = this.size / 2 + x;
        this.position.centerY = this.size / 2 + y;
        this.position.top = y;
        this.position.left = x;
        this.position.right = x + this.size;
        this.position.bottom = y + this.size;
    }
};

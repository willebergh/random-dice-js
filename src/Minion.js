const { minionPath } = require("./Settings");

function Minion({ hp, size, speed, color }, game) {
    this.hp = hp;
    this.game = game;
    this.size = size;
    this.speed = speed;
    this.color = color;
    this.isDead = false;
    this.boarderSize = size / 10;
    this.position = {
        x: undefined,
        y: undefined,
        top: undefined,
        left: undefined,
        right: undefined,
        bottom: undefined,
        centerX: undefined,
        centerY: undefined,
        distanceTraveled: 0,
    };

    this.spawnHp = hp;
    this.waypoints = [];
    this.currentWaypoint = 0;
}

Minion.prototype.setWaypoints = function (points) {
    this.currentWaypoint = 0;
    for (var a = 1; a < points.length; a++) {
        var dx = points[a].x - points[a - 1].x;
        var dy = points[a].y - points[a - 1].y;
        var startX = points[a - 1].x;
        var startY = points[a - 1].y;

        for (var i = 1; i <= 100; i++) {
            var pct = Math.min(1, i * 0.01);
            var nextX = startX + dx * pct;
            var nextY = startY + dy * pct;
            this.waypoints.push({ x: nextX - this.size / 2, y: nextY - this.size / 2 });
        }
    }
};

Minion.prototype.move = function () {
    if (minionPath[this.currentWaypoint + 1]) {
        const current = minionPath[this.currentWaypoint];
        const next = minionPath[this.currentWaypoint + 1];
        const angle = Math.atan2(next.y - current.y, next.x - current.x);

        this.position.x += this.speed * Math.cos(angle);
        this.position.y += this.speed * Math.sin(angle);

        this.position.distanceTraveled += this.speed;

        this.calculatePositionValues();
        if (
            this.position.x + this.size / 2 === next.x &&
            this.position.y + this.size / 2 === next.y
        ) {
            this.currentWaypoint++;
        }
    } else {
        this.isDead = true;
        this.game.reset();
    }
};

Minion.prototype.setPosition = function (x, y) {
    this.position.x = x;
    this.position.y = y;
    this.calculatePositionValues();
};

Minion.prototype.calculatePositionValues = function () {
    const { x, y } = this.position;
    this.position.centerX = this.size / 2 + x;
    this.position.centerY = this.size / 2 + y;
    this.position.top = y;
    this.position.left = x;
    this.position.right = x + this.size;
    this.position.bottom = y + this.size;
};

Minion.prototype.takeDamage = function (dice) {
    if (dice.isDice()) {
        this.hp -= dice.basicDamage;
        if (this.hp < 1) {
            this.isDead = true;
        }
    }
};

module.exports = Minion;

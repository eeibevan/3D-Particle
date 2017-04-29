function Particle(radius, x, y, z) {
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.z = z;

    this.dx = rndInt(-2, 2);
    this.dy = rndInt(-2, 2);
    this.dz = rndInt(-2, 2);

    this.isToDie = false;

    this.mesh = {};
}

Particle.prototype.isCollision = function (other) {
    var dx = this.x - other.x;
    var dy = this.y - other.y;
    var dz = this.z - other.z;
    var dist = Math.sqrt(dx * dx + dy * dy + dz + dz);

    return dist < this.radius + other.radius;
};

Particle.prototype.collide = function (other) {
    other.isToDie = true;
};
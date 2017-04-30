const PARTICLE_MAX_RADIUS = 10;
function Particle(radius, x, y, z) {
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.z = z;

    this.dx = rndInt(-2, 2);
    this.dy = rndInt(-2, 2);
    this.dz = rndInt(-2, 2);

    this._invincibilityTicks = 50;
    this.isToDie = false;
    this.isToBurst = false;
    this.burstRadius = PARTICLE_MAX_RADIUS;

    this.mesh = {};
}

Particle.prototype.tick = function () {
    if (this._invincibilityTicks > 0)
        this._invincibilityTicks--;
};

Particle.prototype.isInvincible = function () {
    return this._invincibilityTicks > 0;
};

Particle.prototype.isCollision = function (other) {
    if (other.isInvincible())
        return false;

    var dx = this.x - other.x;
    var dy = this.y - other.y;
    var dz = this.z - other.z;
    var dist = Math.sqrt(dx * dx + dy * dy + dz + dz);

    return dist < this.radius + other.radius;
};

Particle.prototype.collide = function (other) {
    this.radius += other.radius;
    this.mesh.scale.set(this.radius, this.radius, this.radius);
    other.isToDie = true;

    if (this.radius >= this.burstRadius)
        this.isToBurst = true;
};
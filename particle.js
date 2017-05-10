/**
 * How Large Any Given Particle May Become Before Bursting
 * @type {number}
 */
const PARTICLE_MAX_RADIUS = 25;

/**
 * Basic Representation of A Particle In A System
 *
 * @param radius
 * @param x
 * @param y
 * @param z
 * @constructor
 */
function Particle(radius, x, y, z) {
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.z = z;

    // || 1 Excludes 0
    this.dx = rndInt(-10, 10) || 1;
    this.dy = rndInt(-10, 10) || 1;
    this.dz = rndInt(-10, 10) || 1;

    this._invincibilityTicks = rndInt(75, 100);
    this.isToDie = false;
    this.isToBurst = false;
    this.burstRadius = PARTICLE_MAX_RADIUS;

    this.mesh = {};
}

/**
 * Advances The Particle Ahead By One Unit of Time
 */
Particle.prototype.tick = function () {
    if (this._invincibilityTicks > 0)
        this._invincibilityTicks--;
};

/**
 * Tests The Particle Should Be Allowed To Be Destroyed
 * @returns {boolean}
 */
Particle.prototype.isInvincible = function () {
    return this._invincibilityTicks > 0;
};

/**
 * Tests If A Collision Should Occur Between This Particle And Another
 *
 * @param other {Particle}
 * The Particle To Test To See If It Is Colliding With This One
 *
 * @returns {boolean}
 */
Particle.prototype.isCollision = function (other) {
    if (other.isInvincible() || this.isToBurst)
        return false;

    var dx = this.x - other.x;
    var dy = this.y - other.y;
    var dz = this.z - other.z;
    var dist = Math.sqrt(dx * dx + dy * dy + dz + dz);

    return dist < this.radius + other.radius;
};

/**
 * Performs Collision With Another Particle If It Is Not Invincible
 * Absorbing It And Marking It For Death
 *
 * @param other {Particle}
 * The Particle To Absorb And Remove
 */
Particle.prototype.collide = function (other) {

    // Do Not Become Any Larger If We Are To Burst
    if (this.isToBurst)
        return;

    this.radius += other.radius;
    this.mesh.scale.set(this.radius, this.radius, this.radius);
    other.isToDie = true;

    if (this.radius >= this.burstRadius)
        this.isToBurst = true;
};
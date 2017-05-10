/**
 * A System For Simulating 3D Particle Movement And Interaction
 *
 * @param minX {number}
 * The Lowest X In Which A Particle May Move
 *
 * @param minY {number}
 * The Lowest Y In Which A Particle May Move
 *
 * @param minZ {number}
 * The Lowest Z In Which A Particle May Move
 *
 * @param maxX {number}
 * The Highest X In Which A Particle May Move
 *
 * @param maxY {number}
 * The Highest Y In Which A Particle May Move
 *
 * @param maxZ {number}
 * The Highest Z In Which A Particle May Move
 *
 * @param n {number}
 * Number of Particles To Seed The System With
 *
 * @param meshProvider {MeshProvider}
 * Object Which Provides Meshes Linked To A Scene
 *
 * @constructor
 */
function System(minX, minY, minZ, maxX, maxY, maxZ, n, meshProvider) {
    this.minX = minX;
    this.minY = minY;
    this.minZ = minZ;

    this.maxX = maxX;
    this.maxY = maxY;
    this.maxZ = maxZ;

    this._meshProvider = meshProvider;

    this.particles = [];

    this.startN = n;
    this.seed(n);
}

/**
 * Makes A Random Particle At x,y,z
 * Or At A Random Location
 *
 * @param [x] {number}
 * @default A Random Number Inside The System
 *
 * @param [y] {number}
 * @default A Random Number Inside The System
 *
 * @param [z] {number}
 * @default A Random Number Inside The System
 *
 * @private
 */
System.prototype._makeParticle = function (x, y, z) {
    var radius = Math.ceil(Math.random() * 5);
    var nx = x || rndInt(this.minX, this.maxX);
    var ny = y || rndInt(this.minY, this.maxY);
    var nz = z || rndInt(this.minZ, this.maxZ);
    var part  = new Particle(radius, nx, ny, nz);
    this._meshProvider.makeAndAttach(part);
    this.particles.push(part);
};

/**
 * Seeds n Random Particles Into The System
 *
 * @param n {number}
 * Number of Particles To Create
 */
System.prototype.seed = function (n) {
    for (var i = 0; i < n; i++) {
        this._makeParticle();
    }
};


/**
 * Tests And Runs Collision On Particles In The System
 *
 * @returns {boolean}
 * True - If A Collision Occurred
 * False Otherwise
 *
 * @private
 */
System.prototype._collisions = function () {
    var particles  = this.particles;
    var hasCollisionOccurred = false;

    for (var i = 0; i < particles.length; i++) {
        var part = particles[i];

        for (var j = 0; j < particles.length; j++) {
            if (j === i)
                continue;

            var other = particles[j];
            if (part.isCollision(other)) {
                part.collide(other);
                hasCollisionOccurred = true;
            }
        }
    }

    return hasCollisionOccurred;
};

/**
 * Burst / Remove Dead Particles In The System
 * @private
 */
System.prototype._spliceMarkedParticles = function () {
    for (var i = 0; i < this.particles.length; i++) {
        var part = this.particles[i];

        if (part.isToBurst) {
            var mk = Math.floor(part.radius / 5);
            for (; mk > 0; mk--)
                this._makeParticle(part.x, part.y, part.z);
            part.isToDie = true;
        }

        if (part.isToDie) {
            part.mesh.parent.remove(part.mesh);
            this.particles.splice(i, 1);
            i--;
        }
    }
};

/**
 * Advances The System Ahead By One Unit of Time
 * Running Collisions, Movement, Bursts, etc..
 */
System.prototype.tick = function () {
    for (var i = 0; i < this.particles.length; i++) {
        var part = this.particles[i];

        part.x += part.dx;
        if (part.x > this.maxX || part.x < this.minX) {
            part.dx *= -1;
            part.x += part.dx;
        }

        part.y += part.dy;
        if (part.y > this.maxY || part.y < this.minY) {
            part.dy *= -1;
            part.y += part.dy;
        }

        part.z += part.dz;
        if (part.z > this.maxZ || part.z < this.minZ) {
            part.dz *= -1;
            part.z += part.dz;
        }

        part.tick();
    }

    if (this._collisions()) {
        this._spliceMarkedParticles();
    }

    if (this.particles.length/this.startN < .1 ) {
        // Seed In 25% of The Original Number
        var newN = Math.floor(this.startN * .25);
        for (var j = 0; j < newN; j++) {
            this._makeParticle();
        }
    }
};
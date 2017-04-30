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

System.prototype._makeParticle = function (x, y, z) {
    var radius = Math.ceil(Math.random() * 5);
    var nx = x || rndInt(this.minX, this.maxX);
    var ny = y || rndInt(this.minY, this.maxY);
    var nz = z || rndInt(this.minZ, this.maxZ);
    var part  = new Particle(radius, nx, ny, nz);
    this._meshProvider.makeAndAttach(part);
    this.particles.push(part);
};

System.prototype.seed = function (n) {
    for (var i = 0; i < n; i++) {
        this._makeParticle();
    }
};


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
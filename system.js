function System(minX, minY, minZ, maxX, maxY, maxZ, n, meshes) {
    this.minX = minX;
    this.minY = minY;
    this.minZ = minZ;

    this.maxX = maxX;
    this.maxY = maxY;
    this.maxZ = maxZ;

    this.particles = [];

    this.seed(n, meshes);
}

System.prototype.seed = function (n, meshes) {
    for (var i = 0; i < n; i++) {
        var radius = Math.ceil(Math.random() * 5);
        var x = rndInt(this.minX, this.maxX);
        var y = rndInt(this.minY, this.maxY);
        var z = rndInt(this.minZ, this.maxZ);
        var np = new Particle(radius, x, y, z);
        np.mesh = meshes[i];
        this.particles.push(np);
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

System.prototype._spliceDeadParticles = function () {
    for (var i = 0; i < this.particles.length; i++) {
        var part = this.particles[i];
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
    }

    if (this._collisions()) {
        this._spliceDeadParticles();
    }
};
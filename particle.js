function Particle(radius, x, y, z) {
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.z = z;

    this.dx = rndInt(-2, 2);
    this.dy = rndInt(-2, 2);
    this.dz = rndInt(-2, 2);

    this.mesh = {};
}
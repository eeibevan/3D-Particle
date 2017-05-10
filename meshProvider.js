/**
 * Creates And Links Meshes To Particles And The Scene
 *
 * @param scene {THREE.Scene}
 * The Scene To Render The Particle Mesh On
 *
 * @param material {THREE.material}
 * The Material To 'Cover' The Particle Geometry With
 *
 * @constructor
 */
function MeshProvider(scene, material) {
    this._scene = scene;
    this._material = material;
}

/**
 * Colors A Shape As A Single Color
 *
 * @param geom {THREE.Geometry}
 * The Geometry To Color
 * (I've Only Tested With Sphere, But It Should Work With Any)
 *
 * @param color {THREE.Color}
 * The Color To Apply
 * @private
 */
MeshProvider.prototype._applyVertexColors = function (geom, color) {
    geom.faces.forEach( function(face) {
        // Each Face Is Assembled With Triangles (3 Vertices)
        for(var i = 0; i < 3; i++) {
            face.vertexColors.push(color);
        }
    } );
};

/**
 * Makes The Mesh For A Given Particle And Attaches It To The Scene
 * Note: The Mesh Is Also Set As The Particle's mesh Field
 *
 * @param linkedParticle {Particle}
 * The Particle To Create The Mesh From
 *
 * @returns {Mesh}
 * The Mesh Based On The Radius of The Given Particle
 */
MeshProvider.prototype.makeAndAttach = function (linkedParticle) {
    var geometry = new THREE.SphereGeometry( 5, 5, 5 );
    var color = new THREE.Color();

    this._applyVertexColors(geometry, color.setHex(Math.random() * 0xffffff ));

    var mesh = new THREE.Mesh(geometry, this._material);
    mesh.scale.set(linkedParticle.radius, linkedParticle.radius, linkedParticle.radius);

    linkedParticle.mesh = mesh;
    this._scene.add(mesh);
    return mesh;
};

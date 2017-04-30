function MeshProvider(scene, material) {
    this._scene = scene;
    this._material = material;
}

MeshProvider.prototype._applyVertexColors = function (g, c) {
    g.faces.forEach( function( f ) {
        var n = ( f instanceof THREE.Face3 ) ? 3 : 4;
        for( var j = 0; j < n; j ++ ) {
            f.vertexColors[ j ] = c;
        }
    } );
};

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

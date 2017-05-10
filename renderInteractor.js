function RendererInteractor(container, width, height, depth, n) {
    this._container = container;
    this._system = null;

    this.camera = null;
    this.controls = null;
    this._scene = null;
    this._renderer = null;
    this._init(width, height, depth, n);
}

RendererInteractor.prototype._makeCamera = function (x, y, z) {
    var camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000000);
    camera.position.x = x;
    camera.position.y = y;
    camera.position.z = z;
    return camera;
};

RendererInteractor.prototype._makeControls = function (camera) {
    var controls = new THREE.TrackballControls(camera);

    controls.rotateSpeed = 10;
    controls.zoomSpeed = 10;
    controls.panSpeed = 10;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;

    return controls;
};

RendererInteractor.prototype._init = function (width, height, depth, n) {
    this._scene = new THREE.Scene();

    this._scene.add(new THREE.AmbientLight(0xffffff));

    var material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        shading: THREE.FlatShading,
        vertexColors: THREE.VertexColors,
        shininess: 0
    });
    var meshProvider = new MeshProvider(this._scene, material);

    this._system = new System(-width, -height, -depth, width, height, depth, n, meshProvider);

    var gridHelper = new THREE.GridHelper( depth * 2, 40, 0x0000ff, 0x808080 );
    gridHelper.position.y = 0;
    gridHelper.position.x = 0;
    this._scene.add(gridHelper);

    var light = new THREE.SpotLight(0xffffff, 1.5);
    light.position.set(0, 0, this._system.maxZ + 500);
    this._scene.add(light);

    this.camera = this._makeCamera(width, height, depth);
    this.controls = this._makeControls(this.camera);

    this._renderer = new THREE.WebGLRenderer();
    this._renderer.setClearColor(0x000000);
    this._renderer.setSize(window.innerWidth, window.innerHeight);
    this._renderer.sortObjects = false;

    this._container.appendChild(this._renderer.domElement);

    this.animate();
};

RendererInteractor.prototype.animate = function () {
    requestAnimationFrame(this.animate.bind(this));
    this._system.tick();

    var len = this._system.particles.length;
    for (var i = 0; i < len; i++) {
        var part = this._system.particles[i];

        part.mesh.position.set(part.x, part.y, part.z);
    }

    // Slight Rotation
    this.camera.translateX(10);

    if (this.controls)
        this.controls.update();

    this._renderer.render(this._scene, this.camera);
};
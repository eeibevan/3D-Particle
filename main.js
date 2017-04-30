$(document).ready(function () {
    var container;
    var camera, controls, scene, renderer;

    var sys;
    const WIDTH = 1000;
    const HEIGHT = 1000;
    const DEPTH = 1000;
    const N = 500;

    init();
    animate();

    function applyVertexColors(g, c) {
        g.faces.forEach( function( f ) {
            var n = ( f instanceof THREE.Face3 ) ? 3 : 4;
            for( var j = 0; j < n; j ++ ) {
                f.vertexColors[ j ] = c;
            }
        } );
    }

    function addCtrls() {
        controls = new THREE.TrackballControls( camera );
        controls.rotateSpeed = 10;
        controls.zoomSpeed = 10;
        controls.panSpeed = 10;
        controls.noZoom = false;
        controls.noPan = false;
        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.3;
    }

    function mkGe() {
        var geometry = new THREE.SphereGeometry( 5, 5, 5 );

        var color = new THREE.Color();
        applyVertexColors(geometry, color.setHex(Math.random() * 0xffffff ));

        var material =  new THREE.MeshPhongMaterial({
            color: 0xffffff,
            shading: THREE.FlatShading,
            vertexColors: THREE.VertexColors, shininess: 0
        });
        var sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(Math.random() * 100 + 10, Math.random() * 100 + 10, Math.random() * 100 + 10);
        return sphere;
    }

    function addGeom() {
        var particles = [];
        for (var i = 0; i < N; i ++) {
            var add = mkGe();
            particles.push(add);
            scene.add(add);
        }
        return particles;
    }

    function init() {
        container = document.getElementById( "container" );

        camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000000 );
        camera.position.x = DEPTH;
        camera.position.y = DEPTH;
        camera.position.z = DEPTH;

        scene = new THREE.Scene();
        scene.add(new THREE.AmbientLight(0x555555));

        var light = new THREE.SpotLight( 0xffffff, 1.5 );
        light.position.set( 0, 0, DEPTH + 500 );
        scene.add( light );

        var meshes = addGeom();

        var geometry = new THREE.SphereGeometry( 5, 5, 5 );
        var material =  new THREE.MeshPhongMaterial({
            color: 0xffffff,
            shading: THREE.FlatShading,
            vertexColors: THREE.VertexColors, shininess: 0
        });
        var meshProvider = new MeshProvider(scene, material);
        sys = new System(-WIDTH, -HEIGHT, -DEPTH, WIDTH, HEIGHT, DEPTH, N, meshes, meshProvider);

        addCtrls();

        var gridHelper = new THREE.GridHelper( DEPTH * 2, 40, 0x0000ff, 0x808080 );
        gridHelper.position.y = 0;
        gridHelper.position.x = 0;
        scene.add( gridHelper );

        renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(0x000000);
        //renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.sortObjects = false;
        container.appendChild(renderer.domElement);
    }

    function animate() {
        requestAnimationFrame( animate );
        sys.tick();
        for (var i = 0; i < sys.particles.length; i++) {
            var part = sys.particles[i];

            part.mesh.position.set(part.x, part.y, part.z)
        }
        controls.update();
        renderer.render( scene, camera );
    }
});
$(document).ready(function () {
    var container;
    var camera, controls, scene, renderer;
    var particles = [];
    const WIDTH = 5000;
    const HEIGHT = 25;
    const DEPTH = 5000;
    const N = 50;

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
        controls.rotateSpeed = 1.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;
        controls.noZoom = false;
        controls.noPan = false;
        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.3;
    }

    function addGeom() {
        var geometry = new THREE.Geometry();
        var defaultMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            shading: THREE.FlatShading,
            vertexColors: THREE.VertexColors, shininess: 0
        });

        var geom = new THREE.SphereGeometry(5, 5, 5);
        var matrix = new THREE.Matrix4();
        var quaternion = new THREE.Quaternion();

        for (var i = 0; i < N; i ++) {
            var position = new THREE.Vector3();
            position.x = Math.random() * (WIDTH * 2) - WIDTH;
            position.y = Math.random() * (HEIGHT * 2) - HEIGHT;
            position.z = Math.random() * (DEPTH * 2) - DEPTH;

            var rotation = new THREE.Euler();
            rotation.x = Math.random() * 2 * Math.PI;
            rotation.y = Math.random() * 2 * Math.PI;
            rotation.z = Math.random() * 2 * Math.PI;

            var scale = new THREE.Vector3();
            var ns = Math.random() * 50 + 10;
            scale.x = ns;
            scale.y = ns;
            scale.z = ns;

            quaternion.setFromEuler( rotation, false );
            matrix.compose( position, quaternion, scale );

            var color = new THREE.Color();
            applyVertexColors(geom, color.setHex(Math.random() * 0xffffff ));

            geometry.merge(geom, matrix);
        }
        var drawnObject = new THREE.Mesh(geometry, defaultMaterial);
        particles.push(drawnObject);
        scene.add( drawnObject );
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

        addGeom();
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
        particles.forEach(function (part) {
            part.translateX(Math.random() * 50);
            part.translateY(Math.random() * 50);
            part.translateZ(Math.random() * 50);
        });
        controls.update();
        renderer.render( scene, camera );
    }
});
$(document).ready(function () {
    var container;
    var camera, controls, scene, renderer;
    var particles = [];
    const WIDTH = 100;
    const HEIGHT = 100;
    const DEPTH = 100;
    const N = 10;

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
        controls.zoomSpeed = 10;
        controls.panSpeed = 0.8;
        controls.noZoom = false;
        controls.noPan = false;
        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.3;
    }

    function mkGe() {
        var geometry = new THREE.SphereGeometry( 5, 5, 5 );

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
        for (var i = 0; i < N; i ++) {
            var add = mkGe();
            particles.push(add);
            scene.add(add);
        }

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

        for (var i = 0; i < particles.length; i++) {
            var part = particles[i];
            scene.updateMatrixWorld();
            var position  = new THREE.Vector3();
            position.setFromMatrixPosition(part.matrixWorld);

            //part.geometry.computeBoundingSphere();
            //var position = part.geometry.boundingSphere.center;

            //part.mesh.position.x += part.dx;
            part.translateX(1);
            if (position.x > WIDTH || position.x < -WIDTH) {
                //part.dx *= -1;
                part.position.set(0, position.y, position.z);
            }

            part.translateY(1);
            if (position.y > HEIGHT || position.y < -HEIGHT) {
                //part.dy *= -1;
                part.position.set(position.x,0,position.z);
            }

            part.translateZ(1);
            if (position.z > DEPTH || position.z < -DEPTH) {
                //part.dz *= -1;
                part.position.set(position.x,position.y,0);
            }
        }
        controls.update();
        renderer.render( scene, camera );
    }
});
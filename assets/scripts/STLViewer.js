function STLViewer(model_url) {
    if (!Detector.webgl) Detector.addGetWebGLMessage();
    var $container;
    var camera, controls, cameraTarget, scene, renderer, point_light;


    $container = $('body');

    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 15000);
    camera.position.set(50, 50, 50);
    cameraTarget = new THREE.Vector3();
    controls = new THREE.OrbitControls(camera, document);
    controls.target = cameraTarget;
    controls.addEventListener('change', render);
    controls.enableDamping = true;
    controls.enableKeys = false;
    controls.rotateSpeed = 0.15;
    controls.dampingFactor = 0.125;
    controls.enableZoom = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.25;
    controls.autoRotateDelay = 5000;
    scene = new THREE.Scene();

    var loader = new THREE.STLLoader();

    point_light = new THREE.PointLight( 0xdddddd, 0.75, 0 );
    point_light.position.set(0, 20, 0);

    onProgress = function(event) {
        console.log(event.loaded + "/" + event.total);
        $('#percent').text(Math.floor(event.loaded / event.total * 100.0) + "%");
    };

    loader.load(model_url, function(geometry) {
        var material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            specular: 0x111111,
            shininess: 0,
            wireframe: false,
            polygonOffset: true,
            polygonOffsetFactor: 1,
            polygonOffsetUnits: 1,
            transparent: true,
            opacity: 0.8
        });
        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0, 0, 0);
        mesh.castShadow = false;
        mesh.receiveShadow = false;
        scene.add(mesh);
        console.log("a");
        var edges = new THREE.EdgesGeometry(geometry, 29);
        var line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
            color: 0x888888
        }));
        scene.add(line);

        geometry.computeBoundingSphere();
        geometry.computeBoundingBox();
        cameraTarget.copy(geometry.boundingSphere.center);

        var r = geometry.boundingSphere.radius;
        controls.maxDistance = r * 10;

        camera.position.set(
            r * 1.5 + cameraTarget.x,
            r * 1.5 + cameraTarget.y,
            r * 1.5 + cameraTarget.z
        );

        $container.addClass('loaded');

    }, onProgress);

    // Lights
    scene.add(new THREE.HemisphereLight(0x999999, 0x555555));
    camera.add( point_light );
    scene.add(camera);

    renderer = new THREE.WebGLRenderer({
        antialias: false
    });
    renderer.setClearColor(0xffffff);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.cullFace = THREE.CullFaceBack;
    $container.append(renderer.domElement);

    $(window).resize(function() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    //stats = new Stats();
    //stats.domElement.style.position = 'absolute';
    //stats.domElement.style.top = '0px';
    //$container.append(stats.domElement);

    animate();

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        render();
        //stats.update();
    }

    function render() {
        camera.lookAt(cameraTarget);
        renderer.render(scene, camera);
    }
}
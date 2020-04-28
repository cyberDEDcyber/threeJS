$(document).ready(function () {
    console.log("Można pracować w Jquery");
    var hex = new Hex3D(2,1);
    var x = $(window).width();
    var y = $(window).height();
    var angle = Math.PI / 2;
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(
        45,    // kąt patrzenia kamery (FOV - field of view)
        x / y,    // proporcje widoku, powinny odpowiadać proporjom naszego ekranu przeglądarki
        0.1,    // minimalna renderowana odległość
        10000    // maxymalna renderowana odległość od kamery 
    );

    //OSIE
    var axes = new THREE.AxesHelper(1000);
    scene.add(axes);
    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xffffff);
    renderer.setSize(x, y);

    //RUCH KAMERY
    var orbitControl = new THREE.OrbitControls(camera, renderer.domElement);
    orbitControl.addEventListener('change', function () {
        renderer.render(scene, camera);
    });

    //PODŁOGA
    var geometry = Settings.planeGeometry;
    var material = Settings.materialTransparent;
    var plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = angle;
    scene.add(plane);

    //HEX
    scene.add(hex);


    //dodanie renderera do diva, który istnieje na scenie
    $("#root").append(renderer.domElement);

    camera.position.set(500, 500, 500);
    camera.lookAt(scene.position);

    //RENDER
    function render() {
        x = $(window).width();
        y = $(window).height();
        renderer.setSize(x, y);
        camera.aspect = x / y;
        camera.updateProjectionMatrix();

        requestAnimationFrame(render);

        renderer.render(scene, camera);
        //console.log("render chodzi");
    }
    render();

});
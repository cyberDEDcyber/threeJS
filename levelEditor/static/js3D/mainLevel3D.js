$(document).ready(function () {
    console.log("Można pracować w Jquery");

    //ZMIENNE
    pierwszaTura = true;

    //SELECT
    function show() {
        $.ajax({
            url: "",
            data: {
                action: "SHOW",
            },
            type: "POST",
            success: function (data) {
                levelIl = JSON.parse(data);
                var level = $("<select>");
                for (let i = 0; i < levelIl; i++) {
                    var option = $("<option>");
                    option.text(i);
                    level.append(option);
                }
                $("#chose").append(level);
                var button = $("<button>");
                button.attr("id", "levelBt");
                button.text("Zrób Level");
                button.on("click", function () {
                    makeLevel(level.val(), scene);
                });
                $("#chose").append(button);

            },
            error: function (xhr, status, error) {
                console.log(xhr);
            },
        });
    }
    show();

    //DIV
    var div = $("<div>");
    div.attr("id", "trush");
    $("#control2").append(div);

    //WEBGL
    var x = $(window).width() - 60;
    var y = $(window).height() - 60;
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

    //dodanie renderera do diva, który istnieje na scenie
    $("#root").append(renderer.domElement);

    camera.position.set(0, 2000, 0);
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

//ZROBIENIE LEVELA
function makeLevel(level, scene) {
    $.ajax({
        url: "",
        data: {
            action: "WCZYTAJ",
            level: level,
        },
        type: "POST",
        success: function (data) {

            //CZYSZCZENIE KONTENERA
            if (pierwszaTura == true) {
                pierwszaTura = false;
            }
            else {
                scene.children.pop();
            }

            //Kontener
            var levelKontener = new THREE.Object3D();

            //RANGE i Światła
            var pierwsze = true;
            $("#trush").empty();

            //TABLICA
            obj = JSON.parse(data);
            $("#table2").text(" level: " + JSON.stringify(obj));

            //LEVEL 3D HEX
            for (let i = 0; i < obj.length; i++) {

                //PIERWSZY HEX
                if (i == 0) {
                    door2 = 7;
                    door1 = obj[i].dirOut;
                }

                //OSTATNI
                else if (i == obj.length - 1) {
                    door1 = 7;
                    door2 = obj[i - 1].dirIn;
                }

                else {
                    door1 = obj[i].dirOut;
                    door2 = obj[i - 1].dirIn;
                }
                var hex = new Hex3D(door1, door2);
                var angle = Math.PI / 2;
                hex.rotation.y = angle;
                hex.position.x = -800 + obj[i].x * Settings.radius * 1.5;
                if (obj[i].x % 2 != 0) {
                    hex.position.z = (-800 + obj[i].z * Settings.radius * 1.8) + Settings.radius * 0.9; //0.9
                }
                else {
                    hex.position.z = -800 + obj[i].z * Settings.radius * 1.8;
                }
                levelKontener.add(hex);

                //ITEMY
                if (obj[i].what == "items") {
                    var geometry = Settings.CubeGeometry;
                    var material = Settings.materialCyan;
                    var cube = new THREE.Mesh(geometry, material);
                    cube.position.y = Settings.radius / 10;
                    cube.position.x = hex.position.x;
                    cube.position.z = hex.position.z;
                    levelKontener.add(cube);
                }

                //ŚWIATŁO
                if (obj[i].what == "light") {
                    var light = new Light3D(300, Settings.posY);
                    light.position.x = hex.position.x;
                    light.position.z = hex.position.z;
                    levelKontener.add(light);
                    if (pierwsze == true) {
                        pierwsze = false;
                        var input = $("<input>");
                        input.attr("type", "range");
                        input.attr("min", 60);
                        input.attr("max", 200);
                        input.attr("value", 60);
                        input.attr("id", "posY");
                        input.on("mousemove", function () {
                            var ui = new uiLight();
                            ui.changePosY(levelKontener, input.val());
                        })
                        $("#trush").append(input);
                        var input2 = $("<input>");
                        input2.attr("type", "range");
                        input2.attr("min", 300);
                        input2.attr("max", 600);
                        input2.attr("value", 300);
                        input2.attr("id", "intensity");
                        input2.on("mousemove", function () {
                            var ui = new uiLight();
                            ui.changeIntensity(levelKontener, input2.val());
                        })
                        $("#trush").append(input2);
                    }

                }
            }
            scene.add(levelKontener);
        },
        error: function (xhr, status, error) {
            console.log(xhr);
        },
    });
}
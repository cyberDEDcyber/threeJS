$(document).ready(function () {
    console.log("Można pracować w Jquery");

    //ZMIENNE
    pierwszaTura = true;
    klik = false;
    model = new Model();
    player = new Player(model);
    allies = [];
    var clickedVect = new THREE.Vector3(0, 0, 0); // wektor określający PUNKT kliknięcia
    var directionVect = new THREE.Vector3(0, 0, 0); // wektor określający KIERUNEK ruchu playera

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
                    makeLevel(level.val(), scene, camera, player);
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
    var clock = new THREE.Clock();
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
    //var orbitControl = new THREE.OrbitControls(camera, renderer.domElement);
    //orbitControl.addEventListener('change', function () {
    //renderer.render(scene, camera);
    //});

    //PODŁOGA
    var geometry = Settings.planeGeometry;
    var material = Settings.materialTransparent;
    var plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = angle;
    scene.add(plane);

    //dodanie renderera do diva, który istnieje na scenie
    $("#root").append(renderer.domElement);

    camera.position.set(-800, 420, -400);
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

        //RUCH GRACZA
        if (klik == true) {
            player.getPlayerCont().translateOnAxis(directionVect, 5);
            player.getPlayerCont().position.y = Settings.radius / 10;
            camera.position.x = player.getPlayerCont().position.x;
            camera.position.z = player.getPlayerCont().position.z + 400;
            camera.position.y = player.getPlayerCont().position.y + 600;
            camera.lookAt(player.getPlayerCont().position);
            model.setAnimation();
            if (player.getPlayerCont().position.distanceTo(clickedVect) < 20) {
                klik = false;
                model.stopAnimation();
            }
        }
        delta = clock.getDelta();
        Settings.delta = delta;
        model.updateModel();

        //RUCH TOWARZYSZY
        for (let i = 0; i < allies.length; i++) {
            var raycaster = new THREE.Raycaster(); // obiekt symulujący "rzucanie" promieni
            var mouseVector = new THREE.Vector2() // ten wektor czyli pozycja w przestrzeni 2D na ekranie(x,y) wykorzystany będzie do określenie pozycji myszy na ekranie a potem przeliczenia na pozycje 3D
            mouseVector.x = (allies[i] / $(window).width()) * 2 - 1;
            mouseVector.y = -(allies[i] / $(window).height()) * 2 + 1;
            raycaster.setFromCamera(mouseVector, camera);
            var intersects = raycaster.intersectObjects(scene.children, true);
            if (intersects.length > 0) {
                klikAllies = true;
                clickedVect = player.position;
                directionVect = clickedVect.clone().sub(allies[i].position).normalize();
                var angle = Math.atan2(
                    allies[i].position.clone().x - clickedVect.x,
                    allies[i].position.clone().z - clickedVect.z,
                )
                allies[i].rotation.y = angle;
            }
        }
        if(klik == true){
            for (let i = 0; i < allies.length; i++) {
                allies[i].translateOnAxis(directionVect, 4);
                allies[i].position.y = Settings.radius / 10;
            }
        }  
    }
    render();

    //PODSWIETLENIE PRZECIWNIKA
    // $("#root").mousemove(function (event) {
    //     console.log("ruszam");
    //     var raycaster = new THREE.Raycaster(); // obiekt symulujący "rzucanie" promieni
    //     var mouseVector = new THREE.Vector2() // ten wektor czyli pozycja w przestrzeni 2D na ekranie(x,y) wykorzystany będzie do określenie pozycji myszy na ekranie a potem przeliczenia na pozycje 3D
    //     mouseVector.x = (event.clientX / $(window).width()) * 2 - 1;
    //     mouseVector.y = -(event.clientY / $(window).height()) * 2 + 1;
    //     raycaster.setFromCamera(mouseVector, camera);
    //     var intersects = raycaster.intersectObjects(scene.children, true);
    //     if (intersects.length > 0) {
    //         //console.log(intersects[0].object);
    //         if (intersects[0].object.name == "allies") {
    //             console.log("allies");

    //         }
    //     }
    // })

    //RUCH
    $("#root").mousedown(function (event) {
        $("#root").mousemove(function (event) {
            var raycaster = new THREE.Raycaster(); // obiekt symulujący "rzucanie" promieni
            var mouseVector = new THREE.Vector2() // ten wektor czyli pozycja w przestrzeni 2D na ekranie(x,y) wykorzystany będzie do określenie pozycji myszy na ekranie a potem przeliczenia na pozycje 3D
            mouseVector.x = (event.clientX / $(window).width()) * 2 - 1;
            mouseVector.y = -(event.clientY / $(window).height()) * 2 + 1;
            raycaster.setFromCamera(mouseVector, camera);
            var intersects = raycaster.intersectObjects(scene.children, true);
            if (intersects.length > 0) {
                //console.log(intersects[0].object);
                if (intersects[0].object.name == "allies") {
                    console.log("allies");
                    allies.push(intersects[0].object);
                }
                else {
                    clickedVect = intersects[0].point;
                    directionVect = clickedVect.clone().sub(player.getPlayerCont().position).normalize();
                    klik = true;
                    var angle = Math.atan2(
                        player.getPlayerCont().position.clone().x - clickedVect.x,
                        player.getPlayerCont().position.clone().z - clickedVect.z
                    )
                    player.getPlayerMesh().rotation.y = angle;
                }
            }
            $("#root").mouseup(function () {
                $("#root").unbind("mousemove");
            })
        })
    })
});

//ZROBIENIE LEVELA
function makeLevel(level, scene, camera, player) {
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

                //KAMERA i PLAYER
                if (i == 0) {
                    player = player.getPlayerCont();
                    player.position.y = Settings.radius / 10;
                    player.position.x = hex.position.x;
                    player.position.z = hex.position.z;
                    scene.add(player);
                    camera.position.y = 400;
                    camera.position.x = hex.position.x - 100;
                    camera.position.z = hex.position.z - 100;
                    camera.lookAt(player.position);

                }

                //ITEMY
                if (obj[i].what == "items") {
                    var geometry = Settings.CubeGeometry;
                    var material = Settings.materialChest1;
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

                //ALLIES
                if (obj[i].what == "allies") {
                    var allies = new ModelA;
                    allies = allies.loadModel("/models/trisA.js");
                    levelKontener.add(allies);
                }
            }
            scene.add(levelKontener);
        },
        error: function (xhr, status, error) {
            console.log(xhr);
        },
    });
}

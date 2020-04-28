var geometry = Settings.CubeGeometry;
var material = Settings.materialChest1;

class Player {

    constructor(model) {
        this.container = new THREE.Object3D();
        this.model = model;

        // MODEL
        var player = this.model;
        player = player.loadModel("/models/TRIS.js");
        this.container.add(player);
        this.player = player;

        //ŚWIATŁO
        var light = new THREE.PointLight(0xffffff, 100, 100, 2);
        this.container.add(light);

        //OSIE
        // this.axes = new THREE.AxesHelper(200)
        // this.container.add(this.axes);
    }

    //funkcja zwracająca kontener

    getPlayerCont() {
        return this.container;
    }

    //funkcja zwracająca playera

    getPlayerMesh() {
        return this.player;
    }
}
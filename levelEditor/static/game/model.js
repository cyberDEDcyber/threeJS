class Model {

    constructor() {
        this.mixer = null;
    }

    //RETURN MODELA
    loadModel(url) {
        var modelMaterial = new THREE.MeshBasicMaterial(
            {
                map: new THREE.TextureLoader().load("tekstury/BAUUL.jpg"),
                morphTargets: true // ta własność odpowiada za animację materiału modelu
            });
        var loader = new THREE.JSONLoader();
        var player = new THREE.Object3D();
        var mixer;
        var that = this;
        loader.load(url, function (geometry) {
            var meshModel = new THREE.Mesh(geometry, modelMaterial);
            meshModel.name = "player";
            meshModel.rotation.y = -Math.PI/2;
            meshModel.scale.set(2,2,2);
            mixer = new THREE.AnimationMixer(meshModel);
            mixer.clipAction("stand").play();
            that.mixer = mixer;
            player.add(meshModel);
            //console.log(geometry.animations);
       });
       return player;
    }

    // update mixera
    updateModel() {
        if (this.mixer) this.mixer.update(Settings.delta);
    }

    //animowanie postaci
    setAnimation() {
        this.mixer.clipAction("stand").stop();
        this.mixer.clipAction("run").play();
    }
    
    stopAnimation() {
        this.mixer.clipAction("stand").play();
        this.mixer.clipAction("run").stop();
    }

}
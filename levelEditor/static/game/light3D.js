class Light3D {

    constructor(intensity, position) {
        var lightKontener = new THREE.Object3D();
        lightKontener.position.y = position;
        var light = new THREE.PointLight(0xff0000, intensity/2, intensity/2, 2);
        lightKontener.add(light);
        lightKontener.type = "light";
        return lightKontener;
    }
}
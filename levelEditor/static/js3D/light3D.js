class Light3D {

    constructor(intensity, position) {
        var lightKontener = new THREE.Object3D();
        lightKontener.position.y = position;
        var light = new THREE.PointLight(0xff0000, intensity, intensity);
        lightKontener.add(light);
        var geometry = Settings.SphereGeometry;
        var material = Settings.materialCyan;
        var lightPos = new THREE.Mesh(geometry, material);
        lightKontener.add(lightPos);
        lightKontener.type = "light";
        return lightKontener;
    }
}
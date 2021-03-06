class Doors3D {
    constructor(material) {

        var radius = Settings.radius; // zmienna wielkość hexagona, a tym samym całego labiryntu

        var container = new THREE.Object3D() // kontener na obiekty 3D

        var geometry = Settings.doorGeometry;

        var door1 = new THREE.Mesh(geometry, material);
        door1.position.x = -(Settings.radius/10)*3;
        var door2 = new THREE.Mesh(geometry, material);
        door2.position.x = (Settings.radius/10)*3;
        container.add(door1, door2);
        
        return container
    }
}
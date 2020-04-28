class Hex3D {
    constructor(door1, door2) {

        var radius = Settings.radius; // zmienna wielkość hexagona, a tym samym całego labiryntu

        var container = new THREE.Object3D() // kontener na obiekty 3D

        var material = Settings.materialWall;
        var geometry = Settings.wallGeometry;
        var wall = new THREE.Mesh(geometry, material);

        for (let i = 0; i < 6; i++) {

            //DRZWI
            if (i == door1 || i == door2) {
                var door = new Doors3D(material);
                var dl = (radius * Math.sqrt(3)) / 2
                door.position.x = dl * Math.cos(Math.PI / 3 * i);
                door.position.z = dl * Math.sin(Math.PI / 3 * i);
                door.lookAt(container.position)
                container.add(door);
            }

            //ŚCIANY
            else {
                var side = wall.clone()
                var dl = (radius * Math.sqrt(3)) / 2
                side.position.x = dl * Math.cos(Math.PI / 3 * i);
                side.position.z = dl * Math.sin(Math.PI / 3 * i);
                side.lookAt(container.position) // nakierowanie ścian na środek kontenera 3D  
                container.add(side);
            }
        }

        //PODŁOGA
        var material = Settings.materialFloor;
        var geometry = Settings.floorGeometry;
        var floor = new THREE.Mesh(geometry, material);
        floor.position.y = -Settings.posY;
        container.add(floor);

        //Y
        container.position.y = Settings.posY;
        
        return container
    }
}
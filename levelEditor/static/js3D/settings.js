var radius = 200;
var Settings = {
    delta: 0,
    radius: radius,
    posY: 70,
    materialTransparent: new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide, wireframe: true }),
    materialBlack: new THREE.MeshPhongMaterial({ color: 0x000000, side: THREE.DoubleSide, }),
    materialCyan: new THREE.MeshNormalMaterial({ color: 0x00ffff, side: THREE.DoubleSide, }),
    materialWall: new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, map: new THREE.TextureLoader().load('/tekstury/wall.jpg'), transparent: true, opacity: 1 }),
    materialFloor: new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, map: new THREE.TextureLoader().load('/tekstury/floor.jpg'), transparent: true, opacity: 1 }),
    materialChest1: new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, map: new THREE.TextureLoader().load('/tekstury/wood.jpg'), transparent: true, opacity: 1 }),
    planeGeometry: new THREE.PlaneGeometry(2000, 2000, 30, 30),
    wallGeometry: new THREE.BoxGeometry(radius, 140, 30),
    doorGeometry: new THREE.BoxGeometry((radius / 10) * 2, 140, 30),
    floorGeometry: new THREE.CylinderGeometry(radius + 15, radius + 15, 0, 6),
    CubeGeometry: new THREE.BoxGeometry(radius / 5, radius / 5, radius / 5),
    SphereGeometry: new THREE.SphereGeometry(radius / 6, 32, 32),
}
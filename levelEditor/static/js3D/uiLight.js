class uiLight {

    constructor() {
    }
    changePosY(levele, val) {
        for (let i = 0; i < levele.children.length; i++) {
            if (levele.children[i].type == "light") {
                levele.children[i].position.y = val;
            }
        }
    }
    changeIntensity(levele, val) {
        for (let i = 0; i < levele.children.length; i++) {
            if (levele.children[i].type == "light") {
                var light = new Light3D(val, levele.children[i].position.y);
                var kontener = levele.children[i];
                light.position.x = kontener.position.x;
                light.position.z = kontener.position.z;
                levele.remove(kontener);
                levele.add(light);

            }
        }
    }
}
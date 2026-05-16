export function setupLighting(scene) {
    // Luz ambiente (baixa para sombras profundas)
    scene.add(new THREE.AmbientLight(0x224455, 0.018));
    
    // Luz hemisférica (contraste)
    const hemi = new THREE.HemisphereLight(0x88aacc, 0x224466, 0.65);
    scene.add(hemi);
    
    // Luz de preenchimento suave
    const fillLight = new THREE.PointLight(0x6688aa, 0.12);
    fillLight.position.set(0, 15, 0);
    scene.add(fillLight);
}

export function createSunDirectionalLight() {
    const light = new THREE.DirectionalLight(0xffeedd, 0.01);
    light.castShadow = true;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 200;
    light.shadow.camera.left = -120;
    light.shadow.camera.right = 120;
    light.shadow.camera.top = 120;
    light.shadow.camera.bottom = -120;
    return light;
}

export function createScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x04060f);
    return scene;
}

export function createCamera() {
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(0, 140, 190);
    return camera;
}

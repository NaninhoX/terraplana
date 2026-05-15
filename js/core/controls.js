import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function createOrbitControls(camera, domElement) {
    const controls = new OrbitControls(camera, domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 30;
    controls.maxDistance = 700;
    return controls;
}

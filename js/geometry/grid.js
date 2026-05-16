import { AR, DR } from '../utils/constants.js';

export function createGrid(scene) {
    const gridGroup = new THREE.Group();
    const Y0 = 1.15;
    const gMat = new THREE.LineBasicMaterial({ color: 0x2255aa, transparent: true, opacity: 0.4 });
    
    // Linhas radiais
    for (let i = 0; i < 24; i++) {
        const a = (i / 24) * Math.PI * 2;
        const points = [
            new THREE.Vector3(Math.cos(a) * AR, Y0, Math.sin(a) * AR),
            new THREE.Vector3(Math.cos(a) * DR, Y0, Math.sin(a) * DR)
        ];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        gridGroup.add(new THREE.Line(geometry, gMat));
    }
    
    // Círculos concêntricos
    [14, 28, 42, 62, 78, 92].forEach(r => {
        const pts = [];
        for (let i = 0; i <= 128; i++) {
            const a = (i / 128) * Math.PI * 2;
            pts.push(new THREE.Vector3(Math.cos(a) * r, Y0, Math.sin(a) * r));
        }
        const geometry = new THREE.BufferGeometry().setFromPoints(pts);
        gridGroup.add(new THREE.Line(geometry, gMat));
    });
    
    scene.add(gridGroup);
    return gridGroup;
}

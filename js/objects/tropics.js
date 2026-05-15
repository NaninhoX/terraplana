import * as THREE from 'three';
import { R_CANCER, R_EQUATOR, R_CAPRI } from '../utils/constants.js';

export function createTropics(scene) {
    const tropicsGroup = new THREE.Group();
    const YL = 1.2;
    
    function circleLine(r, c, op = 1) {
        const pts = [];
        for (let i = 0; i <= 200; i++) {
            const a = (i / 200) * Math.PI * 2;
            pts.push(new THREE.Vector3(Math.cos(a) * r, YL, Math.sin(a) * r));
        }
        const geometry = new THREE.BufferGeometry().setFromPoints(pts);
        return new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: c, transparent: op < 1, opacity: op }));
    }
    
    tropicsGroup.add(circleLine(R_CANCER, 0xff6600, 0.9));
    tropicsGroup.add(circleLine(R_EQUATOR, 0x00ff88, 0.9));
    tropicsGroup.add(circleLine(R_CAPRI, 0x2299ff, 0.9));
    
    scene.add(tropicsGroup);
    return tropicsGroup;
}

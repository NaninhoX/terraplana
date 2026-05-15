import * as THREE from 'three';

export function createStars(scene) {
    const starGroup = new THREE.Group();
    const N = 6000;
    const pos = new Float32Array(N * 3);
    
    for (let i = 0; i < N; i++) {
        const r = 700 + Math.random() * 300;
        const t = Math.random() * Math.PI * 2;
        const p = Math.acos(2 * Math.random() - 1);
        pos[i * 3] = r * Math.sin(p) * Math.cos(t);
        pos[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
        pos[i * 3 + 2] = r * Math.cos(p);
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    
    const stars = new THREE.Points(geometry,
        new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.85,
            sizeAttenuation: true,
            transparent: true,
            opacity: 0.82
        })
    );
    
    starGroup.add(stars);
    scene.add(starGroup);
    return starGroup;
}

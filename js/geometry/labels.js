import * as THREE from 'three';
import { DR, R_CANCER, R_EQUATOR, R_CAPRI, ICE_H } from '../utils/constants.js';

// Helper para roundRect
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        this.moveTo(x + r, y);
        this.lineTo(x + w - r, y);
        this.quadraticCurveTo(x + w, y, x + w, y + r);
        this.lineTo(x + w, y + h - r);
        this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        this.lineTo(x + r, y + h);
        this.quadraticCurveTo(x, y + h, x, y + h - r);
        this.lineTo(x, y + r);
        this.quadraticCurveTo(x, y, x + r, y);
        return this;
    };
}

function makeLabel(txt, color = '#fff', bg = 'rgba(0,0,0,0.7)', fs = 23) {
    const cv = document.createElement('canvas');
    cv.width = 512;
    cv.height = 60;
    const cx = cv.getContext('2d');
    cx.fillStyle = bg;
    cx.roundRect(0, 3, 512, 54, 7);
    cx.fill();
    cx.font = `bold ${fs}px monospace`;
    cx.fillStyle = color;
    cx.textAlign = 'center';
    cx.textBaseline = 'middle';
    cx.fillText(txt, 256, 30);
    const texture = new THREE.CanvasTexture(cv);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(20, 2.4, 1);
    return sprite;
}

export function createLabels(scene) {
    const labelsGroup = new THREE.Group();
    const YL = 1.2;
    
    const lCancer = makeLabel('Trópico de Câncer', '#ff8844');
    lCancer.position.set(R_CANCER + 1, YL + 1, 0);
    labelsGroup.add(lCancer);
    
    const lEquat = makeLabel('Equador', '#44ffaa');
    lEquat.position.set(-(R_EQUATOR + 1), YL + 1, 0);
    labelsGroup.add(lEquat);
    
    const lCapri = makeLabel('Trópico de Capricórnio', '#44aaff');
    lCapri.position.set(R_CAPRI + 1, YL + 1, 0);
    labelsGroup.add(lCapri);
    
    const lNP = makeLabel('Polo Norte (Ártico)', '#cce0ff', 'rgba(0,0,50,0.7)', 27);
    lNP.position.set(0, YL + 3, 0);
    labelsGroup.add(lNP);
    
    const lAnt = makeLabel('MURALHA DA ANTÁRTIDA', '#aaddff', 'rgba(0,15,35,0.8)', 27);
    lAnt.position.set(-(DR + 4), YL + ICE_H + 1, 0);
    labelsGroup.add(lAnt);
    
    // Labels de longitude
    for (let i = 0; i < 24; i++) {
        const a = (i / 24) * Math.PI * 2;
        const x = Math.cos(a) * (DR + 0.6);
        const z = Math.sin(a) * (DR + 0.6);
        const cv = document.createElement('canvas');
        cv.width = 60;
        cv.height = 30;
        const cx = cv.getContext('2d');
        cx.fillStyle = 'rgba(0,0,0,0.5)';
        cx.fillRect(0, 0, 60, 30);
        cx.font = 'bold 12px monospace';
        cx.fillStyle = '#88aaff';
        cx.textAlign = 'center';
        cx.textBaseline = 'middle';
        cx.fillText(`${i * 15}°`, 30, 15);
        const texture = new THREE.CanvasTexture(cv);
        const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(3, 1.5, 1);
        sprite.position.set(x, 0.3, z);
        labelsGroup.add(sprite);
    }
    
    scene.add(labelsGroup);
    return labelsGroup;
}

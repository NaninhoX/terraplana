import * as THREE from 'three';

export function createProceduralTexture() {
    const canvasTex = document.createElement('canvas');
    canvasTex.width = 1024;
    canvasTex.height = 1024;
    const ctx = canvasTex.getContext('2d');
    
    // Fundo oceano
    ctx.fillStyle = '#2a6a9a';
    ctx.fillRect(0, 0, canvasTex.width, canvasTex.height);
    
    // Gradiente
    const grad = ctx.createLinearGradient(0, 0, canvasTex.width, canvasTex.height);
    grad.addColorStop(0, '#1a5a8a');
    grad.addColorStop(1, '#3a7aaa');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvasTex.width, canvasTex.height);
    
    // Continentes
    ctx.fillStyle = '#8B5A2B';
    ctx.beginPath();
    ctx.ellipse(350, 450, 130, 110, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(550, 400, 140, 120, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(280, 300, 150, 130, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(700, 350, 200, 150, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(750, 650, 90, 70, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Ártico
    ctx.fillStyle = '#c9ddee';
    ctx.beginPath();
    ctx.arc(512, 512, 120, 0, Math.PI * 2);
    ctx.fill();
    
    // Detalhes
    ctx.fillStyle = '#c9a87b';
    ctx.beginPath();
    ctx.ellipse(400, 580, 80, 60, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(600, 600, 70, 55, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Ruído
    ctx.globalCompositeOperation = 'overlay';
    for (let i = 0; i < 8000; i++) {
        ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.1})`;
        ctx.fillRect(Math.random() * canvasTex.width, Math.random() * canvasTex.height, 2, 2);
    }
    ctx.globalCompositeOperation = 'source-over';
    
    const texture = new THREE.CanvasTexture(canvasTex);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 1);
    return texture;
}

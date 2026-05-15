let lastFrameTime = 0;

export function startAnimation(renderer, scene, camera, controls, updateCallback) {
    function animate(currentTime) {
        requestAnimationFrame(animate);
        
        if (lastFrameTime === 0) {
            lastFrameTime = currentTime;
            return;
        }
        
        let delta = Math.min(0.033, (currentTime - lastFrameTime) / 1000);
        if (delta < 0.001) return;
        lastFrameTime = currentTime;
        
        // Limitar FPS
        if (delta < 0.016) return;
        
        // Callback de atualização da simulação
        if (updateCallback) updateCallback(delta);
        
        controls.update();
        renderer.render(scene, camera);
    }
    
    animate(0);
}

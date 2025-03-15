/**
 * Utility functions for Mjolnir Smash game
 */

// Collision detection using bounding spheres
function checkCollision(object1, object2) {
    // Get positions
    const pos1 = object1.position.clone();
    const pos2 = object2.position.clone();
    
    // Calculate distance between centers
    const distance = pos1.distanceTo(pos2);
    
    // Get radiuses (assuming objects have a .radius property)
    const radius1 = object1.radius || 1;
    const radius2 = object2.radius || 1;
    
    // Check if distance is less than sum of radiuses
    return distance < (radius1 + radius2);
}

// Random number between min and max
function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

// Random integer between min and max (inclusive)
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Convert degrees to radians
function degToRad(degrees) {
    return degrees * (Math.PI / 180);
}

// Clamp a value between min and max
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

// Lerp (Linear interpolation) between two values
function lerp(start, end, amount) {
    return (1 - amount) * start + amount * end;
}

// Calculate difficulty based on score
function calculateDifficulty(score) {
    // Base difficulty starts at 1
    // Gradually increases based on score
    return 1 + (score / 500);
}

// Format score with commas for thousands
function formatScore(score) {
    return score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Shake effect for camera (when hitting objects)
function shakeCamera(camera, intensity, duration) {
    const originalPosition = camera.position.clone();
    let timeLeft = duration;
    
    function updateShake() {
        if (timeLeft <= 0) {
            camera.position.copy(originalPosition);
            return;
        }
        
        const shakeAmount = intensity * (timeLeft / duration);
        
        camera.position.set(
            originalPosition.x + randomRange(-shakeAmount, shakeAmount),
            originalPosition.y + randomRange(-shakeAmount, shakeAmount),
            originalPosition.z + randomRange(-shakeAmount, shakeAmount)
        );
        
        timeLeft -= 16; // Assuming 60fps (16ms per frame)
        requestAnimationFrame(updateShake);
    }
    
    updateShake();
} 
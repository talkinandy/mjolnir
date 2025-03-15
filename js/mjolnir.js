/**
 * Mjolnir weapon implementation for Mjolnir Smash
 */

class Mjolnir {
    constructor(scene, thor) {
        this.scene = scene;
        this.thor = thor;
        this.model = null;
        
        // Animation properties
        this.swinging = false;
        this.swingProgress = 0;
        this.swingDuration = 500; // ms
        this.swingStartTime = 0;
        this.swingTarget = new THREE.Vector3();
        this.swingOrigin = new THREE.Vector3();
        
        // Physics properties
        this.velocity = new THREE.Vector3();
        this.radius = 0.6; // Collision radius
        
        this.createPlaceholderModel();
    }
    
    createPlaceholderModel() {
        // Create hammer head
        const headGeometry = new THREE.BoxGeometry(0.8, 0.5, 0.5);
        const headMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x888888,
            roughness: 0.3, 
            metalness: 0.8
        });
        const hammerHead = new THREE.Mesh(headGeometry, headMaterial);
        hammerHead.position.set(0, 0.25, 0);
        hammerHead.castShadow = true;
        
        // Create handle
        const handleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 8);
        const handleMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x554433, 
            roughness: 0.8,
            metalness: 0.2
        });
        const handle = new THREE.Mesh(handleGeometry, handleMaterial);
        handle.position.set(0, -0.5, 0);
        handle.castShadow = true;
        
        // Group parts together
        this.model = new THREE.Group();
        this.model.add(hammerHead);
        this.model.add(handle);
        
        // Position next to Thor's hand
        const handPos = this.thor.getHandWorldPosition();
        this.model.position.copy(handPos);
        
        // Add to scene
        this.scene.add(this.model);
    }
    
    // Swing the hammer toward a target point
    swing(targetPoint) {
        if (this.swinging) return; // Don't start a new swing if already swinging
        
        this.swinging = true;
        this.swingProgress = 0;
        this.swingStartTime = Date.now();
        
        // Store origin (current position)
        this.swingOrigin.copy(this.model.position);
        
        // Set target position
        this.swingTarget.copy(targetPoint);
        
        // Calculate velocity for physics
        this.velocity.subVectors(this.swingTarget, this.swingOrigin);
        this.velocity.normalize().multiplyScalar(10); // Adjust speed as needed
        
        // Play swing sound (future implementation)
        // playSound('hammer_swing');
    }
    
    // Update swing animation
    updateSwing() {
        if (!this.swinging) return;
        
        const currentTime = Date.now();
        const elapsedTime = currentTime - this.swingStartTime;
        this.swingProgress = Math.min(1, elapsedTime / this.swingDuration);
        
        if (this.swingProgress < 1) {
            // Interpolate position for smooth movement
            const newPosition = new THREE.Vector3();
            
            // Use easing function for more natural movement
            const easeOut = 1 - Math.pow(1 - this.swingProgress, 3);
            
            newPosition.lerpVectors(this.swingOrigin, this.swingTarget, easeOut);
            this.model.position.copy(newPosition);
            
            // Add rotation during swing
            this.model.rotation.x = Math.sin(easeOut * Math.PI) * 2;
            this.model.rotation.z = Math.sin(easeOut * Math.PI * 0.5) * 0.5;
        } else {
            // Swing complete
            this.swinging = false;
            
            // Return to Thor's hand
            this.returnToHand();
        }
    }
    
    // Return hammer to Thor's hand
    returnToHand() {
        // Reset position to Thor's hand
        const handPos = this.thor.getHandWorldPosition();
        
        // Animate return (future enhancement)
        this.model.position.copy(handPos);
        this.model.rotation.set(0, 0, 0);
    }
    
    // Check if Mjolnir has hit an object
    checkHit(object) {
        // Only check for hits when swinging
        if (!this.swinging) return false;
        
        // Use utility function for collision detection
        return checkCollision(this.model, object);
    }
    
    // Update method to be called in animation loop
    update(deltaTime) {
        this.updateSwing();
    }
} 
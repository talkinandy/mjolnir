/**
 * Thor character implementation for Mjolnir Smash
 */

class Thor {
    constructor(scene) {
        this.scene = scene;
        this.model = null;
        this.handPosition = new THREE.Vector3(0, 0, 0);
        
        this.createPlaceholderModel();
    }
    
    createPlaceholderModel() {
        // Create a simple placeholder for Thor
        const geometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 16);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0x3366cc, // Blue for Thor
            roughness: 0.7,
            metalness: 0.3
        });
        
        this.model = new THREE.Mesh(geometry, material);
        this.model.position.set(0, 1, 0); // Place slightly above ground
        this.model.castShadow = true;
        this.model.receiveShadow = true;
        
        // Add a simple head
        const headGeometry = new THREE.SphereGeometry(0.4, 16, 16);
        const headMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xffcc99, // Skin color
            roughness: 0.5,
            metalness: 0
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 1.2; // Place on top of body
        head.castShadow = true;
        
        // Add simple arms
        const armGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.8, 8);
        const leftArm = new THREE.Mesh(armGeometry, material);
        leftArm.position.set(-0.7, 0.3, 0);
        leftArm.rotation.z = Math.PI / 2; // Rotate to be horizontal
        leftArm.castShadow = true;
        
        const rightArm = new THREE.Mesh(armGeometry, material);
        rightArm.position.set(0.7, 0.3, 0);
        rightArm.rotation.z = -Math.PI / 2; // Rotate to be horizontal
        rightArm.castShadow = true;
        
        // Add simple legs
        const legGeometry = new THREE.CylinderGeometry(0.25, 0.25, 1, 8);
        const leftLeg = new THREE.Mesh(legGeometry, material);
        leftLeg.position.set(-0.3, -1, 0);
        leftLeg.castShadow = true;
        
        const rightLeg = new THREE.Mesh(legGeometry, material);
        rightLeg.position.set(0.3, -1, 0);
        rightLeg.castShadow = true;
        
        // Group all parts together
        this.model.add(head);
        this.model.add(leftArm);
        this.model.add(rightArm);
        this.model.add(leftLeg);
        this.model.add(rightLeg);
        
        // Set the hand position for Mjolnir to attach to
        this.handPosition = new THREE.Vector3(0.9, 0.3, 0);
        
        // Add to scene
        this.scene.add(this.model);
    }
    
    // Future: Load actual 3D model
    loadModel() {
        // Load Thor model using GLTFLoader
        // This would replace the placeholder in a future implementation
    }
    
    // Get current hand position in world coordinates
    getHandWorldPosition() {
        const worldPosition = this.handPosition.clone();
        this.model.localToWorld(worldPosition);
        return worldPosition;
    }
    
    // Update method to be called in animation loop
    update(deltaTime) {
        // Future: Animation updates, etc.
    }
} 
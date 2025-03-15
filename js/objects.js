/**
 * Spawnable objects for Mjolnir Smash
 */

class GameObjects {
    constructor(scene) {
        this.scene = scene;
        this.objects = [];
        this.spawnInterval = 2000; // ms
        this.lastSpawnTime = 0;
        this.spawnBounds = {
            minX: -10,
            maxX: 10,
            minY: 1,
            maxY: 5,
            minZ: -5,
            maxZ: -15 // Objects spawn in front of camera (negative Z)
        };
        
        // Object types with their properties
        this.objectTypes = [
            {
                name: 'basic',
                geometry: new THREE.SphereGeometry(0.6, 16, 16),
                material: new THREE.MeshStandardMaterial({ 
                    color: 0xcc2222,
                    roughness: 0.7,
                    metalness: 0.3
                }),
                points: 10,
                health: 1,
                speed: 5,
                spawnWeight: 70 // Relative chance of spawning (out of total weights)
            },
            {
                name: 'tough',
                geometry: new THREE.BoxGeometry(1, 1, 1),
                material: new THREE.MeshStandardMaterial({ 
                    color: 0x8822cc,
                    roughness: 0.5,
                    metalness: 0.6
                }),
                points: 30,
                health: 2,
                speed: 3,
                spawnWeight: 20
            },
            {
                name: 'bonus',
                geometry: new THREE.OctahedronGeometry(0.5),
                material: new THREE.MeshStandardMaterial({ 
                    color: 0xffcc00,
                    roughness: 0.3,
                    metalness: 0.8,
                    emissive: 0xffcc00,
                    emissiveIntensity: 0.5
                }),
                points: 50,
                health: 1,
                speed: 7,
                spawnWeight: 10
            }
        ];
        
        // Calculate total spawn weight for object selection
        this.totalSpawnWeight = this.objectTypes.reduce((sum, type) => sum + type.spawnWeight, 0);
    }
    
    // Spawn a new object
    spawnObject(difficulty = 1) {
        // Select random object type based on spawn weights
        const randomValue = Math.random() * this.totalSpawnWeight;
        let weightSum = 0;
        let selectedType = this.objectTypes[0]; // Default to first type
        
        for (const type of this.objectTypes) {
            weightSum += type.spawnWeight;
            if (randomValue <= weightSum) {
                selectedType = type;
                break;
            }
        }
        
        // Create the mesh
        const mesh = new THREE.Mesh(selectedType.geometry, selectedType.material.clone());
        
        // Random position within spawn bounds
        const x = randomRange(this.spawnBounds.minX, this.spawnBounds.maxX);
        const y = randomRange(this.spawnBounds.minY, this.spawnBounds.maxY);
        const z = randomRange(this.spawnBounds.minZ, this.spawnBounds.maxZ);
        mesh.position.set(x, y, z);
        
        // Add physics properties
        mesh.velocity = new THREE.Vector3(0, 0, randomRange(selectedType.speed * 0.5, selectedType.speed) * difficulty);
        mesh.health = selectedType.health;
        mesh.points = selectedType.points;
        mesh.radius = selectedType.geometry.parameters.radius || 0.6; // Use radius if available, or default
        mesh.rotationSpeed = {
            x: randomRange(-2, 2),
            y: randomRange(-2, 2),
            z: randomRange(-2, 2)
        };
        
        // Add to scene and objects array
        this.scene.add(mesh);
        this.objects.push(mesh);
        
        return mesh;
    }
    
    // Update all objects
    update(deltaTime, difficulty = 1) {
        // Check if it's time to spawn a new object
        const currentTime = Date.now();
        const adjustedInterval = this.spawnInterval / difficulty; // Spawn faster as difficulty increases
        
        if (currentTime - this.lastSpawnTime > adjustedInterval) {
            this.spawnObject(difficulty);
            this.lastSpawnTime = currentTime;
        }
        
        // Update existing objects
        for (let i = this.objects.length - 1; i >= 0; i--) {
            const object = this.objects[i];
            
            // Update position based on velocity
            object.position.add(object.velocity.clone().multiplyScalar(deltaTime));
            
            // Rotate object for visual interest
            object.rotation.x += object.rotationSpeed.x * deltaTime;
            object.rotation.y += object.rotationSpeed.y * deltaTime;
            object.rotation.z += object.rotationSpeed.z * deltaTime;
            
            // Check if object is too far (passed the player)
            if (object.position.z > 5) {
                // Remove from scene and array
                this.scene.remove(object);
                this.objects.splice(i, 1);
                
                // Future: Handle missed objects (e.g., reduce health/lives)
            }
        }
    }
    
    // Handle collision with object
    hitObject(object) {
        // Reduce health
        object.health--;
        
        // If health is depleted, destroy object
        if (object.health <= 0) {
            // Remove from scene and array
            const index = this.objects.indexOf(object);
            if (index !== -1) {
                this.scene.remove(object);
                this.objects.splice(index, 1);
            }
            
            // Return points for scoring
            return object.points;
        }
        
        // Object still has health left
        return 0;
    }
    
    // Reset all objects
    reset() {
        // Remove all objects from scene
        for (const object of this.objects) {
            this.scene.remove(object);
        }
        
        // Clear array
        this.objects = [];
        this.lastSpawnTime = 0;
    }
} 
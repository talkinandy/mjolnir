/**
 * Mjolnir Smash main game file
 * Initializes Three.js scene, handles game loop, and manages game state
 */

// Game state
const GAME_STATE = {
    MENU: 'menu',
    PLAYING: 'playing',
    GAME_OVER: 'game_over'
};

class Game {
    constructor() {
        // Game state
        this.state = GAME_STATE.MENU;
        this.score = 0;
        this.lastFrameTime = 0;
        
        // DOM elements
        this.canvas = document.getElementById('game-canvas');
        this.scoreElement = document.getElementById('score');
        this.finalScoreElement = document.getElementById('final-score');
        this.startScreen = document.getElementById('start-screen');
        this.gameOverScreen = document.getElementById('game-over');
        this.gameUI = document.getElementById('game-ui');
        
        // Initialize Three.js
        this.initThree();
        
        // Create game components
        this.thor = new Thor(this.scene);
        this.mjolnir = new Mjolnir(this.scene, this.thor);
        this.gameObjects = new GameObjects(this.scene);
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Start animation loop
        this.animate();
    }
    
    initThree() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x222244); // Dark blue background
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 2, 10); // Position camera behind Thor
        this.camera.lookAt(0, 1, 0);
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        
        // Add lights
        this.addLights();
        
        // Add environment
        this.createEnvironment();
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    addLights() {
        // Ambient light for general illumination
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(ambientLight);
        
        // Directional light (main light)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 5);
        directionalLight.castShadow = true;
        
        // Configure shadow properties
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -20;
        directionalLight.shadow.camera.right = 20;
        directionalLight.shadow.camera.top = 20;
        directionalLight.shadow.camera.bottom = -20;
        
        this.scene.add(directionalLight);
    }
    
    createEnvironment() {
        // Ground plane
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x336699,
            roughness: 0.8,
            metalness: 0.2
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2; // Rotate to be horizontal
        ground.position.y = -1; // Position below Thor's feet
        ground.receiveShadow = true;
        this.scene.add(ground);
        
        // Future: Add more environment elements like mountains, buildings, etc.
    }
    
    onWindowResize() {
        // Update camera aspect ratio
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        
        // Update renderer size
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    setupEventListeners() {
        // Touch/click events for hammer swings
        this.canvas.addEventListener('click', (event) => this.handleTap(event));
        this.canvas.addEventListener('touchstart', (event) => this.handleTap(event));
        
        // Game UI buttons
        document.getElementById('start-button').addEventListener('click', () => this.startGame());
        document.getElementById('restart-button').addEventListener('click', () => this.startGame());
    }
    
    handleTap(event) {
        // Only process taps during gameplay
        if (this.state !== GAME_STATE.PLAYING) return;
        
        // Get tap coordinates
        let x, y;
        
        if (event.type === 'touchstart') {
            // Prevent default touch behavior
            event.preventDefault();
            x = event.touches[0].clientX;
            y = event.touches[0].clientY;
        } else {
            x = event.clientX;
            y = event.clientY;
        }
        
        // Convert to normalized device coordinates (-1 to +1)
        const ndcX = (x / window.innerWidth) * 2 - 1;
        const ndcY = -(y / window.innerHeight) * 2 + 1;
        
        // Create a raycaster
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), this.camera);
        
        // Get ray direction in world space
        const direction = new THREE.Vector3();
        raycaster.ray.direction.normalize();
        
        // Create target point along ray at a fixed distance
        const targetDistance = 15;
        const targetPoint = new THREE.Vector3();
        targetPoint.addVectors(
            raycaster.ray.origin,
            raycaster.ray.direction.clone().multiplyScalar(targetDistance)
        );
        
        // Swing Mjolnir to target point
        this.mjolnir.swing(targetPoint);
    }
    
    startGame() {
        // Reset game state
        this.state = GAME_STATE.PLAYING;
        this.score = 0;
        this.updateScoreDisplay();
        
        // Reset objects
        this.gameObjects.reset();
        
        // Update UI visibility
        this.startScreen.style.display = 'none';
        this.gameOverScreen.style.display = 'none';
        this.gameUI.style.display = 'block';
    }
    
    endGame() {
        this.state = GAME_STATE.GAME_OVER;
        
        // Update final score
        this.finalScoreElement.textContent = formatScore(this.score);
        
        // Show game over screen
        this.gameOverScreen.style.display = 'block';
    }
    
    updateScoreDisplay() {
        this.scoreElement.textContent = formatScore(this.score);
    }
    
    checkCollisions() {
        // Skip if Mjolnir is not swinging
        if (!this.mjolnir.swinging) return;
        
        // Check all game objects for collisions with Mjolnir
        for (const object of this.gameObjects.objects) {
            if (this.mjolnir.checkHit(object)) {
                // Hit confirmed - get points
                const points = this.gameObjects.hitObject(object);
                if (points > 0) {
                    this.score += points;
                    this.updateScoreDisplay();
                    
                    // Add camera shake effect
                    shakeCamera(this.camera, 0.1, 100);
                }
            }
        }
    }
    
    update(deltaTime) {
        // Skip updates if not playing
        if (this.state !== GAME_STATE.PLAYING) return;
        
        // Calculate current difficulty based on score
        const difficulty = calculateDifficulty(this.score);
        
        // Update game components
        this.thor.update(deltaTime);
        this.mjolnir.update(deltaTime);
        this.gameObjects.update(deltaTime, difficulty);
        
        // Check for collisions
        this.checkCollisions();
    }
    
    animate(currentTime = 0) {
        requestAnimationFrame((time) => this.animate(time));
        
        // Calculate delta time in seconds
        const deltaTime = (currentTime - this.lastFrameTime) / 1000;
        this.lastFrameTime = currentTime;
        
        // Skip first frame (deltaTime would be huge)
        if (deltaTime > 0.1) return;
        
        // Update game logic
        this.update(deltaTime);
        
        // Render scene
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the game when the DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
}); 
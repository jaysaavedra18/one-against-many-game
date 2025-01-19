import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Box } from '../classes/Box.js';
import { Controls } from './controls.js';
import { boxCollision } from '../utils/collision.js';

export class Game {
    constructor() {
        this.animationId = null;
        this.enemies = [];
        this.playerMovementSpeed = 0.15;
        this.spawnRate = 200;
        this.frames = 0;
        this.rotationSpeed = 0.05;
        this.playerRotation = 0; // Track player rotation angle
        this.isPaused = false;

        this.setupScene();
        this.setupObjects();
        this.setupLights();
        this.reset();
        this.controls = new Controls();
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(1, 2, 7);

        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.shadowMap.enabled = true;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        // Debugging camera controls
        // this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
    }

    setupObjects() {
        this.cube = new Box({
            width: 1, height: 1, depth: 1,
            color: 0x1e90ff,
            velocity: { x: 0, y: -0.01, z: 0 },
        });
        this.cube.castShadow = true;
        this.scene.add(this.cube);

        this.ground = new Box({
            width: 75, height: 0.1, depth: 75,
            position: { x: 0, y: -2, z: 0 },
        });
        this.ground.receiveShadow = true;
        this.scene.add(this.ground);
    }

    setupLights() {
        const light = new THREE.DirectionalLight(0xffffff, 5);
        light.castShadow = true;

        // Set the light's position to cover the game area
        light.position.set(25, 25, 25); // Position light high and at an angle to cover the area

        // Adjust shadow settings for better coverage
        light.shadow.mapSize.width = 2048;  // Higher resolution for better shadow quality
        light.shadow.mapSize.height = 2048;
        light.shadow.camera.near = 1;       // Shadow camera near clipping plane
        light.shadow.camera.far = 50;      // Shadow camera far clipping plane, covering the entire area
        light.shadow.camera.left = -25;    // Set the left boundary of the shadow camera
        light.shadow.camera.right = 25;    // Set the right boundary
        light.shadow.camera.top = 25;      // Set the top boundary
        light.shadow.camera.bottom = -25;  // Set the bottom boundary


        this.scene.add(light);
        // this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    }

    reset() {
        this.spawnRate = 200;
        this.frames = 0;
        this.isGameOver = false; // Add this flag
        this.isPaused = false;

        // Reset player position
        if (this.cube) {
            this.cube.position.set(0, 0, 0);
            this.cube.velocity = { x: 0, y: -0.01, z: 0 };
        }

        // Remove all existing enemies
        if (this.scene) {
            [...this.enemies].forEach(enemy => {
                this.scene.remove(enemy);
            });
        }
        // Clear the enemies array
        this.enemies = [];
    }

    updatePlayer() {
        // Handle rotations
        if (this.controls.keys.arrowLeft.pressed) {
            this.playerRotation += this.rotationSpeed;
            this.cube.rotation.y = this.playerRotation;
            this.updateCameraPosition();
        } else if (this.controls.keys.arrowRight.pressed) {
            this.playerRotation -= this.rotationSpeed;
            this.cube.rotation.y = this.playerRotation;
            this.updateCameraPosition();
        }

        // Calculate movement direction based on rotation
        const forward = new THREE.Vector3(0, 0, -1);
        forward.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.playerRotation);
        const right = new THREE.Vector3(1, 0, 0);
        right.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.playerRotation);

        this.cube.velocity.x = 0;
        this.cube.velocity.z = 0;

        // Apply movement in the rotated direction
        if (this.controls.keys.w.pressed) {
            this.cube.velocity.x = forward.x * this.playerMovementSpeed;
            this.cube.velocity.z = forward.z * this.playerMovementSpeed;
        }
        else if (this.controls.keys.s.pressed) {
            this.cube.velocity.x = -forward.x * this.playerMovementSpeed;
            this.cube.velocity.z = -forward.z * this.playerMovementSpeed;
        }

        if (this.controls.keys.a.pressed) {
            this.cube.velocity.x = -right.x * this.playerMovementSpeed;
            this.cube.velocity.z = -right.z * this.playerMovementSpeed;
        }
        else if (this.controls.keys.d.pressed) {
            this.cube.velocity.x = right.x * this.playerMovementSpeed;
            this.cube.velocity.z = right.z * this.playerMovementSpeed;
        }

        if (this.controls.keys.space.pressed && this.cube.bottom <= this.ground.top) {
            this.cube.velocity.y = 0.1;
        }

        this.cube.update(this.ground);
        this.updateCameraPosition();
    }

    updateCameraPosition() {
        // Calculate camera position based on player rotation
        const distance = 7;
        const height = 4;
        const angle = this.playerRotation;
        const offsetAngle = Math.PI / 30;


        // // Position the camera behind the player based on rotation
        this.camera.position.x = this.cube.position.x + (Math.sin(angle + offsetAngle) * distance);
        this.camera.position.y = this.cube.position.y + height;
        this.camera.position.z = this.cube.position.z + (Math.cos(angle + offsetAngle) * distance);

        // Look at player
        this.camera.lookAt(this.cube.position);
    }

    updateEnemies() {
        // Remove enemies that have gone too far past the player
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            enemy.update(this.ground);

            // Remove enemies that are behind the player
            if (enemy.position.z > this.cube.position.z + 10) {
                this.scene.remove(enemy);
                this.enemies.splice(i, 1);
                continue;
            }

            if (boxCollision(this.cube, enemy)) {
                this.gameOver();
            }
        }
    }

    spawnEnemies() {
        if (this.frames % this.spawnRate === 0) {
            if (this.spawnRate > 20) this.spawnRate -= 10;
            const enemy = new Box({
                width: 1, height: 1, depth: 1,
                position: { x: (Math.random() - 0.5) * 30, y: 0, z: -35 },
                color: "red",
                velocity: { x: 0, y: 0, z: 0.005 },
                zAcceration: true,
            });
            enemy.castShadow = true;
            this.scene.add(enemy);
            this.enemies.push(enemy);
            console.log("spawning enemy", this.enemies.length);
        }
    }

    animate = () => {
        this.animationId = requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera);

        // Check for pause menu
        if (this.controls.keys.escape.pressed) {
            if (!this.isPaused) {
                this.pause();
            }
        }

        this.updatePlayer();
        this.updateEnemies();
        this.spawnEnemies();

        this.frames++;
    }

    gameOver() {
        this.isGameOver = true;
        cancelAnimationFrame(this.animationId);
        document.getElementById("menuContainer").classList.remove("menu-hidden");
    }

    start() {
        this.reset(); // Reset game state before starting
        this.animate();
    }

    pause() {
        this.isPaused = true;
        cancelAnimationFrame(this.animationId);
        document.getElementById("menuContainer").classList.remove("menu-hidden");
        document.getElementById("mainMenu").classList.add("menu-hidden");
        document.getElementById("pauseMenu").classList.remove("menu-hidden");
    }

    resume() {
        this.isPaused = false;
        this.animate();
    }

    restart() {
        this.reset();
        this.resume();
    }

    quit() {
        cancelAnimationFrame(this.animationId);
        this.scene.remove(this.cube);
        this.scene.remove(this.ground);
        this.enemies.forEach(enemy => this.scene.remove(enemy));
        this.enemies = [];
        document.getElementById("menuContainer").classList.remove("menu-hidden");
    }
}

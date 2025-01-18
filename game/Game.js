import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Box } from '../classes/Box.js';
import { Controls } from './controls.js';

export class Game {
    constructor() {
        this.animationId = null;
        this.enemies = [];
        this.playerMovementSpeed = 0.05;
        this.spawnRate = 200;
        this.frames = 0;

        this.setupScene();
        this.setupObjects();
        this.setupLights();
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

        this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
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
        light.position.set(3, 5, 1);
        this.scene.add(light);
        this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    }

    animate = () => {
        this.animationId = requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera);

        this.updatePlayer();
        this.updateEnemies();
        this.spawnEnemies();

        this.frames++;
    }

    updatePlayer() {
        this.cube.velocity.x = 0;
        this.cube.velocity.z = 0;

        if (this.controls.keys.a.pressed) this.cube.velocity.x = -this.playerMovementSpeed;
        else if (this.controls.keys.d.pressed) this.cube.velocity.x = this.playerMovementSpeed;

        if (this.controls.keys.w.pressed) this.cube.velocity.z = -this.playerMovementSpeed;
        else if (this.controls.keys.s.pressed) this.cube.velocity.z = this.playerMovementSpeed;

        if (this.controls.keys.space.pressed && this.cube.bottom <= this.ground.top) {
            this.cube.velocity.y = 0.1;
        }

        this.cube.update(this.ground);
    }

    updateEnemies() {
        this.enemies.forEach((enemy) => {
            enemy.update(this.ground);
            if (boxCollision(this.cube, enemy)) {
                this.gameOver();
            }
        });
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
        }
    }

    gameOver() {
        cancelAnimationFrame(this.animationId);
        document.getElementById("menuContainer").classList.remove("menu-hidden");
    }

    start() {
        this.animate();
    }

    pause() {
        cancelAnimationFrame(this.animationId);
    }

    resume() {
        this.animate();
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

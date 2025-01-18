import * as THREE from 'three';
import { boxCollision } from '../utils/collision.js';

export class Box extends THREE.Mesh {
    constructor({
        width,
        height,
        depth,
        color = "#ffffff",
        velocity = { x: 0, y: 0, z: 0 },
        position = { x: 0, y: 0, z: 0 },
        gravity = -0.005,
        zAcceration = false,
    }) {
        super(
            new THREE.BoxGeometry(width, height, depth),
            new THREE.MeshStandardMaterial({ color })
        );
        this.setupProperties(width, height, depth, position, velocity, gravity, zAcceration);
        this.updateSides();
    }

    setupProperties(width, height, depth, position, velocity, gravity, zAcceration) {
        this.height = height;
        this.width = width;
        this.depth = depth;
        this.position.set(position.x, position.y, position.z);
        this.velocity = velocity;
        this.gravity = gravity;
        this.zAcceration = zAcceration;
    }

    updateSides() {
        this.bottom = this.position.y - this.height / 2;
        this.top = this.position.y + this.height / 2;
        this.left = this.position.x - this.width / 2;
        this.right = this.position.x + this.width / 2;
        this.front = this.position.z - this.depth / 2;
        this.back = this.position.z + this.depth / 2;
    }

    update(ground) {
        this.updateSides();
        if (this.zAcceration) this.velocity.z += 0.001;
        this.updatePosition();
        this.applyGravity(ground);
    }

    updatePosition() {
        this.position.x += this.velocity.x;
        this.position.z += this.velocity.z;
        this.position.y += this.velocity.y;
    }

    applyGravity(ground) {
        this.velocity.y += this.gravity;
        if (boxCollision(this, ground)) {
            this.handleGroundCollision(ground);
        } else {
            this.position.y += this.velocity.y;
        }
    }

    handleGroundCollision(ground) {
        this.position.y = ground.top + this.height / 2;
        const friction = 0.5;
        this.velocity.y *= -friction;
        if (Math.abs(this.velocity.y) < 0.02) {
            this.velocity.y = 0;
        }
    }
}

export class Controls {
    constructor() {
        this.keys = {
            w: { pressed: false },
            a: { pressed: false },
            s: { pressed: false },
            d: { pressed: false },
            space: { pressed: false },
            arrowUp: { pressed: false },
            arrowDown: { pressed: false },
            arrowLeft: { pressed: false },
            arrowRight: { pressed: false },
            escape: { pressed: false },
        };
        this.setupEventListeners();
    }

    setupEventListeners() {
        window.addEventListener("keydown", (e) => this.handleKeyDown(e));
        window.addEventListener("keyup", (e) => this.handleKeyUp(e));
    }

    handleKeyDown(e) {
        switch (e.code) {
            // Movement Controls
            case "KeyW": this.keys.w.pressed = true; break;
            case "KeyA": this.keys.a.pressed = true; break;
            case "KeyS": this.keys.s.pressed = true; break;
            case "KeyD": this.keys.d.pressed = true; break;
            case "Space": this.keys.space.pressed = true; break;
            // Camera Controls
            case "ArrowUp": this.keys.arrowUp.pressed = true; break;
            case "ArrowDown": this.keys.arrowDown.pressed = true; break;
            case "ArrowLeft": this.keys.arrowLeft.pressed = true; break;
            case "ArrowRight": this.keys.arrowRight.pressed = true; break;
            // Menu Controls
            case "Escape": this.keys.escape.pressed = true; break;

        }
    }

    handleKeyUp(e) {
        switch (e.code) {
            // Movement Controls
            case "KeyW": this.keys.w.pressed = false; break;
            case "KeyA": this.keys.a.pressed = false; break;
            case "KeyS": this.keys.s.pressed = false; break;
            case "KeyD": this.keys.d.pressed = false; break;
            case "Space": this.keys.space.pressed = false; break;
            // Camera Controls
            case "ArrowUp": this.keys.arrowUp.pressed = false; break;
            case "ArrowDown": this.keys.arrowDown.pressed = false; break;
            case "ArrowLeft": this.keys.arrowLeft.pressed = false; break;
            case "ArrowRight": this.keys.arrowRight.pressed = false; break;
            // Menu Controls
            case "Escape": this.keys.escape.pressed = false; break;

        }
    }
}
export class Controls {
    constructor() {
        this.keys = {
            w: { pressed: false },
            a: { pressed: false },
            s: { pressed: false },
            d: { pressed: false },
            space: { pressed: false },
        };
        this.setupEventListeners();
    }

    setupEventListeners() {
        window.addEventListener("keydown", (e) => this.handleKeyDown(e));
        window.addEventListener("keyup", (e) => this.handleKeyUp(e));
    }

    handleKeyDown(e) {
        switch (e.code) {
            case "KeyW": this.keys.w.pressed = true; break;
            case "KeyA": this.keys.a.pressed = true; break;
            case "KeyS": this.keys.s.pressed = true; break;
            case "KeyD": this.keys.d.pressed = true; break;
            case "Space": this.keys.space.pressed = true; break;
        }
    }

    handleKeyUp(e) {
        switch (e.code) {
            case "KeyW": this.keys.w.pressed = false; break;
            case "KeyA": this.keys.a.pressed = false; break;
            case "KeyS": this.keys.s.pressed = false; break;
            case "KeyD": this.keys.d.pressed = false; break;
            case "Space": this.keys.space.pressed = false; break;
        }
    }
}
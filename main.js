import { Game } from './game/Game.js';

const game = new Game();

// Make necessary functions available globally
window.startGame = () => {
    document.getElementById("menuContainer").classList.add("menu-hidden");
    game.start();
};

window.showInstructions = () => {
    document.getElementById("mainMenu").classList.add("menu-hidden");
    document.getElementById("instructionsMenu").classList.remove("menu-hidden");
};

window.showMain = () => {
    document.getElementById("mainMenu").classList.remove("menu-hidden");
    document.getElementById("instructionsMenu").classList.add("menu-hidden");
};

window.quitGame = () => {
    game.quit();
};


import Phaser from "phaser";
import PreloadScene from "./scenes/preload-scene";
import PlayScene from "./scenes/play-scene";
import MenuScene from "./scenes/menu-scene";
import ScoreScene from "./scenes/score-scene";
import PauseScene from "./scenes/pause-scene";

const SHARED_CONFIG = {
    width: 800,
    height: 600
}

const Scenes = [PreloadScene, MenuScene, PlayScene, ScoreScene, PauseScene];
const createScene = Scene => new Scene(SHARED_CONFIG);
const initScenes = () => Scenes.map(createScene);

const config = {
    type: Phaser.AUTO,
    ...SHARED_CONFIG,
    pixelArt: true,
    // Arcade physics plugin, manages physics simulation
    physics: {
        default: 'arcade',
    },
    scene: initScenes()
}

new Phaser.Game(config);

import Phaser from "phaser";

class PreloadScene extends Phaser.Scene {

    constructor(){
        super('PreloadScene')
    }

    // Loading assets
    preload(){
        // key, image path
        this.load.image('sky', 'assets/sky.png');
        this.load.spritesheet('bird', 'assets/birdSprite.png', {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.image('pipe', 'assets/pipe.png');
        this.load.image('pauseBtn', 'assets/pause.png');
        this.load.image('backBtn', 'assets/back.png');
    }

    create(){
        this.scene.start('MenuScene');
    }

}

export default PreloadScene;
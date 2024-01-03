import Phaser from "phaser";

class BaseScene extends Phaser.Scene {

    constructor(key, config){
        super(key);

        this.config = config;

        this.lineHeight = 42;
        this.fontOptions = {fontSize: '34px', fill: '#fff'};
    }

    create(){

        this.createBackground();

        if(this.config.canGoBack){
            this.creatBackBtn();
        }
    }

    createBackground(){
        // x, y, key
        this.add.image(0, 0, 'sky').setOrigin(0, 0);
    }

    creatBackBtn(){
        const pauseBtn = this.add.image(this.config.width-10, this.config.height-10, 'backBtn').setOrigin(1, 1);
        pauseBtn.setScale(3);
        pauseBtn.setInteractive();
        pauseBtn.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
    }

    createMenu(menu, setupMenuEvent){

        let lastMenuPositionY = 0;
        menu.forEach(menuItem => {
            const screenCenter = [this.config.width/2, this.config.height/2 + lastMenuPositionY];
            menuItem.textObject = this.add.text(...screenCenter, menuItem.text, this.fontOptions).setOrigin(0.5, 1);
            lastMenuPositionY += this.lineHeight;
            setupMenuEvent(menuItem);
        });
    }
}

export default BaseScene;
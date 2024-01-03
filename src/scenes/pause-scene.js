import BaseScene from "./base-scene";

class PauseScene extends BaseScene {

    constructor(config){
        super('PauseScene', config);

        this.menu = [
            {scene: 'PlayScene', text: 'Continue'},
            {scene: 'MenuScene', text: 'Exit'}
        ]
    }

    create(){
        super.create();
        this.createMenu(this.menu, this.setupMenuEvent.bind(this));
    }

    setupMenuEvent(menuItem){

        menuItem.textObject.setInteractive();

        menuItem.textObject.on('pointerover', () => {
            menuItem.textObject.setStyle({fill: '#ff0'});
        });

        menuItem.textObject.on('pointerout', () => {
            menuItem.textObject.setStyle({fill: '#fff'});
        });

        menuItem.textObject.on('pointerdown', () => {

            if(menuItem.scene && menuItem.text === 'Continue'){
                this.scene.stop();
                this.scene.resume(menuItem.scene);
            }
            else {
                this.scene.stop('PlayScene');
                this.scene.start(menuItem.scene);
            }
        });


    }

}

export default PauseScene;
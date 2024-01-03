import BaseScene from "./base-scene";

class MenuScene extends BaseScene {

    constructor(config){
        super('MenuScene', config);

        this.menu = [
            {scene: 'PlayScene', text: 'Play'},
            {scene: 'ScoreScene', text: 'Score'},
            {scene: null, text: 'Exit'}
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
            menuItem.scene && this.scene.start(menuItem.scene);

            if(menuItem.text === 'Exit') {
                this.game.destroy(true);
            }
        });


    }

}

export default MenuScene;
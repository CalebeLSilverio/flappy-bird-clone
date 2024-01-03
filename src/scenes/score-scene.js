import BaseScene from "./base-scene";

class ScoreScene extends BaseScene {

    constructor(config){
        super('ScoreScene', {...config, canGoBack: true});
    }

    create(){
        super.create();
        this.createScore();

    }

    createScore(){

        const bestScoreText = localStorage.getItem('bestScore');
        this.add.text(this.config.width/2, this.config.height/2, `Best Score: ${bestScoreText || 0}`, this.fontOptions).setOrigin(0.5, 0.5);

    }

}

export default ScoreScene;
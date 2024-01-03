
import BaseScene from "./base-scene";

const PIPE_VELOCITY = 200;
const FLAP_VELOCITY = 200;
const PIPES_TO_RENDER = 2;
const START_DIFFICULTY = [150, 250];

class PlayScene extends BaseScene {

    constructor(config){
        super('PlayScene', config);

        this.START_BIRD_POSITION = {x: this.config.width*0.2, y: this.config.height/2};

        this.pipeDistanceRange = [...START_DIFFICULTY];

        this.bird = null;
        this.pipes = null;

        this.score = 0;
        this.scoreText = '';

        this.isPaused = false;
    }

    create(){
        super.create();
        this.pipeDistanceRange = [...START_DIFFICULTY];
        this.createBird();
        this.createPipes();
        this.createColliders();
        this.createScore();
        this.createPauseBtn();
        this.initializeInputs();
        this.listenToEvents();

        if(!this.anims.exists('fly')){
            this.anims.create({
                key: 'fly',
                frames: this.anims.generateFrameNumbers('bird', {start: 8, end: 15}),
                frameRate: 16,
                //repeat infinitely
                repeat: -1
            });
        }

        this.bird.play('fly');

        this.isPaused = false;
    }

    // 60fps
    update(time, delta){

        this.checkPlayerStatus();

        this.recyclePipes();
        
    }

    createBird(){
        this.bird = this.physics.add.sprite(this.START_BIRD_POSITION.x, this.START_BIRD_POSITION.y, 'bird');
        this.bird.setBodySize(this.bird.width, this.bird.height - 8);
        this.bird.setScale(3);
        this.bird.setFlipX(true);
        this.bird.body.gravity.y = 400;
        this.bird.setCollideWorldBounds(true);
    }

    createPipes(){
        this.pipes = this.physics.add.group();

        
        for(let i = 0; i < PIPES_TO_RENDER; i++){
            
            const topPipe = this.pipes.create(0, 0, 'pipe').setOrigin(0, 1);
            const bottomPipe = this.pipes.create(0, 0, 'pipe').setOrigin(0, 0);

            topPipe.setImmovable(true);
            bottomPipe.setImmovable(true);

            this.placePipe(topPipe, bottomPipe);
        }

        this.pipes.setVelocityX(-PIPE_VELOCITY);
    }

    createColliders(){
        this.physics.add.collider(this.bird, this.pipes, this.restartGame, null, this);
    }

    createScore(){
        this.score = 0;
        const scoreStyle = { fontSize: '32px', fill: '#000'};
        this.scoreText = this.add.text(this.config.width*0.05, this.config.height*0.05, `Score: ${this.score}`, scoreStyle);

        const bestScoreText = localStorage.getItem('bestScore');
        const BestScoreStyle = { fontSize: '18px', fill: '#000'};
        this.add.text(this.config.width*0.05, this.config.height*0.1, `Best score: ${bestScoreText || 0}`, BestScoreStyle);
    }

    createPauseBtn(){
        const pauseBtn = this.add.image(this.config.width-10, this.config.height-10, 'pauseBtn').setOrigin(1, 1);
        pauseBtn.setScale(3);
        pauseBtn.setInteractive();
        pauseBtn.on('pointerdown', () => {
            this.isPaused = true;
            this.physics.pause();
            this.scene.pause();
            this.scene.launch('PauseScene');
        });
    }

    initializeInputs(){
        
        this.input.on('pointerdown', this.flap, this);
    }

    listenToEvents(){

        this.events.on('resume', () => {

            if(this.timedEvent) { 
                this.countDownText.destroy();
                this.timedEvent.remove(); 
            }

            this.countDown = 3;
            this.countDownText = this.add.text(this.config.width/2, this.config.height/2, `Fly in: ${this.countDown}`, this.fontOptions);
            this.countDownText.setOrigin(0.5, 0.5);
            this.timedEvent = this.time.addEvent({
                delay: 1000,
                callback: () => {
                    this.countDown--;
                    this.countDownText.setText(`Fly in: ${this.countDown}`);

                    if(this.countDown == 0){
                        this.countDownText.destroy();
                        this.physics.resume();
                        this.timedEvent.remove();
                        this.isPaused = false;
                    }
                },
                callbackScope: this,
                loop: true
            });
        });
    }

    placePipe(topPipe, bottomPipe) {

        let pipeHorisontalPosition = this.config.width / 2;
        this.pipes.getChildren().forEach(pipe => {
            pipeHorisontalPosition = Math.max(pipeHorisontalPosition, pipe.x);
        });
        pipeHorisontalPosition += this.config.width / 2;

        const pipeDistance = Phaser.Math.Between(...this.pipeDistanceRange);
        const upperPipeVerticalPosition = Phaser.Math.Between(this.config.height*0.2, this.config.height*0.9 - pipeDistance);

        topPipe.x = pipeHorisontalPosition;
        topPipe.y = upperPipeVerticalPosition;
        
        bottomPipe.x = pipeHorisontalPosition;
        bottomPipe.y = upperPipeVerticalPosition + pipeDistance;
    }

    checkPlayerStatus(){
        if(this.bird.y <= this.bird.getBounds().height/2 || this.bird.y >= this.config.height - this.bird.getBounds().height/2){
            this.restartGame();
        }
    }

    restartGame(){
        this.physics.pause();
        this.bird.setTint(0xff0000);

        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.scene.restart();
            },
            loop: false
        });
    }

    flap(){
        if(!this.isPaused){
            this.bird.body.velocity.y = -FLAP_VELOCITY;
        }  
    }

    recyclePipes(){

        const tempPipes = [];
        this.pipes.getChildren().forEach(pipe => {
            if(pipe.getBounds().right <= 0){
                tempPipes.push(pipe);
                if(tempPipes.length == 2){
                    this.increaseDifficulty();
                    this.placePipe(...tempPipes);
                    this.increaseScore();
                    this.saveBestScore();
                }
            }
        });
    }

    increaseScore() {
        this.score++;
        this.scoreText.setText(`Score: ${this.score}`);
    }

    saveBestScore(){
        const bestScoreText = localStorage.getItem('bestScore');
        const bestScore = bestScoreText && parseInt(bestScoreText, 10);

        if(!bestScore || this.score > bestScore){
            localStorage.setItem('bestScore', this.score);
        }
    }

    increaseDifficulty(){
        if(this.pipeDistanceRange[0] > 50){ 
            this.pipeDistanceRange[0] -= 5;
        }

        if(this.pipeDistanceRange[1] > 100){
            this.pipeDistanceRange[1] -= 10;
        }
    }
}

export default PlayScene;
Scene.Death = function (game){ };

Scene.Death.prototype = {
	create: function(){
		this.cursors = this.game.input.keyboard.createCursorKeys();
		this.game.input.gamepad.start();
		this.pad1 = this.game.input.gamepad.pad1;


		this.score = this.game.state.states['Game'].score;
		this.oldScore = parseInt(localStorage.getItem('score'));
		this.totalScore = this.oldScore + this.score;

		localStorage.setItem('score', this.totalScore);

		this.titleTxt = this.game.add.text(300, 50, 'GAME OVER', {font: "50px Arial", fill: '#FFF'});
		this.titleTxt.anchor.set(0.5, 0.5);
		this.scoreTxt = this.game.add.text(300, 100,'Score: ' + this.score, {font: "18px Arial", fill: '#FFF'});
		this.scoreTxt.anchor.set(0.5, 0.5);

		this.continueText = this.game.add.sprite(300, 200, 'continue');
		this.continueText.anchor.set(0.5, 0.5);
	},
	
	update: function(){
		if(this.cursors.up.isDown){
			this.game.state.start('Preloader');
		}
    }
};
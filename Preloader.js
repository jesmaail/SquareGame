Scene.Preloader = function (game) {
	this.background = null; // define background
	this.preloadBar = null; // define loader bar
};

Scene.Preloader.prototype = {
	preload: function () {	
		this.imgPath = '/games/square/assets/img/';
		
		this.load.image('start', this.imgPath + 'start.png');
		this.load.image('continue', this.imgPath + 'continue.png');
		this.load.image('heart', this.imgPath + 'heart.png');
		this.load.spritesheet('sprite', this.imgPath + 'sprite.png', 26, 26, 2);
		this.load.spritesheet('enemy', this.imgPath + 'enemy.png', 25, 24, 2);
		this.load.image('bullet', this.imgPath + 'bullet.png');
		this.load.image('rocket', this.imgPath + 'rocket.png');
		this.load.image('lmg', this.imgPath + 'lmg.png');
		this.load.image('rifle', this.imgPath + 'rifle.png');
		this.load.image('launcher', this.imgPath + 'launcher.png');
		this.load.image('shotgun', this.imgPath + 'shotgun.png');
		this.load.spritesheet('explosion', this.imgPath + 'explosion.png', 40, 40, 11);
	},

	create: function () {
		if(localStorage.getItem('score') == null){
			localStorage.setItem('score', 0);
		}
		this.score = parseInt(localStorage.getItem('score'));

		this.upgradeMode = false;

		this.cursors = this.game.input.keyboard.createCursorKeys();
		this.game.input.gamepad.start();
		this.pad1 = this.game.input.gamepad.pad1;

		this.game.stage.backgroundColor = '#606060';

		this.startText = this.game.add.sprite(430, 200, 'start');
		this.startText.anchor.set(0.5, 0.5);

		this.weapon = 'pistol';

		this.counter = 0;
		this.rifleCost = 10;
		this.shotgunCost = 20;
		this.lmgCost = 50;
		this.rocketCost = 100;

		this.generateText();
		this.generateUpgrades();
	},
	
	update: function(){		
		this.purchaseHandler();
		if(this.cursors.up.isDown){
			this.game.state.start('Game');
		}
	},

	generateText: function(){
		this.titleTxt = this.game.add.text(300, 50, 'SQUARE GO LIKE', {font: "50px Arial", fill: '#FFF'});
		this.titleTxt.anchor.set(0.5, 0.5);
		this.subTxt = this.game.add.text(300, 85, 'Alternatively, /HIP TO BE SQUARE/ or /SQUARE OFF/ ', {font: "11px Arial", fill: '#FFF'});
		this.subTxt.anchor.set(0.5, 0.5);
		this.scoreTxt = this.game.add.text(300, 115,'Total Score: ' + this.score, {font: "18px Arial", fill: '#FFF'});
		this.scoreTxt.anchor.set(0.5, 0.5);
		this.purchaseTxt = this.game.add.text(80, 130, '',{font: "16px Arial", fill: '#FFF'});
		this.hintTxt = this.game.add.text(300, 275, 'Score will only reset when cache is cleared!',{font: "14px Arial", fill: '#FFF'});
		this.hintTxt.anchor.set(0.5, 0.5);
	},

	generateUpgrades: function(){
		this.rifle = this.game.add.sprite(30, 175, 'rifle');
		this.shotgun = this.game.add.sprite(90, 175, 'shotgun');
		this.lmg = this.game.add.sprite(150, 175, 'lmg');
		this.rocket = this.game.add.sprite(210, 175, 'launcher');
		this.generatePrices();
		this.generateKeyLabels();
	},

	generatePrices: function(){
		if(this.score >= this.rocketCost){
			this.rocketTxt = this.game.add.text(215, 220, this.rocketCost, {font: "16px Arial", fill: '#FFF'});
			this.lmgTxt = this.game.add.text(155, 220, this.lmgCost, {font: "16px Arial", fill: '#FFF'});
			this.shotgunTxt = this.game.add.text(95, 220, this.shotgunCost, {font: "16px Arial", fill: '#FFF'});
			this.rifleTxt = this.game.add.text(40, 220, this.rifleCost, {font: "16px Arial", fill: '#FFF'});

		}else if (this.score >= this.lmgCost){
			this.rocketTxt = this.game.add.text(215, 220, this.rocketCost, {font: "16px Arial", fill: '#FF0000'});
			this.lmgTxt = this.game.add.text(155, 220, this.lmgCost, {font: "16px Arial", fill: '#FFF'});
			this.shotgunTxt = this.game.add.text(95, 220, this.shotgunCost, {font: "16px Arial", fill: '#FFF'});
			this.rifleTxt = this.game.add.text(40, 220, this.rifleCost, {font: "16px Arial", fill: '#FFF'});

		}else if(this.score >= this.shotgunCost){
			this.rocketTxt = this.game.add.text(215, 220, this.rocketCost, {font: "16px Arial", fill: '#FF0000'});			
			this.lmgTxt = this.game.add.text(155, 220, this.lmgCost, {font: "16px Arial", fill: '#FF0000'});		
			this.shotgunTxt = this.game.add.text(95, 220, this.shotgunCost, {font: "16px Arial", fill: '#FFF'});
			this.rifleTxt = this.game.add.text(40, 220, this.rifleCost, {font: "16px Arial", fill: '#FFF'});	

		}else if(this.score >=this.rifleCost){
			this.rocketTxt = this.game.add.text(215, 220, this.rocketCost, {font: "16px Arial", fill: '#FF0000'});			
			this.lmgTxt = this.game.add.text(155, 220, this.lmgCost, {font: "16px Arial", fill: '#FF0000'});
			this.shotgunTxt = this.game.add.text(95, 220, this.shotgunCost, {font: "16px Arial", fill: '#FF0000'});
			this.rifleTxt = this.game.add.text(40, 220, this.rifleCost, {font: "16px Arial", fill: '#FFF'});

		}else if(this.score < this.rifleCost){
			this.rocketTxt = this.game.add.text(215, 220, this.rocketCost, {font: "16px Arial", fill: '#FF0000'});			
			this.lmgTxt = this.game.add.text(155, 220, this.lmgCost, {font: "16px Arial", fill: '#FF0000'});
			this.shotgunTxt = this.game.add.text(95, 220, this.shotgunCost, {font: "16px Arial", fill: '#FF0000'});
			this.rifleTxt = this.game.add.text(40, 220, this.rifleCost, {font: "16px Arial", fill: '#FF0000'});
		}
	},

	generateKeyLabels: function(){
		this.q = this.game.add.text(42, 150, 'Q', {font: "20px Arial", fill: '#FFF'});
		this.w = this.game.add.text(100, 150, 'W', {font: "20px Arial", fill: '#FFF'});
		this.e = this.game.add.text(163, 150, 'E', {font: "20px Arial", fill: '#FFF'});
		this.r = this.game.add.text(222, 150, 'R', {font: "20px Arial", fill: '#FFF'});
	},

	purchaseHandler: function(){
		if(this.counter == 0){
			if(this.game.input.keyboard.isDown(Phaser.Keyboard.Q)){
				if(this.score >= this.rifleCost){
					this.counter++;
					this.weapon = 'rifle';
					this.purchaseTxt.setText('SMG Purchased!');
					this.score -= this.rifleCost;
					localStorage.setItem('score', this.score);
					this.scoreTxt.setText('Total Score: ' + this.score);
				}else{
					this.purchaseTxt.setText('Insufficient Funds');
				}
			}

			if(this.game.input.keyboard.isDown(Phaser.Keyboard.W)){
				if(this.score >= this.shotgunCost){
					this.counter++;
					this.weapon = 'shotgun';
					this.purchaseTxt.setText('Shotgun Purchased!');
					this.score -= this.shotgunCost;
					localStorage.setItem('score', this.score);
					this.scoreTxt.setText('Total Score: ' + this.score);
				}else{
					this.purchaseTxt.setText('Insufficient Funds');
				}
			}

			if(this.game.input.keyboard.isDown(Phaser.Keyboard.E)){
				if(this.score >= this.lmgCost){
					this.counter++;
					this.weapon = 'lmg';
					this.purchaseTxt.setText('LMG Purchased!');
					this.score -= this.lmgCost;
					localStorage.setItem('score', this.score);
					this.scoreTxt.setText('Total Score: ' + this.score);
				}else{
					this.purchaseTxt.setText('Insufficient Funds');
				}
			}

			if(this.game.input.keyboard.isDown(Phaser.Keyboard.R)){
				if(this.score >= this.rocketCost){
					this.counter++;
					this.weapon = 'rocket';
					this.purchaseTxt.setText('Rockets Purchased!');
					this.score -= this.rocketCost;
					localStorage.setItem('score', this.score);
					this.scoreTxt.setText('Total Score: ' + this.score);
				}else{
					this.purchaseTxt.setText('Insufficient Funds');
				}
			}
		}
	}
};
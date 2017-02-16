// Created By Joseph Shihab Esmaail
//Started 18/09/14
Scene.Game = function(game) { };
Scene.Game.prototype = {	

	create: function() {
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.stage.backgroundColor = '#606060';
		this.game.input.addPointer();
		this.cursors = this.game.input.keyboard.createCursorKeys();
		this.game.input.gamepad.start();
		this.pad1 = this.game.input.gamepad.pad1;

		this.hearts = this.game.add.group();
		this.bullets = this.game.add.group();
		this.rockets = this.game.add.group();
		this.explosions = this.game.add.group();
		this.gunTimer = 0;
		this.enemies = [];
		this.enemyIndex = 0;
		this.enemySpawnCount = 1;		

		this.spawnEnemies();
		this.spawnPlayer();

		this.hurtTimer = 0;
		this.score = 0;

		this.weapon = this.game.state.states['Preloader'].weapon;
		this.scoreTxt = this.game.add.text(570, 10, "" + this.score , {font: "25px Arial", fill: '#fff' });
		this.scoreTxt.anchor.set(1, 0);
	},
	
	update: function(){
		this.scoreTxt.setText("" + this.score);
		this.inputHandler();
		this.enemyAI();
		this.displayHealth();

		this.enemySpawnHandler();

		if(this.getAliveEnemies == 0){
			this.spawnEnemies();
		}
	},	

	spawnPlayer: function(){
		this.player = this.game.add.sprite(300, 150, 'sprite');
		this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
		this.player.anchor.set(0.5, 0.5);
		this.player.body.collideWorldBounds = true;
		this.player.health = 5;
		this.player.animations.add('damage', [1, 0]);
		this.player.animations.add('die', [1]);
	},

	displayHealth: function(){
		this.hearts.removeAll();
		this.x = 10;
		this.y = 10;
		for(var i=1; i<this.player.health; i++){
			this.heart = this.hearts.create(this.x, this.y, 'heart');
			this.heart.fixedToCamera = true;
			//this.heart.scale.x = 2;
			//this.heart.scale.y = 2;
			this.x += 16;
		}
	},

	shootHandler: function(){
		if(this.weapon == 'pistol'){
			this.shoot(300, 500, 'pistol');

		}else if(this.weapon == 'rifle'){
			this.shoot(300, 180, 'rifle');

		}else if(this.weapon == 'shotgun'){
			this.shoot(280, 800, 'shotgun');

		}else if(this.weapon == 'lmg'){
			this.shoot(300, 100, 'lmg');

		}else if(this.weapon =='rocket'){
			this.shoot(200, 1000, 'rocket');
		}
	},

	shoot: function(velocity, rate, type){
		this.velX = 0;
		this.velY = 0;
		this.speed = velocity;		

		if(this.cursors.up.isDown){
			this.velY = -this.speed;
		}
		if(this.cursors.down.isDown){
			this.velY = this.speed;

		}
		if(this.cursors.left.isDown){
			this.velX = -this.speed;

		}
		if(this.cursors.right.isDown){
			this.velX = this.speed;
		}
		if(this.gunTimer < this.game.time.now){
			if(type == 'pistol' || type=='lmg' || type=='rifle'){
				this.spawnBullet(this.player.x, this.player.y, this.velX, this.velY);

			}else if(type == 'shotgun'){
				this.spawnBullet(this.player.x, this.player.y, this.velX, this.velY);
				this.spawnBullet(this.player.x, this.player.y, this.velX + 20, this.velY + 20);
				this.spawnBullet(this.player.x, this.player.y, this.velX - 20, this.velY - 20);
			}else if(type == 'rocket'){
				this.spawnRocket(this.player.x, this.player.y, this.velX, this.velY);
			}

			
			this.gunTimer = this.game.time.now + rate;
		}		
	},

	spawnBullet: function(spawnX, spawnY, velX, velY){
		this.bullet = this.bullets.create(spawnX, spawnY, 'bullet');
		this.bullet.anchor.set(0.5, 0.5);
		this.game.physics.enable(this.bullet, Phaser.Physics.ARCADE);
		this.bullet.body.velocity.x = velX;
		this.bullet.body.velocity.y = velY;
	},

	spawnRocket: function(spawnX, spawnY, velX, velY){
		this.rocket = this.rockets.create(spawnX, spawnY, 'rocket');
		this.rocket.anchor.set(0.5, 0.5);
		this.game.physics.enable(this.rocket, Phaser.Physics.ARCADE);
		this.rocket.body.velocity.x = velX;
		this.rocket.body.velocity.y = velY;
	},

	spawnExplosion: function(x, y){
		//this.explosion = this.game.add.sprite(x, y, 'explosion');
		this.explosion = this.explosions.create(x, y, 'explosion');
		this.game.physics.enable(this.explosion, Phaser.Physics.ARCADE);
		this.explosion.anchor.set(0.5, 0.5);
		this.explosion.animations.add('explode', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
		this.explosion.animations.play('explode', 15, false, true);
	},

	enemySpawnHandler: function(){
		this.enemiesAlive = 0;

		for (var i=0; i<this.enemies.length; i++){
			if(this.enemies[i].alive){
				this.enemiesAlive++;
			}
		}
		if(this.enemiesAlive == 0){
			this.spawnEnemies();
		}
	},

	spawnEnemies: function(){
		this.total = this.enemySpawnCount;
		this.enemySpawnCount++;

		for(var i=0; i<this.total; i++){
			this.x = this.game.rnd.integerInRange(-100, 700);
			this.y = this.getEnemySpawnY(this.x);
			this.enemies.push(new Enemy(this, this.enemyIndex, this.x, this.y, this.player));
			this.enemyIndex++;
		}
	},

	getEnemySpawnY: function(x){
		this.spawnY;

		if(this.x < -10 || this.x > 610){
			this.spawnY = this.game.rnd.integerInRange(-100, 400);
		}else{
			if(this.game.rnd.integerInRange(0, 50)<24){
				this.spawnY = -100;
			}else{
				this.spawnY = 400;
			}
		}

		return this.spawnY;
	},

	getAliveEnemies: function(x){
		this.enemiesAlive = 0;
		for (var i=0; i<this.enemies.length; i++){
			if(this.enemies[i].alive){
				this.enemiesAlive++;
			}
		}
		console.log(this.enemiesAlive);
		return this.enemiesAlive;
	},

	enemyAI: function(){
		for(var i=0; i<this.enemies.length; i++){
			if(this.enemies[i].alive){
				this.enemies[i].moveTo(this.player.x, this.player.y);
				// this.game.physics.arcade.overlap(this.bullets, this.enemies[i].enemySprite, this.enemyHit, null, this);
				// this.game.physics.arcade.overlap(this.rockets, this.enemies[i].enemySprite, this.enemyExplode, null, this);
				// this.game.physics.arcade.collide(this.enemies[i].enemySprite, this.player, this.playerHit, null, this);
				this.enemyCollisionDetection(this.enemies[i].enemySprite);

				for(var j=0; j<this.enemies.length; j++){
					if(this.enemies[j].alive){
						this.game.physics.arcade.collide(this.enemies[i].enemySprite, this.enemies[j].enemySprite);
					}
				}

			}
		} 
	},

	enemyCollisionDetection: function(enemy){
		this.game.physics.arcade.overlap(this.bullets, enemy, this.enemyHit, null, this);
		this.game.physics.arcade.overlap(this.rockets, enemy, this.enemyExplode, null, this);
		this.game.physics.arcade.collide(enemy, this.player, this.playerHit, null, this);
		this.game.physics.arcade.overlap(this.explosions, enemy, this.enemySplash, null, this);
	},

	enemyExplode: function(enemy, rocket){
		this.spawnExplosion(rocket.x, rocket.y);	
		rocket.kill();			
		this.enemies[enemy.name].kill();
		this.score++;
	},

	enemyHit: function(enemy, bullet){
		bullet.kill();
		if(this.enemies[enemy.name].damage()){
			this.score++;
		}
	},

	enemySplash: function(enemy, explosion){
		this.enemies[enemy.name].kill();
		this.score++;
	},


	playerHit: function(player, enemy){
		if(this.hurtTimer < this.game.time.now){
			if(this.player.health > 1){
				this.player.damage(1);
				this.player.animations.play('damage', 15);
				this.hurtTimer = this.game.time.now + 500;
			}else{
				this.player.animations.play('die', 15, false, true);
				this.player.damage(1);
				this.game.state.start('Death');
			}
		}
	},

	controls: function(button){
		this.movementSpeed = 150;

		if(button == 'up'){
				this.player.body.velocity.y = -this.movementSpeed;			

		}else if(button == 'down'){	
				this.player.body.velocity.y = this.movementSpeed;

		}else if(button == 'right'){			
			this.player.body.velocity.x = this.movementSpeed;

		}else if(button == 'left'){			
			this.player.body.velocity.x = -this.movementSpeed;

		}
	},	

	inputHandler: function(){
		this.player.body.velocity.x = 0;
		this.player.body.velocity.y = 0;

		//Keyboard
		//WASD
		if(this.game.input.keyboard.isDown(Phaser.Keyboard.W)){
			this.controls('up');
		}
		if(this.game.input.keyboard.isDown(Phaser.Keyboard.S)){
			this.controls('down');

		}
		if(this.game.input.keyboard.isDown(Phaser.Keyboard.D)){
			this.controls('right');

		} 
		if(this.game.input.keyboard.isDown(Phaser.Keyboard.A)){
			this.controls('left');
		}

		// R - Reload
		if(this.game.input.keyboard.isDown(Phaser.Keyboard.R)){
			//this.ammo = 0;
		}

		//Arrows
		if(this.cursors.up.isDown || this.cursors.down.isDown || this.cursors.right.isDown || this.cursors.left.isDown){
			//this.shoot();
			this.shootHandler();
		}

		//SpaceBar
		if(this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
			//this.controls('fire');
		}

		//Gamepad Controls
		if(this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1){
			//this.controls('left');
		}
		if(this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1){
			//this.controls('right');
		}

		//Touch-Screen Controls
		if(this.game.input.activePointer.isDown){
			this.touchBound = 300; //Half screen

			if((this.input.pointer1.y < this.player.y) && (this.player.body.y > this.floor)){
				//this.controls('jump');
			}
			if(this.input.pointer1.x < this.touchBound){
				//this.controls('left');
				
			}else if(this.input.pointer1.x > this.touchBound){
				//this.controls('right');
				
			}
		}
	}
};

Enemy = function(game, index, x, y, target){
	this.x = x;
	this.y =y;
	this.alive = true;
	this.health = 4;
	this.target = target;

	this.enemySprite = game.add.sprite(x, y, 'enemy');
	game.physics.enable(this.enemySprite, Phaser.Physics.ARCADE);
	this.enemySprite.anchor.set(0.5, 0.5);
	this.enemySprite.immovable = true;
	this.enemySprite.animations.add('damage', [1, 0]);
	this.enemySprite.animations.add('die', [1]);

	this.enemySprite.name = index.toString();
};

Enemy.prototype.moveTo = function(x, y){
	game.physics.arcade.moveToXY(this.enemySprite, x, y, 100);
	this.enemySprite.rotation = game.physics.arcade.angleToXY(this.enemySprite, x, y);
}

Enemy.prototype.kill = function(){
	this.health = 0;
	this.enemySprite.animations.play('die', 15, false, true);
	this.alive = false;
	//this.enemySprite.kill();
}

Enemy.prototype.damage = function(){
	this.health -= 1;
	this.enemySprite.animations.play('damage', 15);

	if(this.health <= 0){
		this.enemySprite.animations.play('die', 15, false, true);
		this.alive = false;
		//this.enemySprite.kill();
		return true;
	}
};
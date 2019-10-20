const Star = require("./star");
const Planet = require("./planet");
const EnemyAI = require("./enemyAI");
const Torpedo = require("./torpedo");

const Utils = require("./utils");

class Game {

	constructor(canvas_width, canvas_height) {
		this.canvas_width = canvas_width;
		this.canvas_height = canvas_height;

		this.stars = [];
		this.base_speed_inverse = 5;

		this.win = false;
		this.lose = false;
		this.muted = false;
		this.autopilot = false;

		this.enemies = [];
		this.enemyAIs = [];
		this.keyMap = {};

		this.createStarField();
		this.loadTorpImg();

		this.turnCounter = 0;
		this.turnCounterMax = 8;

		this.torpedoes = [];

		this.planet_08 = new Planet({
			pos: [300, 300],
			img: this.loadPlanet('./images/planets/planet_08.png'),
			width: 200,
			height: 200,
			sheetCoords: [20, 20, 460, 480]
		});

		this.moon_01 = new Planet({
			pos:[260, 410],
			img: this.loadPlanet('./images/planets/moon_01.png'),
			width: 50,
			height: 50,
			sheetCoords: [3,3,58,58]
		})
	}

	getKeyMap() { return this.keyMap; }

	addEnterprise(enterprise){
		this.enterprise = enterprise;
	};

	addEnemy(enemy){
		this.enemies.push(enemy);
	};

	addAI() {
		this.enemies.forEach((enemy) => this.enemyAIs.push(new EnemyAI(enemy, this.enterprise, true, this)));

		this.enterpriseAI = new EnemyAI(this.enterprise, this.enemies[0], true, this);
	};

	step() {
		// gets user input
		this.turnCounter++;
		if (this.turnCounter === this.turnCounterMax) {
			this.turnCounter = 0;
			this.checkKeyMap();
		}
		else if (this.turnCounter === this.turnCounterMax/2) this.checkKeyMap();

		this.moveObjects();

		this.enemyAIs.forEach((AI, i) => AI.consultAI(this.enemies[i].onscreen(this.canvas_width, this.canvas_height)));

		// this.enemyAI.consultAI(this.enemy.onscreen(this.canvas_width, this.canvas_height));
		if ( this.autopilot) 
			this.enterpriseAI.consultAI(this.enemies[0].onscreen(this.canvas_width, this.canvas_height),this.enemies[0]);

		this.checkTorpCollisions();
	};


	moveObjects() {		
		this.shift();

		// now give ships and objects their own movement
		this.enemies.forEach((enemy) => enemy.move(this.base_speed_inverse));

		this.moveTorpedos();
	}


	// shift moves everything but main ship to show main ship's movement
	shift() {
		const shift_x = this.enterprise.getDirection()[0] / this.base_speed_inverse;
		const shift_y = this.enterprise.getDirection()[1] / this.base_speed_inverse;


		this.stars.forEach((star) =>
					star.shift([shift_x , shift_y], this.enterprise.getSpeed()));

		this.enemies.forEach((enemy) => enemy.shift([shift_x, shift_y], this.enterprise.getSpeed()));
										
		// the planet and moon shift differently than the stars to give a layered background
		this.planet_08.shift(
			[this.enterprise.getDirection()[0] / (this.base_speed_inverse -2),
			this.enterprise.getDirection()[1] / (this.base_speed_inverse - 2)],
			this.enterprise.getSpeed());
												
		this.moon_01.shift(
			[this.enterprise.getDirection()[0] / (this.base_speed_inverse - 2.5),
			this.enterprise.getDirection()[1] / (this.base_speed_inverse - 2.5)],
			this.enterprise.getSpeed());	
	}


	draw(ctx){
		// clear canvas and draw black background
		ctx.beginPath();
		ctx.clearRect(0, 0, this.canvas_width, this.canvas_height);
		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, this.canvas_width, this.canvas_height);

		// draw all of the objects
		this.stars.forEach((star) => star.draw(ctx));
		this.planet_08.draw(ctx);
		this.moon_01.draw(ctx);
		this.torpedoes.forEach((torpedo) => torpedo.draw(ctx));

		this.enterprise.draw(ctx);
		this.enemies.forEach((enemy) => enemy.draw(ctx));

		// draw mute and autopilot box
		this.drawCheckBox(ctx, this.canvas_width - 130, 30, "Mute", this.muted);
		this.drawCheckBox(ctx, this.canvas_width - 130, 70, "Autopilot", this.autopilot);

		if (this.lose) this.drawMessage(ctx, "Sorry, your ship exploded");
		if (this.win) this.drawMessage(ctx, "Congratulations, You Win!");
	};


	drawMessage(ctx, message) {
		ctx.font = "72px FINALOLD";
		ctx.fillStyle = "#FAFAD2";

		ctx.fillText(message, this.canvas_width/2-315, this.canvas_height/3 - 100);
		ctx.fillText("Refresh to play again", this.canvas_width / 2 - 270, this.canvas_height / 3 - 20);
	};


	// draws the mute and autopilot check boxes	
	drawCheckBox(ctx, x, y, label, check) {
		ctx.beginPath();
		ctx.rect(x, y, 20, 20);
		ctx.strokeStyle = "white";
		ctx.stroke();

		ctx.font = "24px Arial";
		ctx.fillStyle = "white";
		ctx.fillText(label, x + 30, y + 18);

		if (check) {
			ctx.beginPath();
			ctx.moveTo(x, y + 10);
			ctx.lineTo(x + 10, y + 20);
			ctx.lineTo(x + 25, y);
			ctx.strokeStyle = 'red';
			ctx.lineWidth = 5;
			ctx.stroke();
		}
	};


	muteToggle() {
		if (this.muted) this.muted = false;
		else this.muted = true;
	};


	autoPilotToggle() {
		if (this.autopilot) this.autopilot = false;
		else this.autopilot = true;
	};

	// factory method to create stars
	// a version of this came from http://thenewcode.com/81/Make-A-Starfield-Background-with-HTML5-Canvas
	createStarField() {
		const starCount = 250;
		const	colorrange = [0, 60, 240];
		
		for (let i = 0; i < starCount; i++) {
			this.stars.push(new Star({
				pos: [Math.random() * this.canvas_width, Math.random() * this.canvas_height],
				radius: Math.random() * 2.0,
				hue: colorrange[this.getRandom(0, colorrange.length - 1)],
				sat: this.getRandom(50, 100),
				canvas_width: this.canvas_width,
				canvas_height: this.canvas_height				
			}))
		}
	};

	getRandom(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};


	moveTorpedos() {
		this.torpedoes.forEach((torpedo, i) => {
			torpedo.move();

			// delete torpedo when it moves offscreen
			let center = torpedo.center();
			if (center[0] < 0 || center[0] > this.canvas_width ||
				center[1] < 0 || center[1] > this.canvas_height)
				this.torpedoes.splice(i, 1);
		});
	};


	fireTorpedoes(ship) {
		if (ship.fireTorpedos()) {
			
			this.torpedoes.push(new Torpedo(ship.center(), this.torpImg,
				ship.calcDirection(ship.getRotation() - Math.PI / 18), ship ));

			this.torpedoes.push(new Torpedo(ship.center(), this.torpImg, 
				ship.getDirection(), ship ));

			this.torpedoes.push(new Torpedo(ship.center(), this.torpImg,
				ship.calcDirection(ship.getRotation() + Math.PI / 18), ship ));
		}
	};


	firePhasers(ship) {
		const enemyOnScreen = this.enemies[0].onscreen(this.canvas_width, this.canvas_height);
		if (ship === this.enterprise && enemyOnScreen) {
			ship.firePhasers(this.enemy);
		}
		else if (ship.onscreen(this.canvas_width, this.canvas_height)) { 
			ship.firePhasers(this.enterprise);
		}
	};


	checkTorpCollisions() {
		let distance;
		const ships = this.enemies.concat(this.enterprise);

		this.torpedoes.forEach((torpedo,i) => {
			ships.forEach((ship) => {
				distance = Utils.distance(ship, torpedo);
				if (distance < 30 && (ship !== torpedo.getLauncher())) {
					ship.receiveTorpHit(torpedo);

					this.torpedoes.splice(i, 1);
				}
			})
		})
	};


	checkKeyMap() {
		// spacebar
		if (this.keyMap["32"]) this.firePhasers(this.enterprise); 

		// f or k
		if (this.keyMap["75"] || this.keyMap["70"]) this.fireTorpedoes(this.enterprise);

		// acceleration/decceleration needs a longer turnCounter than turning
		// w or up arrow
		if ((this.keyMap["87"] || this.keyMap["38"]) && this.turnCounter === 0)
			this.enterprise.power(1);

		// s or down arrow
		if ((this.keyMap["83"] || this.keyMap["40"]) && this.turnCounter === 0)
			this.enterprise.power(-1);
		
		// a or left arrow
		if (this.keyMap["65"] || this.keyMap["37"]) this.enterprise.changeDirection(-1);

		// d or right arrow
		if (this.keyMap["68"] || this.keyMap["39"]) this.enterprise.changeDirection(1);
	};


	loadTorpImg() {
		this.torpImg = new Image();
		this.torpImg.onload = () => { return true; }
		this.torpImg.src = './images/torpedo.png';
	};

	loadPlanet(file) {
		let img = new Image();
		img.onload = () => { return true; }
		img.src = file;
		return img;
	};

}

module.exports = Game;
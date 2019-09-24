const Star = require("./star");
const Planet = require("./planet");
const EnemyAI = require("./enemyAI");
const Utils = require("./utils");

class Game {

	constructor(canvas_width, canvas_height) {
		this.canvas_width = canvas_width;
		this.canvas_height = canvas_height;
		this.stars = [];
		this.base_speed_inverse = 5;

		this.createStarField();
		this.loadTorpImg();
		this.D7turnCounter = 0;

		this.planet8 = new Planet({
			pos: [300, 300],
			img: this.loadPlanet('../images/planets/planet_08.png'),
			width: 200,
			height: 200,
			sheetCoords: [20, 20, 460, 480]
		});
	}

	addEnterprise(enterprise){
		this.enterprise = enterprise;
	}

	addEnemy(enemy){
		this.enemy = enemy
	}

	step() {
		const turnCounterMax = 5;
		this.moveObjects();

		this.checkTorpCollisions(this.enemy, this.enterprise.getTorpedos());
		this.checkTorpCollisions(this.enterprise, this.enemy.getTorpedos());

		EnemyAI.checkForMoves(this.enemy, this.enterprise, 
													this.canvas_width, this.canvas_height,
													this.D7turnCounter,
													this.torpImg);
		
		this.D7turnCounter++;
		if (this.D7turnCounter > turnCounterMax) this.D7turnCounter = 0;
	}


	moveObjects() {		
		this.shift();

		// now give ships and objects their own movement
		this.enemy.move(this.base_speed_inverse);

		this.moveTorpedos(this.enterprise);
		this.moveTorpedos(this.enemy);
	}


	// shift moves everything but main ship to show main ship's movement
	shift() {

		const shift_x = this.enterprise.getDirection()[0] / this.base_speed_inverse;
		const shift_y = this.enterprise.getDirection()[1] / this.base_speed_inverse;


		this.stars.forEach((star) =>
					star.shift([shift_x , shift_y], this.enterprise.getSpeed()));

		this.enemy.shift([shift_x, shift_y], this.enterprise.getSpeed());
										
		this.planet8.shift([this.enterprise.getDirection()[0] / (this.base_speed_inverse -2),
												this.enterprise.getDirection()[1] / (this.base_speed_inverse - 2)],
												this.enterprise.getSpeed());	
	}


	draw(ctx){
		// clear canvas and draw black background
		ctx.beginPath();
		ctx.clearRect(0, 0, this.canvas_width, this.canvas_height);
		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, this.canvas_width, this.canvas_height);

		// draw all of the objects
		this.drawStars(ctx);
		this.planet8.draw(ctx);
		this.enterprise.draw(ctx);
		this.enemy.draw(ctx);
		this.enterprise.getTorpedos().forEach((torpedo) => torpedo.draw(ctx));
		this.enemy.getTorpedos().forEach((torpedo) => torpedo.draw(ctx));
	}

	drawStars(ctx) {
		this.stars.forEach((star) => star.draw(ctx));
	}


	// factory method to create stars
	// a version of this came from http://thenewcode.com/81/Make-A-Starfield-Background-with-HTML5-Canvas
	createStarField() {
		const starCount = 250;
		const	colorrange = [0, 60, 240];
		
		for (let i = 0; i < starCount; i++) {
	
			this.stars.push(new Star({
				pos: [Math.random() * this.canvas_width, Math.random() * this.canvas_height],
				radius: Math.random() * 1.6,
				hue: colorrange[this.getRandom(0, colorrange.length - 1)],
				sat: this.getRandom(50, 100),
				canvas_width: this.canvas_width,
				canvas_height: this.canvas_height				
			}))
		}
	}


	moveTorpedos(ship) {
		ship.getTorpedos().forEach((torpedo, i) => {
			torpedo.move();

			// delete torpedo when it moves offscreen
			let center = torpedo.center();
			if (center[0] < 0 || center[0] > this.canvas_width ||
				center[1] < 0 || center[1] > this.canvas_height)
				ship.getTorpedos().splice(i, 1);
		});
	}

	getRandom(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};


	fireTorpedos(ship) {
		ship.fireTorpedos(this.torpImg);
	};


	firePhasors(ship) {
		const enemyOnScreen = this.enemy.onscreen(this.canvas_width, this.canvas_height);
		if (ship === this.enterprise && enemyOnScreen) {
			ship.firePhasors(this.enemy);
		}
		else if (enemyOnScreen) { 
			ship.firePhasors(this.enterprise);
		}
	};


	checkTorpCollisions(ship, torpedos) {
		let distance;

		torpedos.forEach((torpedo,i) => {
			distance = Utils.distance(ship, torpedo);
			if (distance < 30) {
				torpedos.splice(i, 1);
				if (ship === this.enterprise) ship.receiveTorpHit(this.enemy);
				else ship.receiveTorpHit(this.enterprise)
			}
		})
	};


	loadTorpImg() {
		this.torpImg = new Image();
		this.torpImg.onload = () => { return true; }
		this.torpImg.src = '../images/torpedo.png';
	};

	loadPlanet(file) {
		let img = new Image();
		img.onload = () => { return true; }
		img.src = file;
		return img;
	};

}

module.exports = Game;


		// this.planet1 = new Planet({
		// 	pos:[300,300], 
		// 	img: this.loadPlanet('../images/planets/planet_01.png'),
		// 	width:200,
		// 	height:200,
		// 	sheetCoords: [20, 10, 480, 470]
		// });

		// this.planet9 = new Planet({
		// 	pos: [300, 300],
		// 	img: this.loadPlanet('../images/planets/planet_09.png'),
		// 	width: 200,
		// 	height: 200,
		// 	sheetCoords: [20, 20, 580, 580]
		// });
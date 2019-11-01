const Game = require("./game");
const GameOpening = require("./game_opening");
const Enterprise = require("./enterprise");
const Soyuz = require("./soyuz");
const D7 = require("./d7");
const Bird_of_Prey = require("./bird_of_prey");
const Utils = require("./utils");

class GameView {

	constructor(ctx, sounds) {

		this.ctx = ctx;
		this.sounds = sounds;
		this.pause = false;

		this.images = this.loadImages();
		this.game = new Game(this.images);
		this.gameOpening = new GameOpening();
	};
	

	start() {
		// start the animation
		requestAnimationFrame(this.animate.bind(this));
	};


	animate() {
		if (!this.pause) {

			// if unpaused this steps and draws either the game or the gameOpening
			if (this.gameOpening !== null) this.gameOpening.stepAndDraw(this.ctx);
			else {
				if (this.game.main.getHull() === 0) this.game.lose = true;
				else if (this.game.enemies.length === 0) this.game.win = true;
				else {
					this.game.enemies.forEach((enemy, i) => {
						if (enemy.isGone()){
							this.game.enemies.splice(i, 1);
							this.game.enemyAIs.splice(i, 1);
							if(this.game.main.getTarget() === enemy) this.game.changeMainTarget();
							if(this.game.enemies.length > 0) 
								this.game.enemies[this.game.enemies.length - 1].setLabels(true);
						} 
					})
					this.game.allies.forEach((ally, i) => {
						if (ally.isGone()) {
							this.game.allies.splice(i, 1);
							this.game.allyAIs.splice(i, 1);
						}
					})
					this.game.step();
				}
				this.game.draw(this.ctx);
			}

			// every call to animate requests causes another call to animate
			requestAnimationFrame(this.animate.bind(this));
		}
	};

	
	keyHandler(e) {
		if (e.type == 'keydown') this.game.getKeyMap()[e.keyCode] = true;
		else this.game.getKeyMap()[e.keyCode] = false;			
	};


	// get scenario click if still in the opening of the game, or
	// check to see if mute or autopilot is being clicked
	checkClick(x, y, gainNode) {

		if (this.gameOpening !== null) {
			if (y >= 317 && y <= 734) {
				if (x > 54 && x < 407) {
					this.loadScenario1();
					this.openingOff();
				}
				else if (x > 440 && x < 795) {
					this.loadScenario2();
					this.openingOff();
				}
				else if (x > 830 && x < 1184) {
					this.loadScenario3();
					this.openingOff();
				}
			}
		}
		else {
			if(x > 1085 && x < 1112) {
				if (y > 46 && y < 71) {
					this.game.muteToggle();

					if (gainNode.gain.value > -.01 && gainNode.gain.value < .01) gainNode.gain.value = .25;
					else gainNode.gain.value = 0;

					// if paused, draw to show checkmark in box
					if (this.pause) this.game.draw(this.ctx)
				}
				else if (y > 85 && y < 112) {
					this.game.autoPilotToggle();

					// if paused, draw to show checkmark in box
					if (this.pause) this.game.draw(this.ctx)
				}
			}
		}
	};


	pauseGameToggle() {
		this.pause = this.pause === false;
		
		// needed to restart animation on unpause
		if (!this.pause) requestAnimationFrame(this.animate.bind(this));
	};


	openingOff() {
		this.gameOpening = null;
		this.sounds.theme.play();
	};


	loadScenario1(){
		this.game.createPlanetAndMoon(this.images.planet_08, [0, 0, 480, 480],this.images.moon_01 );

		this.addMain([1040, 710, 1, true], false);
		this.addD7([0, 200], [100, 710, 1, true], false);

		this.game.main.setTarget(this.game.enemies[0]);
	};


	loadScenario2() {
		this.game.createPlanetAndMoon(this.images.planet_03, [0, 0, 480, 480], this.images.moon_01);

		this.addMain([1040, 710, 1, true], false);
		this.addBop([0, 400], [100, 620, .6, false], true, 80, 100);
		this.addBop([0, 50], [100, 775, .6, true], true);

		this.game.main.setTarget(this.game.enemies[0]);
	};


	loadScenario3() {
		this.game.createPlanetAndMoon(this.images.moon_03, [0, 0, 110, 110], this.images.moon_01);

		this.addMain([1040, 775, .6, true], true);
		this.addSoyuz([600, 350], [1040, 465, .6, false], true);
		this.addSoyuz([600, 450], [1040, 620, .6, false], true,50,50);
		this.addBop([0, 300], [100, 465, .6, false], true, 80, 100);
		this.addBop([0, 100], [100, 620, .6, false], true);
		this.addD7([0, 200], [100, 775, .6, true], true);

		this.game.main.setTarget(this.game.randomTarget(this.game.main));
	};


	addMain(ssdPos, aiTargeting, phaserRecharge, torpedoReload) {
		this.game.addMainShip(new Enterprise({
			pos: [Utils.getCanvasDim()[0] / 2 - 50, Utils.getCanvasDim()[1] / 2 - 50], ssdPos,
			rotationOffset: Math.PI,
			images: this.images,
			sounds: this.sounds,
			phaserRecharge,
			torpedoReload
		}), aiTargeting);
	}

	addBop(pos, ssdPos, aiTargeting, phaserRecharge, torpedoReload) {
		this.game.addEnemy(new Bird_of_Prey({
			pos, ssdPos,
			images: this.images,
			sounds: this.sounds,
			phaserRecharge,
			torpedoReload
		}), aiTargeting);
	};

	addSoyuz(pos, ssdPos, aiTargeting, phaserRecharge, torpedoReload) {
		this.game.addAlly(new Soyuz({
			pos, ssdPos,
			rotationOffset: Math.PI,
			images: this.images,
			sounds: this.sounds,
			phaserRecharge,
			torpedoReload
		}), aiTargeting);
	};

	addD7(pos, ssdPos, aiTargeting, phaserRecharge, torpedoReload) {
		this.game.addEnemy(new D7({
			pos, ssdPos,
			images: this.images,
			sounds: this.sounds,
			phaserRecharge,
			torpedoReload
		}), aiTargeting);
	};


	loadImages() {
		return {
			sparksImg: Utils.loadImg('./images/sparks.png'),
			explosionImg: Utils.loadImg('./images/explosion-sprite-sheet.png'),
			bopImg: Utils.loadImg('./images/bop.png'),
			d7Img: Utils.loadImg('./images/D7.png'),
			soyuzImg: Utils.loadImg('./images/soyuz.png'),
			enterpriseImg: Utils.loadImg('./images/uss-enterprise-png-view-original-669.png'),
			torpImg: Utils.loadImg('./images/torpedo.png'),
			kTorpImg: Utils.loadImg('./images/many_torpedos.png'),
			bopSsdImg: Utils.loadImg('./images/bop-ssd.png'),
			d7SsdImg: Utils.loadImg('./images/D7-SSD.png'),
			soyuzSsdImg: Utils.loadImg('./images/soyuz-ssd.png'),
			entSsdImg: Utils.loadImg('./images/enterprise-refit-ssd.png'),
			moon_01: Utils.loadImg('./images/planets/moon_01.png'),
			moon_03: Utils.loadImg('./images/planets/moon_03.png'),
			planet_08: Utils.loadImg('./images/planets/planet_08.png'),
			planet_03: Utils.loadImg('./images/planets/planet_03.png'),
		}
	};
}

module.exports = GameView;
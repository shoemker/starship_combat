const Utils = require("./utils");

class GameOpening {

	constructor() {
		this.canvas_width = Utils.getCanvasDim()[0];
		this.canvas_height = Utils.getCanvasDim()[1];
		this.shipChoice = true;
		this.scenario = false;

		this.max_depth = 32;

		this.stars = new Array(512);

		this.createOpeningStarfield();

		this.bopScenImg = Utils.loadImg('./images/scenarios/bops_scenario.png');
		this.d7ScenImg = Utils.loadImg('./images/scenarios/D7_scenario.png');
		this.fleetScenImg = Utils.loadImg('./images/scenarios/fleet_scenario.png');
	};

	getShipChoice() { return this.shipChoice; }
	setShipChoice(choice) { this.shipChoice = choice; }

	getScenario() { return this.scenario; }
	setScenario(scen) { this.scenario = scen; }

	// a version of the starfield came from http://codentronix.com/2011/07/22/html5-canvas-3d-starfield/
	createOpeningStarfield() {
		for (let i = 0; i < this.stars.length; i++) {
			this.stars[i] = {
				x: this.randomRange(-32, 32),
				y: this.randomRange(-32, 32),
				z: this.randomRange(1, this.max_depth)
			};
		};
	};


	stepAndDraw(ctx) {
		const halfWidth = this.canvas_width / 2;
		const halfHeight = this.canvas_height / 2;

		ctx.fillStyle = "rgb(0,0,0)";
		ctx.fillRect(0, 0, this.canvas_width, this.canvas_height);

		this.stars.forEach((star) => {
			star.z -= 0.1;

			if (star.z <= 0) {
				star.x = this.randomRange(-32, 32);
				star.y = this.randomRange(-32, 32);
				star.z = this.max_depth;
			}

			const k = 128.0 / star.z;
			const px = star.x * k + halfWidth;
			const py = star.y * k + halfHeight;

			if (px >= 0 && px <= this.canvas_width && py >= 0 && py <= this.canvas_height) {
				const size = (1 - star.z / 32.0) * 5;
				const shade = parseInt((1 - star.z / 32.0) * 255);
				ctx.fillStyle = "rgb(" + shade + "," + shade + "," + shade + ")";
				ctx.fillRect(px, py, size, size);
			}
		});

		if (this.shipChoice) this.drawShipChoice(ctx);
		else if (this.scenario) this.drawScenario(ctx);
	};


	randomRange(minVal, maxVal) {
		return Math.floor(Math.random() * (maxVal - minVal - 1)) + minVal;
	};


	drawScenario(ctx) {
		ctx.drawImage(this.d7ScenImg, 0, 0, 350, 350,  37, 300,  350, 350);
		ctx.drawImage(this.bopScenImg, 0, 0, 350, 350, 424, 300, 350, 350);
		ctx.drawImage(this.fleetScenImg, 0, 0, 350, 350, 813, 300, 350, 350);

		ctx.beginPath();

		ctx.rect(37, 300, 350, 350);
		ctx.rect(424, 300, 350, 350);
		ctx.rect(813, 300, 350, 350);

		ctx.strokeStyle = "grey";
		ctx.lineWidth = 3;
		ctx.stroke();

		ctx.fillStyle = "lightblue";
		ctx.font = "80px FINALOLD";
		ctx.fillText("Now Click a Scenario", this.canvas_width / 2 - 260, 200);

		ctx.font = "44px FINALOLD";
		ctx.fillText("Fight a Cruiser", 110, 715);
		ctx.fillText("2 Smaller Birds of Prey", 428, 715);
		ctx.fillText("or in a Fleet Action", 850, 715);
	};


	drawShipChoice(ctx) {
		ctx.fillStyle = "lightblue";

		ctx.font = "108px FINALOLD";
		ctx.fillText("The Picard Maneuver", this.canvas_width / 2 - 365, this.canvas_height /4);

		ctx.font = "72px FINALOLD";
		ctx.fillText("A Tactical Starship Combat Game", this.canvas_width / 2 - 380, this.canvas_height / 4+ 80);

		ctx.fillStyle = "white";

		ctx.font = "54px FINALOLD"; 
		ctx.fillText("Play as This Ship", 125+50, 460);
		ctx.fillText("Doodle Your Own Ship", 675+13, 460);


		ctx.fillText("Click Here!", 125 + 110, 780);
		ctx.fillText("Click Here!", 675 + 110, 780);

		ctx.fillStyle = "lightblue";
		ctx.font = "72px FINALOLD";
		ctx.fillText("OR", 575, 620);


		Utils.drawBlackRectangleWithBorder(ctx,125,480,400,250);
		Utils.drawBlackRectangleWithBorder(ctx, 675, 480, 400, 250);
	}


}

module.exports = GameOpening;
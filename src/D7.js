const Ship = require("./ship");

class D7 extends Ship {
	constructor(options) {
		super(options);
		this.width = 100;
		this.height = 50
		this.loadShipImg();

	}


	draw(ctx) {

		ctx.drawImage(this.shipImg, 0, 0, 1000, 500,
			this.pos[0],
			this.pos[1],
			this.width,
			this.height);

	}


	loadShipImg() {
		this.shipImg = new Image();
		this.shipImg.onload = () => { return true; }
		this.shipImg.src = '../images/D7.png';

	}

	rotateCC() { console.log("cc") }
	rotateCL() { console.log("cl") }
}


module.exports = D7
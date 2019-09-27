const Ship = require("./ship");
const SSD = require("./ssd");

class D7 extends Ship {
	constructor(options) {
		super(options);

		this.loadShipImg();

		// ssd is the ship systems display in the corner of the screen
		this.ssd = new SSD({
			ssd_x: 100,
			ssd_y: 700,
			ssd_width: 70,
			ssd_height: 120,
			imgName: './images/D7-SSD.png',
			beamWeaponName: 'Disruptor',
			imgCoords: [0, 0, 170, 175]
		});
	};


	draw(ctx) {
		ctx.save();

		this.rotateCanvas(ctx);

		//draw ship
		if (this.shipExplosionCounter < 34) {
			ctx.drawImage(this.shipImg, 0, 0, 380, 275,
				this.pos[0],
				this.pos[1],
				this.width,
				this.height
			);
		}

		ctx.restore();

		super.draw(ctx);
	};


	loadShipImg() {
		this.shipImg = new Image();
		this.shipImg.onload = () => { return true; }
		this.shipImg.src = './images/D7.png';
	};
}


module.exports = D7
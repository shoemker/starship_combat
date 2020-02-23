const Frigate = require("./frigate");
const SSD = require("../ssd");
const Utils = require("../utils");

class Soyuz extends Frigate {
	constructor(options) {
		super(options);

		this.enemy = false;

		this.width = 35;
		this.height = 28;
		this.beamPattern = [];

		this.beamSound = options.sounds.disrupt2Sound;
		this.torpSound = options.sounds.torpSound;

		this.phaserRechargeMax = 170;
		this.torpedoReloadMax = 200;

		this.phaserOffsetDistance = 13;
		this.phaserOffsetAngle = 1.5 * Math.PI;
		this.phaserColor = "red";

		this.phaserDamage = 10;
		this.hullIntegrityMax = 100;
		this.hullIntegrity = this.hullIntegrityMax;

		// ssd is the ship systems display in the corner of the screen
		this.ssd = new SSD({
			ssdPos: options.ssdPos,
			img_size: [80, 100],
			img_pos_offset: [-5, 10],
			img: this.images.soyuzSsdImg,
			beamWeaponName: 'Phaser',
			imgCoords: [0, 0, 202, 298],
			shieldStrength: 40
		});
	};


	draw(ctx) {
		super.draw(ctx, Utils.drawCircleBeam,
			{ image: this.images.soyuzImg, x: 0, y: 0, width: 362, height: 237 });
	};
}

module.exports = Soyuz;
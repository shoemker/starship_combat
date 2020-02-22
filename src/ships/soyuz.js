const Frigate = require("./frigate");
const SSD = require("../ssd");
const Utils = require("../utils");

class Soyuz extends Frigate {
	constructor(options) {
		super(options);

		this.enemy = false;

		this.width = 35;
		this.height = 28;

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


	draw(ctx, target) {
		ctx.save();

		this.rotateCanvas(ctx);

		//draw ship
		if (this.shipExplosionCounter < 34) {
			ctx.drawImage(this.images.soyuzImg, 0, 0, 362, 237,
				this.pos[0], this.pos[1], this.width, this.height
			);
		}

		ctx.restore();

		// fires a 2nd phaser line from other side
		if (this.phaserCounter > 0 && this.ptarget && !this.ptarget.isGone()) 
			this.drawPhaser(ctx, 2 * Math.PI - this.phaserOffsetAngle, 0, Utils.drawLine);

		super.draw(ctx, Utils.drawLine, target);
	};
}

module.exports = Soyuz;
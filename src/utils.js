
const Utils = {

	distance(obj1, obj2) {
		let distance_x = obj1.center()[0] - obj2.center()[0];
		let distance_y = obj1.center()[1] - obj2.center()[1];
		return Math.sqrt(distance_x * distance_x + distance_y * distance_y);
	},

	angleToOtherShip(ship, otherShip) {
		const xDelta = otherShip.center()[0] - ship.center()[0];
		const yDelta = otherShip.center()[1] - ship.center()[1];

		let angle = this.findAngle(xDelta,yDelta);
		
		// take the rotation of the hit ship into account
		angle -= ship.getRotation();
		if (angle < 0) angle += Math.PI * 2;
		return angle;
	},

	
	// find the angle between the 2 objects
	findAngle(xDelta, yDelta) {
		const arcTangent = Math.atan(yDelta / xDelta);
		let angle;
		
		if (xDelta < 0) angle = arcTangent + Math.PI;
		else if (xDelta > 0 && yDelta < 0) angle = arcTangent + Math.PI * 2;
		else angle = arcTangent;

		return angle;
	},


	loadImg(file) {
		let img = new Image();
		img.onload = () => { return true; }
		img.src = file;
		return img;
	},

	// draw a red circle with a vert and a horiz line
	drawTarget(ctx, x, y, size, lw) {

		ctx.beginPath();
		ctx.strokeStyle = "red";
		ctx.lineWidth = lw;
		ctx.arc(x, y, size, 0, 2 * Math.PI);

		ctx.moveTo(x, y - size);
		ctx.lineTo(x, y + size);
		ctx.moveTo(x - size, y);
		ctx.lineTo(x + size, y);
		
		ctx.stroke();
	}, 


	drawLine(ctx, startingPoint, endingPoint, beamPattern){
		ctx.beginPath();
		ctx.setLineDash(beamPattern);  // bop beam is a dotted line
		ctx.moveTo(endingPoint.x, endingPoint.y);
		ctx.lineTo(startingPoint.x, startingPoint.y);
	},


	// a version of this came from https://codepen.io/alexkulagin/pen/wGwpdx
	drawwWavyLine(ctx, from, to) {
		const frequency = 8;
		const amplitude = 6;
		const step = 4;
		const negative = false;
		let cx = 0;
		let cy = 0;
		let i;
		let waveOffsetLength = 0;

		const ang = Math.atan2(to.y - from.y, to.x - from.x);
		const distance = Math.sqrt((from.x - to.x) * (from.x - to.x) + (from.y - to.y) * (from.y - to.y));
		const a = amplitude * (!negative ? 1 : -1);
		const f = Math.PI * frequency;

		for (i = 0; i <= distance; i += step) {
			waveOffsetLength = Math.sin((i / distance) * f) * a;
			cx = from.x + Math.cos(ang) * i + Math.cos(ang - Math.PI / 2) * waveOffsetLength;
			cy = from.y + Math.sin(ang) * i + Math.sin(ang - Math.PI / 2) * waveOffsetLength;
			i > 0 ? ctx.lineTo(cx, cy) : ctx.moveTo(cx, cy);
		}
	},

	getCanvasDim() { return [1200, 900]; }
}

module.exports = Utils;
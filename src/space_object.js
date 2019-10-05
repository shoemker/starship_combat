
class SpaceObject {
	constructor(pos) {
		this.pos = pos;

		this.direction = [0,0];
		this.width;
		this.height;
	};


	rotateCanvas(ctx) {
		ctx.translate(this.center()[0], this.center()[1]);
		ctx.rotate(this.rotationOffset);
		ctx.translate(-(this.center()[0]), -(this.center()[1]));
	};


	move(base_speed_inverse) {
		this.pos[0] += (this.direction[0] / base_speed_inverse) * this.speed;
		this.pos[1] -= (this.direction[1] / base_speed_inverse) * this.speed;
	};


	// shifts to account for main ship movement
	shift(direction, speed) {
		this.pos[0] -= speed * direction[0];
		this.pos[1] += speed * direction[1];
	};


	onscreen(canvas_width, canvas_height) {
		const center = this.center();
		return (center[0] > 0 && center[0] < canvas_width &&
						center[1] > 0 && center[1] < canvas_height);
	};

	
	center() {
		return [this.pos[0] + this.width / 2, this.pos[1] + this.height / 2];
	};

}

module.exports = SpaceObject
var t=this;
t.global.setconvspeed=0.2;
const setconv = extendContent(Conveyor, "setconv", {
	draw(tile){
		if(this.speed!=t.global.setconvspeed*0.1){
			this.speed=t.global.setconvspeed*0.1;
			print("Speed updated to "+this.speed);
		}
		this.super$draw(tile);
	}
	update(tile){
		if(this.speed!=t.global.setconvspeed*0.1){
			this.speed=t.global.setconvspeed*0.1;
			print("Speed updated to "+this.speed);
		}
		this.super$update(tile);
	}
});
setconv.idleSound=Sounds.none;
setconv.idleSoundVolume=0;

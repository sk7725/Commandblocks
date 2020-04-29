var t=this;
t.global.setconvspeed=0.2;
const setconv = extendContent(Conveyor, "setconv", {

	update(tile){
		if(this.speed!=t.global.setconvspeed){
			this.speed=t.global.setconvspeed;
		}
		this.super$update(tile);
	}
});
setconv.idleSound=Sounds.none;
setconv.idleSoundVolume=0;

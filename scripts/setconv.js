var t=this;
t.global.setconvspeed=0.2;
t.global.setconvchanged=false;
const setconv = extendContent(Conveyor, "setconv", {

	update(tile){
		if(t.global.setconvchanged){
			this.speed=t.global.setconvspeed*0.1;
			t.global.setconvchanged=false;
		}
		this.super$update(tile);
	}
});
setconv.idleSound=Sounds.none;
setconv.idleSoundVolume=0;

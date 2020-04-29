var t=this;
t.global.setconvspeed=0.2;
const setconva = extendContent(ArmoredConveyor, "setconva", {

	update(tile){
		if(this.speed!=t.global.setconvspeed*0.1){
			this.speed=t.global.setconvspeed*0.1;
		}
		this.super$update(tile);
	}
});
setconva.idleSound=Sounds.none;
setconva.idleSoundVolume=0;

var t=this;
t.global.setconvspeed=0.2;
t.global.setconvchangeda=false;
const setconva = extendContent(ArmoredConveyor, "setconva", {

	update(tile){
		if(t.global.setconvchangeda){
			this.speed=t.global.setconvspeed*0.1;
			t.global.setconvchangeda=false;
			//print("speed is now:"+this.speed);
		}
		this.super$update(tile);
	}
});
setconva.idleSound=Sounds.none;
setconva.idleSoundVolume=0;

var t=this;
t.global.setconvspeed=0.2;
const setconv = extendContent(Conveyor, "setconv", {
	update(tile){
		this.speed=t.global.setconvspeed*0.1;
		this.super$update(tile);
	}
});

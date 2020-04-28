var t=this;
t.global.setconvspeed=1;
const setconv = extendContent(Conveyor, "setconv", {
	update(tile){
		this.speed=t.global.setconvspeed;
		this.super$update(tile);
	}
});

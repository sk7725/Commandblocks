var t=this;
t.global.setconvspeed=1;
const setconv = extendContent(Conveyer, "setconv", {
	update(tile){
		this.speed=t.global.setconvspeed;
		this.super$update(tile);
	}
});

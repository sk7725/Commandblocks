/*
MessageBlockEntity entity = tile.ent();
if(entity != null){
    entity.message = result.toString();
    entity.lines = entity.message.split("\n");
}
*/
const posreaderblock = extendContent(MessageBlock, "posreaderblock", {
	buildConfiguration(tile, table){

	},
	getfacingpos(tx, ty, trot){
		var tmpobj={};
		if(trot==0){
			tmpobj.x=tx+1;
			tmpobj.y=ty;
		}
		else if(trot==1){
			tmpobj.x=tx;
			tmpobj.y=ty+1;
		}
		else if(trot==2){
			tmpobj.x=tx-1;
			tmpobj.y=ty;
		}
		else{
			tmpobj.x=tx;
			tmpobj.y=ty-1;
		}
		return tmpobj;
	},
	placed(tile) {
		this.super$placed(tile);
		const facepos=this.getfacingpos(tile.x,tile.y,tile.rotation());
		const x=facepos.x;
    const y=facepos.y;
		var near = Vars.world.tile(x,y);
    //this.setMessageBlockText(null,tile,JSON.stringify(Blocks));
    this.setMessageBlockText(null,tile,near.toString());
	}
/*
	removed(tile) {
		this.super$removed(tile);
		const x = this.calcOffset(tile);
		const key = tile.x + "," + tile.y;
		//Prevent trying to delete the other half infinitely
		if (alive[key]) {
			alive[key] = false;
			Call.setTile(Vars.world.tile(x, tile.y), Blocks.air, tile.team, 0);
		}
	},*/
	//chad: false
});

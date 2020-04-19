/*
MessageBlockEntity entity = tile.ent();
if(entity != null){
    entity.message = result.toString();
    entity.lines = entity.message.split("\n");
}
*/
//cmd=require("commandblock");
const commandblocks=this.global.commandblocks;
const commandblockrepeating = extendContent(MessageBlock, "commandblockrepeating", {
  update(tile){
    var entity=tile.ent();
    if(tile.entity.cons.valid()){
      this.super$update(tile);
      //entity.cons.trigger();
      commandblocks.command(tile,entity.message);
    }
    else return;
  }
  /*
	draw(tile) {
		Draw.rect(Core.atlas.find(this.name + "_" + tile.x % 2),
			tile.drawx(),
			tile.drawy());
	},

	generateIcons() {
		return [Core.atlas.find(this.name)];
	},

	calcOffset(tile) {
		var x = tile.x;
		if (x % 2 == 0) {
			x++;
		} else {
			x--;
		}
		return x;
	},

	canPlaceOn(tile){
		const x = this.calcOffset(tile);
		const other = Vars.world.tile(x, tile.y);
		return other.block() == "air"
	},
  */
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

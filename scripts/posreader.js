/*
MessageBlockEntity entity = tile.ent();
if(entity != null){
    entity.message = result.toString();
    entity.lines = entity.message.split("\n");
}
*/
const posreader = extendContent(MessageBlock, "posreader", {
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
	placed(tile) {
		this.super$placed(tile);
		const x=tile.x
    const y=tile.y
    MessageBlockEntity entity = tile.ent();
    if(entity != null){
        entity.message = "( "+x+" , "+y+" )";
        entity.lines = entity.message.split("\n");
    }
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

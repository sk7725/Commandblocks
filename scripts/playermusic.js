/*
MessageBlockEntity entity = tile.ent();
if(entity != null){
    entity.message = result.toString();
    entity.lines = entity.message.split("\n");
}
*/
const playermusic = extendContent(MessageBlock, "playermusic", {
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
	buildConfiguration(tile, table){
		table.addImageButton(
			Icon.arrowRightSmall,
			Styles.clearTransi,
			run(() => tile.configure(0))
		).size(40);
	},
	configured(tile,value){
		var entity=tile.ent();
		var musename=entity.message;
		if(musename==""){
			Vars.control.music.play(null);
		}
		else{
			//var muse=Vars.content.getByName(ContentType.unit,"commandblocks-xmusic-"+musename).activeSound;
			//Vars.control.music.play(muse);
			//if music=sound(unlikely)
			var mpath = Vars.tree.get("music-"+musename + ".ogg").exists() && !Vars.ios ? musename + ".ogg" : musename + ".mp3";
			var muse = newMusic(mpath);
			Vars.control.music.play(muse);
		}
	}
});

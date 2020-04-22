
const unitreader = extendContent(MessageBlock, "unitreader", {
	unitOn(tile,unit){
		var entity=tile.ent();
		this.setMessageBlockText(null,tile,unit.toString());
	}
});

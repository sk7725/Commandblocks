
const unitreader = extendContent(MessageBlock, "unitreader", {
	unitOn(tile,unit){
		var entity=tile.ent();
		Call.setMessageBlockText(null,tile,unit.toString());
	}
});

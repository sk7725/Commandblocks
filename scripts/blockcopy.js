/*
MessageBlockEntity entity = tile.ent();
if(entity != null){
    entity.message = result.toString();
    entity.lines = entity.message.split("\n");
}
*/
const blockcopy = extendContent(MessageBlock, "blockcopy", {
	buildConfiguration(tile, table){
		table.addImageButton(Icon.paste, run(() => {
			var msg=tile.ent().message;
			try{
				if(msg==""){
					var nametext=this.gettilename(tile.getNearby(tile.rotation()));
					Call.setMessageBlockText(null,tile,nametext);
					if(Fonts.getUnicode(nametext)>0){
						Core.app.setClipboardText(String.fromCharCode(Fonts.getUnicode(nametext)) + "");
						Vars.ui.showInfoFade("Copied!");
					}
				}
				else{
					if(Fonts.getUnicode(msg)>0){
						Core.app.setClipboardText(String.fromCharCode(Fonts.getUnicode(msg)) + "");
						Vars.ui.showInfoFade("Copied!");
					}
				}
			}
			catch(err){
				print(err);
			}
		})).size(40);
		this.super$buildConfiguration(tile,table);
	},
	placed(tile) {
		this.super$placed(tile);
		var nametext=this.gettilename(tile.getNearby(tile.rotation()));
    Call.setMessageBlockText(null,tile,nametext);
	},
	gettilename(tile){
		if(tile.block()=="air"){
			return tile.floor().name;
		}
		return tile.block().name;
	},
	drawSelect(tile){
		var uni=Fonts.getUnicode(tile.ent().message);
    this.drawPlaceText((uni>0)?String.fromCharCode(uni):"??",tile.x,tile.y,uni>0);
		this.super$drawSelect(tile);
  },
});

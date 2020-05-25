/*
MessageBlockEntity entity = tile.ent();
if(entity != null){
    entity.message = result.toString();
    entity.lines = entity.message.split("\n");
}
*/
const researchtest = extendContent(MessageBlock, "researchtest", {
	buildConfiguration(tile, table){
		var entity=tile.ent();
		table.addImageButton(Icon.book, run(() => {
      try{
				const dialog = new TechTreeDialog();
				// Show it
				dialog.show();
      }
      catch(err){
        print("err:"+err);
      }
    })).size(40);
		//this.super$buildConfiguration(tile,table);
	}
});

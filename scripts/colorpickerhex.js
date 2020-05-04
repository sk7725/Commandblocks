var t=this;
//this.global.colors.brushcolor["U-"+Vars.player.name]=Color.valueOf("000000").rgba();
const colorpickerhex = extendContent(MessageBlock, "colorpickerhex", {
  load(){
    this.super$load();
    this.region=Core.atlas.find(this.name);
    this.topRegion=Core.atlas.find(this.name+"-top");
  },
  draw(tile){
    //if(!t.global.colors.brushcolor.hasOwnProperty("U-"+Vars.player.name)) t.global.colors.brushcolor["U-"+Vars.player.name]=Color.valueOf("000000").rgba();
    this.super$draw(tile);
    try{
      Draw.color(Color.valueOf(tile.ent().message));
    }
    catch(err){}
    Draw.rect(this.topRegion, tile.drawx(), tile.drawy());
    Draw.color();
  },
  buildConfiguration(tile, table){
    this.super$buildConfiguration(tile,table);
    table.addImageButton(Icon.pick, run(() => {
      tile.configure(Color.valueOf(tile.ent().message).rgba())
    })).size(40);
  },
  configured(tile, player, value){
    //tile.ent().color = value;
    if(player==null) return;
    t.global.colors.brushcolor["U-"+player.name]=value;
    //Vars.ui.showInfoToast(value,1);
  },
  drawSelect(tile){
    var message=tile.ent().message;
    this.drawPlaceText((message.substring(0,1)=="#")?message:"#"+message,tile.x,tile.y,true);
  },
  updateTableAlign(tile,table){
    var pos = Core.input.mouseScreen(tile.drawx(), tile.drawy() - tile.block().size * Vars.tilesize / 2 - 1);
    table.setPosition(pos.x, pos.y, Align.top);
  },
  placed(tile){
    this.super$placed(tile);
    Call.setMessageBlockText(null,tile,"000000");
  }
  //save load brush
});

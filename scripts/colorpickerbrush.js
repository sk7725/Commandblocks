var t=this;
//this.global.colors={};
this.global.colors.brushtype={};
const brushes=["pencil","eraser","effect","spray","line","box","fill","pipette"]
const colorpickerbrush = extendContent(Block, "colorpickerbrush", {
  /*
  playerPlaced(tile){
    tile.configure(t.global.colors.brushcolor["U-"+Vars.player.name]);
  },
  */
  load(){
    this.super$load();
    this.region=Core.atlas.find(this.name);
    this.baseRegion=Core.atlas.find(this.name+"base");
    this.topRegion=[];
    for(var i=0;i<brushes.length;i++){
      this.topRegion.push(Core.atlas.find(this.name+"-top-"+i));
    }
  },
  draw(tile){
  //super.draw(tile); LightEntity entity = tile.ent(); Draw.blend(Blending.additive); Draw.color(Tmp.c1.set(entity.color), entity.efficiency() * 0.3f); Draw.rect(reg(topRegion), tile.drawx(), tile.drawy()); Draw.color(); Draw.blend();
  //Tmp.c1.set(tile.ent().color)
  //use in draw
    if(!t.globalbcolors.brushtype.hasOwnProperty("U-"+Vars.player.name)) t.global.colors.brushtype["U-"+Vars.player.name]=0;
    Draw.rect(this.baseRegion, tile.drawx(), tile.drawy());
    Draw.color(Tmp.c1.set(t.global.colors.brushcolor["U-"+Vars.player.name]));
    Draw.rect(this.topRegion[t.global.colors.brushtype["U-"+Vars.player.name]], tile.drawx(), tile.drawy());
    Draw.color();
  },
  buildConfiguration(tile, table){
    //var entity = tile.ent();
    //js-fy this at home
    for(var i=0;i<brushes.length;i++){
      table.addImageButton(Icon[brushes[i]],Styles.clearTransi, run(() => {
        tile.configure(i)
      })).size(40);
    }
  },
  configured(tile, player, value){
    //tile.ent().color = value;
    t.global.colors.brushtype["U-"+player.name]=value;
    Vars.ui.showInfoToast(brushes[value],1);
  }
  //save load brush
});

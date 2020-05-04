var t=this;
this.global.colors={};
const colorcanvas = extendContent(LightBlock, "colorcanvas", {
  /*
  playerPlaced(tile){
    tile.configure(t.global.colors.brushcolor["U-"+Vars.player.name]);
  },
  */
  load(){
    this.super$load();
    this.region=Core.atlas.find(this.name);
  },
  draw(tile){
  //super.draw(tile); LightEntity entity = tile.ent(); Draw.blend(Blending.additive); Draw.color(Tmp.c1.set(entity.color), entity.efficiency() * 0.3f); Draw.rect(reg(topRegion), tile.drawx(), tile.drawy()); Draw.color(); Draw.blend();
  //Tmp.c1.set(tile.ent().color)
  //use in draw
    Draw.color(Tmp.c1.set(tile.ent().color));
    Draw.rect(this.region, tile.drawx(), tile.drawy());
    Draw.color();
  },
  minimapColor(tile){
    return tile.ent().color;
  },
  tapped(tile,player){
    switch(t.global.colors.brushtype["U-"+player.name]){
      case 0:
        tile.ent().color=t.global.colors.brushcolor["U-"+player.name];
      break;
      case 1:
        tile.ent().color=-1;
      break;
    }
  },
  configured(tile, player, value){
    //tile.ent().color = value;
    tile.ent().color=value;
    if(!Vars.headless){
      Vars.renderer.minimap.update(tile);
    }
  },
  placed(tile){
    this.super$placed(tile);
    tile.ent().color=-1;
  },
  drawLight(tile){
    //
  },
  buildConfiguration(tile,table){
    //
  },
  playerPlaced(tile){
    //
  }
  //save load brush
});
colorcanvas.hasPower=false;
colorcanvas.configurable=false;
/*
colorcanvas.entityType=prov(() => extendContent(LightBlock.LightEntity , colorcanvas , {
}));
*/

var t=this;
this.global.colors={};
const colorcanvas = extendContent(Block, "colorcanvas", {
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
    Draw.color(Tmp.c1.set(tile.ent().getcolor()));
    Draw.rect(this.region, tile.drawx(), tile.drawy());
    Draw.color();
  },
  minimapColor(tile){
    return tile.ent().getcolor();
  },
  tapped(tile,player){
    tile.ent().setcolor(t.global.colors.brushcolor["U-"+player]);
  },
  configured(tile, player, value){
    //tile.ent().color = value;
    tile.ent().setcolor(value);
  },
  placed(tile){
    this.super$placed(tile);
    tile.ent().color=-1;
  }
  //save load brush
});

colorcanvas.entityType=LightBlock.LightEntity;

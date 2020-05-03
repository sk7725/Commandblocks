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
  }
  //save load brush
});

colorcanvas.entityType=prov(() => extendContent(TileEntity , colorcanvas , {
  config(){
    return this._color;
  },
  write(stream){
    this.super$write(stream);
    stream.writeShort(this._color);
  },
  read(stream,revision){
    this.super$read(stream,revision);
    this._color=stream.readShort();
  },
  _color:-1,
  getcolor(){
    return this._color;
  },
  setcolor(item){
    this._color=item;
  }
}));

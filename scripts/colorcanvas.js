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
    this.topRegion=Core.atlas.find(this.name+"-top");
  },
  draw(tile){
  //super.draw(tile); LightEntity entity = tile.ent(); Draw.blend(Blending.additive); Draw.color(Tmp.c1.set(entity.color), entity.efficiency() * 0.3f); Draw.rect(reg(topRegion), tile.drawx(), tile.drawy()); Draw.color(); Draw.blend();
  //Tmp.c1.set(tile.ent().color)
  //use in draw
    this.super$draw(tile);
    Draw.color(Tmp.c1.set(t.global.colors.brushcolor["U-"+Vars.player.name]));
    Draw.rect(this.topRegion, tile.drawx(), tile.drawy());
    Draw.color();
  },
  buildConfiguration(tile, table){
    //var entity = tile.ent();
    //js-fy this at home
    table.addImageButton(Icon.pick, run(() => {
      Vars.ui.picker.show(Tmp.c1.set(t.global.colors.brushcolor["U-"+Vars.player.name]), true, cons(res => {
        tile.configure(res.rgba());
      }));
      Vars.control.input.frag.config.hideConfig();
    })).size(40);
  },
  configured(tile, player, value){
    //tile.ent().color = value;
    t.global.colors.brushcolor["U-"+player.name]=value;
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
  _color:0,
  getcolor(){
    return this._color;
  },
  setcolor(item){
    this._color=item;
  }
}));

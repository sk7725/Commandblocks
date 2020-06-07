const zetacolor=Color.valueOf("82ffe8");
const wallzetalarge = extendContent(Door, "wallzetalarge", {
 load(){
  this.super$load();
  this.region = Core.atlas.find(this.name);
 },
 draw(tile){
  Draw.shader(Shaders.blockbuild, true);
  Shaders.blockbuild.color = zetacolor;
  Shaders.blockbuild.region = this.region;
  Shaders.blockbuild.progress = tile.ent().scaled(tile.ent().open);
  Draw.rect(this.region, tile.drawx(), tile.drawy(), 0);
  Draw.flush();
  Draw.shader();
 },
 update(tile){
  var entity = tile.ent();
  if(entity.open && entity.cons.valid()){
   tile.block().tapped(tile, null);
  }
  else if((!entity.open) && (!entity.cons.valid())){
   tile.block().tapped(tile, null);
  }
 },
 tapped(tile, player){
  if(player != null){
   return;
  }
  this.super$tapped(tile, player);
 }
});

wallzetalarge.entityType=prov(() => extendContent(Door.DoorEntity , wallzetalarge , {
  _scale:0,
  scaled(a){
    this._scale = Mathf.lerpDelta(this._scale, (a)?0:1, 0.05);
    return this._scale;
  }
}));

wallzetalarge.openfx=Fx.none;
wallzetalarge.closefx=Fx.none;

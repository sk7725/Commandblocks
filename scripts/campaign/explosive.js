const presstick=140; const timerid=0;
const explosive = extendContent(Block, "explosive", {
  placed(tile) {
    this.super$placed(tile);
    tile.ent().timer.reset(timerid,presstick+1);
  },
  draw(tile) {
    this.super$draw(tile);
    if(tile.ent().fuse() && tile.ent().timer.getTime(timerid)%45<22.5) Draw.rect(this.topRegion, tile.drawx(), tile.drawy());
  },
  tapped(tile,player){
    tile.ent().timer.reset(timerid, 0);
    tile.ent().lit();
    //Sounds.click.at(tile.worldx(),tile.worldy());
  },
  update(tile){
    if(tile.ent().fuse()) this.updateFuse(tile);
    else if(tile.ent().cons.valid()){
      tile.ent().timer.reset(timerid, 0);
      tile.ent().lit();
    }
  },
  updateFuse(tile){
  },
  load(){
    this.super$load();
    this.topRegion = Core.atlas.find(this.name + "-top");
  }
});

explosive.entityType=prov(() => extend(TileEntity, {
  _trig:false,
  fuse(){
    return this._trig;
  },
  lit(){
    this._trig = true;
  },
  write(stream){
    this.super$write(stream);
    stream.writeBoolean(this._trig);
  },
  read(stream,revision){
    this.super$read(stream,revision);
    this._trig=stream.readBoolean();
  }
}));

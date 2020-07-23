const presstick=2; const timerid=0;
const ballid = 1; const balltick = 8;
const accel = extendContent(Block, "accel", {
  placed(tile) {
    this.super$placed(tile);
    tile.ent().timer.reset(timerid,presstick+1);
    tile.ent().setPos((tile.rotation()%2==0)?tile.x:tile.y);
  },
  draw(tile) {
    //Draw.rect(Core.atlas.find(this.name + ((tile.ent().timer.check(timerid,presstick)) ? "":"-trig")), tile.drawx(), tile.drawy());
    Draw.rect(this.baseRegion[tile.rotation()%2], tile.drawx(), tile.drawy());
    if(tile.rotation()%2==0) Draw.rect(this.topRegion, tile.drawx() + Math.max(0, (balltick-tile.ent().timer.getTime(ballid))/3*tile.ent().getLast()), tile.drawy());
    else Draw.rect(this.topRegion, tile.drawx(), tile.drawy() + Math.max(0, (balltick-tile.ent().timer.getTime(ballid))/3*tile.ent().getLast()));
  },

  /*
  tapped(tile,player){
    tile.ent().timer.reset(timerid,0);
    Sounds.click.at(tile.worldx(),tile.worldy());
  },*/
  update(tile){
    if(tile.ent().checkPos((tile.rotation()%2==0)?tile.x:tile.y)){
      //Sounds.click.at(tile.worldx(),tile.worldy(),1.4);
      tile.ent().timer.reset(timerid,0);
      tile.ent().timer.reset(ballid,0);
      tile.ent().setPos((tile.rotation()%2==0)?tile.x:tile.y);
    }
  },
  getPowerProduction(tile){
    return (tile.ent().timer.check(timerid,presstick)) ? 0: 6;
  },
  load(){
    this.super$load();
    this.topRegion = Core.atlas.find(this.name + "-top");
    this.baseRegion = [];
    for(var i=0;i<4;i++) this.baseRegion.push(Core.atlas.find(this.name+"-"+i));
  }
});

accel.entityType = prov(() => extend(TileEntity , {
  _pos:0,
  _lastmove:1,
  checkPos(p){
    if(p != this._pos) this._lastmove = (p-this._pos>0)?1:-1;
    return p == this._pos;
  },
  setPos(p) {
    this._pos = p;
  },
  getLast(){
    return this._lastmove;
  },
  write(stream) {
    this.super$write(stream);
    stream.writeShort(this._pos);
  },
  read(stream, revision) {
    this.super$read(stream, revision);
    this.setPos(stream.readShort());
  }
}));

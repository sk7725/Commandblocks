const loader=extendContent(Block, "loader",{
  canYeet(tile, other, item){
    if(other == null || other.ent() == null || !other.block().hasItems || !other.block().unloadable) return false;
    if(other.ent().items.get(item) < other.block().getMaximumAccepted(other, item) || ((other.block() instanceof CoreBlock) && other.ent().items.get(item) < other.ent().storageCapacity)) return true;
    return false;
  },
  yeetItem(tile, other, item){
    if(!this.canYeet(tile, other, item)) return;
    other.block().handleItem(item, other, tile);
  },
  handleItem(item, tile, source){
    this.yeetItem(tile, tile.front(), item);
  },
  acceptItem(item, tile, source){
    return this.canYeet(tile, tile.front(), item);
  },
  acceptStack(item, amount, tile, source){
    return 0;
  },
  draw(tile){
    Draw.rect(this.region, tile.drawx(), tile.drawy());
    Draw.rect(this.topRegion, tile.drawx(), tile.drawy(), tile.rotation()*90);
  },
  load(){
    this.super$load();
    this.region = Core.atlas.find(this.name);
    this.topRegion = Core.atlas.find(this.name+"-top");
  }
});

/*
loader.entityType=prov(() => extendContent(Router.RouterEntity , loader , {
  write(stream){
    this.super$write(stream);
    stream.writeBoolean(this._connected);
    stream.writeInt(this._telepos);
  },
  read(stream,revision){
    this.super$read(stream,revision);
    this._connected=stream.readBoolean();
    this._telepos=stream.readInt();
  },
  _telepos:0,
  _connected:false,
  getConf(){
    return this._telepos;
  },
  getConnected(){
    return this._connected;
  },
  setConf(a,tile){
    this._telepos=a;
    this._rx=Pos.x(a)-tile.x;
    this._ry=Pos.y(a)-tile.y;
  },
  setConnected(a){
    this._connected=a;
  },
  getColor(){
    return this._color;
  },
  setColor(a){
    this._color=a;
  },
  _color:white,
  _rx:0,
  _ry:0,
  config(){
    if(!this._connected) return 0;
    //var pos=this.tile.pos();
    //return Pos.get(Pos.x(this._telepos)-Pos.x(this._thispos)+this.tile.x,Pos.y(this._telepos)-Pos.y(this._thispos)+this.tile.y);
    return Pos.get(this.tile.x+this._rx,this.tile.y+this._ry);
  }
}));
*/

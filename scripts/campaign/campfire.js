const customfx = this.global.fx;
const fireitem = ["copper", "plastanium", "surge-alloy", "lead", "pyratite", "silicon", "commandblocks-ore-scalar", "commandblocks-ore-vector", "commandblocks-ore-zeta", "commandblocks-piece-code", "scrap", "commandblocks-bittrium"];
const firecolor = [Color.valueOf("66ffbf"), Pal.plastanium, Pal.surge, Color.valueOf("c2fcff"), Pal.lightPyraFlame, Color.white, Color.valueOf("f5ddf3"), Color.valueOf("cfddff"), Color.valueOf("82ffe8"), Color.valueOf("5eff79"), Color.valueOf("ff4a80"), Color.valueOf("00ffff")];

const campfire=extendContent(Block, "campfire",{
  draw(tile){
    Draw.rect(this.region, tile.drawx(), tile.drawy());
    if(!tile.ent().cons.valid()) return;
    var amount = Mathf.floorPositive(tile.ent().items.total()/15);
    if(amount>2) amount = 2;
    Draw.rect(this.topRegion[amount], tile.drawx(), tile.drawy(), tile.rotation()*90);
  },
  load(){
    this.super$load();
    this.region = Core.atlas.find(this.name);
    this.topRegion = [];
    for(var i=0;i<3;i++){
      this.topRegion.push(Core.atlas.find(this.name+"-top"+i));
    }
    this.color1 = Pal.lightFlame;
    this.color2 = Pal.darkFlame;
  },
  configured(tile, player, value){
    if(value != 1 || tile.ent().items.total() <= 0) return;
    var item = tile.ent().items.first();
    tile.ent().items.remove(item, 1);
  },
  update(tile){
    if(tile.ent().items.total() <= 0) return;

    this.color1 = Pal.lightFlame;
    this.color2 = Pal.darkFlame;
    var index = fireitem.indexOf(tile.ent().items.first().name);
    if(index > -1){
      this.color1 = firecolor[index];
      this.color2 = firecolor[index].cpy().mul(0.55, 0.5, 0.5, 1);
    }
    Effects.effect(customfx.campfire, this.color1, tile.drawx(), tile.drawy(), 0, this.color2);

    if(!Vars.net.client()&&Mathf.chance(0.005)) tile.configure(1);
  },
  shouldActiveSound(tile){
    return tile.ent().items.total()>0;
  },
  drawLight(tile){
    if(tile.ent().items.total() <= 0) return;
    this.color1 = Pal.lightFlame;
    var index = fireitem.indexOf(tile.ent().items.first().name);
    if(index > -1){
      this.color1 = firecolor[index];
    }
    Vars.renderer.lights.add(tile.drawx(), tile.drawy(), 400, Tmp.c1.set(this.color1), (tile.ent().items.total()>0)?Mathf.random()*0.3+0.7:0);
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

const customfx = this.global.fx;
const fireitem = ["copper", "plastanium", "surge-alloy", "lead", "pyratite", "silicon", "commandblocks-ore-scalar", "commandblocks-ore-vector", "commandblocks-ore-zeta", "commandblocks-piece-code", "scrap", "commandblocks-bittrium", "commandblocks-log-binary", "commandblocks-log-redblack", "sand", "mindblow-zinc"];
const firecolor = [Color.valueOf("66ffbf"), Pal.plastanium, Pal.surge, Color.valueOf("c2fcff"), Pal.lightPyraFlame, Color.white, Color.valueOf("f5ddf3"), Color.valueOf("cfddff"), Color.valueOf("82ffe8"), Color.valueOf("5eff79"), Color.valueOf("ff4a80"), Color.valueOf("00ffff"), Color.valueOf("ffff77"), Color.valueOf("ff4444"), Color.clear, Color.valueOf("b3ffe4")];
const firecolorBit = Color.valueOf("ff00ff");

const campfire=extendContent(Block, "campfire",{
  draw(tile){
    Draw.rect(this.region, tile.drawx(), tile.drawy());
    if(tile.ent().items.total() <= 0) return;
    var amount = Math.min(Mathf.floorPositive(tile.ent().items.total()/15), 2);
    Draw.rect(this.topRegion[amount], tile.drawx(), tile.drawy(), tile.rotation()*90);

    if(!Vars.state.is(GameState.State.paused)) this.spawnFire(tile);
  },
  spawnFire(tile){

    this.color1 = Pal.lightFlame;
    this.color2 = Pal.darkFlame;
    var index = fireitem.indexOf(tile.ent().items.first().name);
    if(index > -1){
      this.color1 = firecolor[index];
      this.color2 = (index == 4)?Pal.darkPyraFlame:((index == 11)?firecolorBit:firecolor[index].cpy().mul(0.7, 0.65, 0.65, 1));
    }
    Effects.effect(customfx.campfire, this.color1, tile.drawx(), tile.drawy(), 0, this.color2);
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
  update(tile){
    if((!Vars.net.active() || Vars.net.server()) && Mathf.chance(0.005)){
		var items = tile.ent().items;
		if(items.total() > 0){
			items.remove(items.first(), 1);
		}
	}
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
    Vars.renderer.lights.add(tile.drawx(), tile.drawy(), 170+10*Mathf.random(), this.color1, (tile.ent().items.total()>0)?0.9:0);
  }
});
campfire.sync = true;

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

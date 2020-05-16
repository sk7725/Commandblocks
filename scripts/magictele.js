const presstick=10; const timerid=0;
const bitcolor1=Color.valueOf("00e5ff");
const bitcolor2=Color.valueOf("ff65db");
const lasercolor=Color.valueOf("333333"); const white=Color.valueOf("ffffff");
const bitcolorspeed=0.01;
const magictele=extendContent(Router,"magictele",{
  handleItem(item,tile, source){
    if(!tile.ent().getConnected()) this.super$handleItem(item,tile,source);
    else{
      var other=Vars.world.tile(tile.ent().getConf());
      if(other.block().acceptItem(item,other,tile)){
        other.block().handleItem(item,other,tile);
        tile.ent().timer.reset(timerid,0);
        tile.ent().setColor(item.color);
      }
      else{
        this.super$handleItem(item,tile,source);
      }
    }
  },
  setBars(){
    this.super$setBars();
  //initialize
  //this.bars.remove("liquid");
    this.bars.remove("items");
  },
  buildConfiguration(tile, table){
    //hm
  },
  configured(tile, player, value){
    var other=Vars.world.tile(value);
    if(tile==other) tile.ent().setConnected(false);
    else if(tile.ent().getConf()==other.pos()&&tile.ent().getConnected()) tile.ent().setConnected(false);
    else if(other.block().hasItems){
      tile.ent().setConf(value);
      tile.ent().setConnected(true);
    }
  },
  onConfigureTileTapped(tile,other){
    if(tile==other){
      tile.configure(other.pos());
      return false;
    }
    else if(other.block().hasItems){
      tile.configure(other.pos());
      return false;
    }
    else return true;
  },
  drawConfigure(tile){
    this.super$drawConfigure(tile);
    if(!tile.ent().getConnected()) return;
    var other=Vars.world.tile(tile.ent().getConf());
    Draw.color(Pal.place);
    Lines.square(other.drawx(), other.drawy(),other.block().size * Vars.tilesize / 2 + 1);
    Draw.color();
  },
  draw(tile){
    this.super$draw(tile);
    //print("Lerp:"+(Math.sin(Time.time()*bitcolorspeed)+1)/2);
    Draw.color(bitcolor1,bitcolor2,(Mathf.sin(Time.time()*bitcolorspeed)+1)/2);
    Draw.rect(this.animRegion, tile.drawx(), tile.drawy());
    Draw.color();
  },
  load(){
    this.super$load();
    this.region=Core.atlas.find(this.name);
    this.animRegion=Core.atlas.find(this.name+"-anim");
  },
  drawLaser(tile,target){
    var opacityPercentage = Core.settings.getInt("lasersopacity");
    if(opacityPercentage == 0) return;
    var opacity = opacityPercentage / 100;

    var x1 = tile.drawx(); var y1 = tile.drawy();
    var x2 = target.drawx(); var y2 = target.drawy();

    var angle1 = Angles.angle(x1, y1, x2, y2);
    this.t1.trns(angle1, tile.block().size * Vars.tilesize / 2 - 1.5);
    this.t2.trns(angle1 + 180, target.block().size * Vars.tilesize / 2 - 1.5);

    x1 += this.t1.x;
    y1 += this.t1.y;
    x2 += this.t2.x;
    y2 += this.t2.y;

    //float fract = 1f - tile.entity.power.graph.getSatisfaction();
    var nowtick=tile.ent().timer.getTime(timerid);
    Draw.color(tile.ent().getColor(), lasercolor, (nowtick>=presstick)?1:nowtick/presstick);
    Draw.alpha(opacity);
    Drawf.laser(this.laser, this.laserEnd, x1, y1, x2, y2, 0.25);
    Draw.color();
  },
  drawLayer(tile){
    if(Core.settings.getInt("lasersopacity") == 0) return;
    if(!tile.ent().getConnected()) return;
    var link=Vars.world.tile(tile.ent().getConf());
    if(link!=null){
      this.drawLaser(tile, link);
      Draw.reset();
    }
  }
});

magictele.entityType=prov(() => extendContent(Router.RouterEntity , magictele , {
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
  setConf(a){
    this._telepos=a;
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
  _color:white
}));

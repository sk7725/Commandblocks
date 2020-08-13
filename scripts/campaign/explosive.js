const presstick=140; const timerid=0;
const customfx = this.global.fx;
const newSounds = this.global.newSounds;
const explosive = extendContent(Block, "explosive", {
  placed(tile){
    this.super$placed(tile);
    tile.ent().timer.reset(timerid,presstick+1);
  },
  draw(tile){
    this.super$draw(tile);
    if(tile.ent().fuse() && tile.ent().timer.getTime(timerid)%45<22.5) Draw.rect(this.topRegion, tile.drawx(), tile.drawy());
  },
  tapped(tile, player){
    if(!tile.ent() || tile.ent().fuse()) return;
    tile.ent().timer.reset(timerid, 0);
    tile.ent().lit();
    //try{
    newSounds.tntfuse.at(tile.worldx(),tile.worldy());
    //}catch(err){print(err);}
  },
  update(tile){
    if(!tile.ent()) return;
    if(tile.ent().fuse()) this.updateFuse(tile);
    else if(tile.ent().cons.valid() || tile.floor().attributes.get(Attribute.heat)>0.01){
      newSounds.tntfuse.at(tile.worldx(),tile.worldy());
      tile.ent().timer.reset(timerid, 0);
      tile.ent().lit();
    }
  },
  updateFuse(tile){
    if(Mathf.chance(0.08)) Effects.effect(customfx.smokeRise, tile.drawx(), tile.drawy());
    var left = presstick - tile.ent().timer.getTime(timerid);
    if(left<=0){
      //this.onDestroyed(tile);
      tile.ent().kill();
      return;
    }
  },
  mineTile(tile, other, dist){
    var drops = other.drop();
    if(this.tier < drops.hardness) return;
    var amount = 1.5+(this.tier-drops.hardness)*0.6;
    amount *= (3-dist)/3;
    if(amount <= 0) return;
    amount *= 3.3*Mathf.random()+1.1;
    var acceptTile = Units.findAllyTile(tile.getTeam(), tile.worldx(), tile.worldy(), 80, boolf(e=>(e.block().itemCapacity > 5 && !(e.block() instanceof Conveyor) && e.block().acceptItem(drops, e, tile))));
    if(acceptTile == null) return;
    //um
    Call.transferItemTo(drops, amount, other.worldx(), other.worldy(), acceptTile.getTile());
  },
  onDestroyed(tile){
    this.super$onDestroyed(tile);
    if(!Vars.net.client()){
      for(var i=-2;i<=2;i++){
        for(var j=-2;j<=2;j++){
          var other = Vars.world.tile(tile.x+i, tile.y+j);
          if(other!=null && other.drop()!=null) this.mineTile(tile, other, Math.abs(i)+Math.abs(j));
        }
      }
    }
    if(Vars.state.rules.reactorExplosions){
      Damage.damage(tile.worldx(), tile.worldy(), 4*Vars.tilesize, 600);
    }
  },
  load(){
    this.super$load();
    this.topRegion = Core.atlas.find(this.name + "-top");
    this.tier = 6;//this doesnt make it to setStats
  },
  setStats(){
    this.super$setStats();

    //const tier = this.tier;
    //const minTier = this.minTier;
    const statTable = new StatValue({
      display(table){
        var list = Vars.content.blocks().select(boolf(b => b.isFloor() && b.asFloor().itemDrop != null && b.asFloor().itemDrop.hardness <= 6)).toArray();

        table.table(cons(l => {
          l.left();
          for(var i = 0; i < list.length; i++){
            var item = list[i];
            l.addImage(item.icon(Cicon.small)).size(8 * 3).padRight(2).padLeft(2).padTop(3).padBottom(3);
            l.add(item.localizedName).left().padLeft(1).padRight(4);
            if(i % 5 == 4){
                l.row();
            }
          }
        }));
      }
    });

    this.stats.add(BlockStat.drillTier, statTable);
  },
  drawSelect(tile){
    if(Vars.player.getTeam() == tile.getTeam()) return;
    Drawf.dashCircle(tile.drawx(), tile.drawy(), 4*Vars.tilesize, tile.getTeam().color);
  },
  drawPlace(x, y, rotation, valid){
    Drawf.dashCircle(x * Vars.tilesize + this.offset(), y * Vars.tilesize + this.offset(), 4*Vars.tilesize, Pal.placing);
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

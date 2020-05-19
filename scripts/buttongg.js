const presstick=4; const timerid=0;
const explosionRadius = 40;
const explosionDamage=1350;
const buttongg = extendContent(Block, "buttongg", {
  placed(tile) {
    this.super$placed(tile);
    tile.ent().timer.reset(timerid,presstick+1);
  },
  draw(tile) {
    this.super$draw(tile);
    if(tile.ent().timer.check(timerid,presstick)) Draw.rect(this.topRegion,tile.drawx(), tile.drawy());
    //Draw.rect(Core.atlas.find(this.name + ((tile.ent().timer.check(timerid,presstick)) ? "":"-trig")), tile.drawx(), tile.drawy());
  },
  tapped(tile,player){
    if(!((!Vars.net.active())||player.isAdmin)) return;
    tile.ent().timer.reset(timerid,0);
    Sounds.corexplode.at(tile.worldx(),tile.worldy());
    this.boom(tile,Vars.playerGroup.all().random());
  },
  boom(tile,player){
    try{
      var x=player.x; var y=player.y;
      Sounds.explosionbig.at(x,y);
      Effects.shake(6, 16, x, y);
      Effects.effect(Fx.nuclearShockwave, x, y);
      Damage.damage(x, y, explosionRadius * Vars.tilesize, explosionDamage * 4);
      if(Vars.net.active()&&Vars.player==player) Vars.net.disconnect();
    }
    catch(err){}
  },
  load(){
    this.super$load();
    this.topRegion=Core.atlas.find(this.name+"-top");
  }
/*
  update(tile){
    if(tile.ent().timer.getTime(timerid)==presstick) Sounds.click.at(tile.worldx(),tile.worldy(),0.8);
  }
*/
});

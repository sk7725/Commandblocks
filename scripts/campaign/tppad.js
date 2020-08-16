const newSounds = this.global.newSounds;

const tppad = extendContent(Block, "tppad", {
  tapped(tile, player){
    if(this.checkValidTap(tile, player)){
      tile.configure(1);
    }else if(player.isLocal && Vars.mobile && !player.isDead() && tile.ent().cons.valid()){
      //deselect on double taps
      player.moveTarget = (player.moveTarget == tile.ent()) ? null : tile.ent();
    }
  },
  configured(tile, player, value){
    if(value != 1) return;
    if(player == null || tile == null || tile.block()!=this || !this.checkValidTap(tile, player)) return;
    if(!tile.ent().cons.valid()) return;
    this.tpPlayer(tile, player);
  },
  checkValidTap(tile, player){
    return !player.isDead() && tile.interactable(player.getTeam()) && Math.abs(player.x - tile.drawx()) <= tile.block().size * Vars.tilesize && Math.abs(player.y - tile.drawy()) <= tile.block().size * Vars.tilesize && tile.ent().cons.valid();
  },
  tpPlayer(tile, player){
    var arr = tile.ent().power.links.toArray();//list of pos

    arr = arr.filter(pos => Vars.world.tile(pos).block().name == "commandblocks-tppad");
    arr.push(tile.pos());
    arr.sort(function(a, b) {
      return a - b;
    });
    var index = arr.indexOf(tile.pos());
    if(index < 0){
      print("Err: parent pad not in link!");
      print(arr);
      return;
    }
    index++;
    if(index >= arr.length) index = 0;
    var etile = Vars.world.tile(arr[index]);
    player.set(etile.drawx(), etile.drawy());
    if(player == Vars.player) Core.camera.position.set(player);
    Effects.effect(Fx.teleportActivate, Pal.lancerLaser, etile.drawx(), etile.drawy());
    Effects.effect(Fx.teleportOut, Pal.lancerLaser, tile.drawx(), tile.drawy());
    newSounds.teleport.at(tile.drawx(), tile.drawy());
    newSounds.teleport.at(etile.drawx(), etile.drawy());
  },
  draw(tile){
    this.super$draw(tile);
    if(!tile.ent().cons.valid()) return;
    Draw.color(Pal.lancerLaser, Color.white, Mathf.sin(Time.time()*0.01));
    Draw.alpha(Mathf.sin(Time.time()*0.05)*0.5+0.5);
    Draw.rect(this.topRegion, tile.drawx(), tile.drawy());
    Draw.color();
  },
  drawSelect(tile){
    Draw.color(Pal.accent);
    var length = Vars.tilesize * this.size / 2 + 3 + Mathf.absin(Time.time(), 5, 2);

    Draw.rect(this.arrowRegion, tile.drawx() + length, tile.drawy(), (0 + 2) * 90);
    Draw.rect(this.arrowRegion, tile.drawx(), tile.drawy() + length, (1 + 2) * 90);
    Draw.rect(this.arrowRegion, tile.drawx() + -1 * length, tile.drawy(), (2 + 2) * 90);
    Draw.rect(this.arrowRegion, tile.drawx(), tile.drawy() + -1 * length, (3 + 2) * 90);

    Draw.color();
  },
  load(){
    this.super$load();
    this.topRegion = Core.atlas.find(this.name + "-top");
    this.arrowRegion = Core.atlas.find("transfer-arrow");
  }
});

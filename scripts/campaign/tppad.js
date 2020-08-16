
const tppad = extendContent(Block, "tppad", {
  tapped(tile, player){
    const entity = tile.ent();
    const other = Vars.world.tile(entity.link);
    if(this.linkValid(tile, other) && entity.power.status > 0.5 && !player.isDead() && other != null && other.entity != null && entity.getchargeProgress() <= 0){
      if(player.dst(tile) > this.size * Vars.tilesize / 2 + 12){
        player.moveTarget = player.moveTarget == tile.entity ? null : tile.entity;
      }
      else{
        entity.setchargeProgress(Mathf.dst(tile.drawx(), tile.drawy(),other.drawx(), other.drawy()) / 3);
        entity.setconAble(1);
        player.set(other.drawx(),other.drawy());
        if(player == Vars.player) Core.camera.position.set(player);
        Time.run(2 , run(() => {
          Sounds.respawn.at(other);
          Sounds.respawn.at(tile);
          Effects.effect(Fx.spawn, other);
          Effects.effect(Fx.spawn, tile);
        }))
    	}
    }
  }
}

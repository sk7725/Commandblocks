const shader=this.shaders.bittrium;

const magicwall=extendContent(Wall,"magicwall",{
    draw(tile){
      Draw.shader(shader);
      Draw.rect(this.animRegion, tile.drawx(), tile.drawy());
	    Draw.shader();
    },
    load(){
      this.super$load();
      this.region=Core.atlas.find(this.name);
      this.animRegion=Core.atlas.find(this.name+"-anim");
    },
    handleDamage(tile,amount){
      return 1.0;
    },
    handleBulletHit(entity,bullet){
      entity.damage(1.0);
    }
});

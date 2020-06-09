const shader=this.global.shaders.space;
const bhol=this.global.bullets.blackholeSmall;

const wallspace=extendContent(Wall,"wallspace",{
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
  onDestroyed(tile){
    Bullet.create(bhol, null, tile.getTeam(), tile.drawx(), tile.drawy(), 0, 1, 1);
  }
});

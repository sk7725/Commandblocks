const shader=this.global.shaders.time;

const walltime=extendContent(Wall,"walltime",{
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
    for(i = 0;i<361;i++){
      Calls.createBullet(darknessbullet, tile.getTeam(), tile.drawx(), tile.drawy(), (i*-1)+360, Mathf.random(0.5, 1.0), Mathf.random(0.2, 1.0));
    }
  }
});

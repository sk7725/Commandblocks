const shader=this.global.shaders.glitch;

const glitch = extendContent(Block, "glitch", {
  draw(tile){
    Draw.shader(shader);
    Draw.rect(this.region, tile.drawx(), tile.drawy());
    Draw.shader();
  },
  isHidden(){
    return !Vars.state.isEditor();
  },
  unlockedCur(){
    return false;
  }
});

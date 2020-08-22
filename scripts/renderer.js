this.global.shieldList = [];
var t = this;

importPackage(Packages.arc.graphics.gl);
const shieldBuffer = new FrameBuffer(2, 2);

const shieldRenderer = extend(Table, {
  draw(){
    const prev = Draw.scl;
    Draw.scl = 1;
    const length = t.global.shieldList.length;
    if(Core.settings.getBool("animatedshields") && Shaders.shield != null){
      if(!Core.graphics.isHidden() && (shieldBuffer.getWidth() != Core.graphics.getWidth() || shieldBuffer.getHeight() != Core.graphics.getHeight())){
          shieldBuffer.resize(Core.graphics.getWidth(), Core.graphics.getHeight());
      }

      Draw.flush();
      shieldBuffer.begin();
      Core.graphics.clear(Color.clear);

      this.drawEach("drawShield");
      this.drawEach("drawOver");

      Draw.flush();
      shieldBuffer.end();
      Draw.shader(Shaders.shield);
      Draw.color(Pal.accent);
      Draw.rect(Draw.wrap(shieldBuffer.getTexture()), Core.camera.position.x, Core.camera.position.y, Core.camera.width, -Core.camera.height);
      Draw.color();
      Draw.shader();
    }
    else{
      this.drawEach("drawSimple");
    }

    t.global.shieldList = [];
    Draw.scl = prev;
  },
  drawEach(funcname){
    for(var i=0; i<length; i++){
      var e = t.global.shieldList[i];
      if(e instanceof Bullet) e.getBulletType()[funcname](e);
      else e[funcname]();
    }
  }
});

if(!this.global.shieldSetup){
  this.global.shieldSetup = true;

  Events.on(EventType.ClientLoadEvent, run(e => {
    //const t = new Table();
    const t = shieldRenderer;
    t.setFillParent(true);
    //t.addImage(shieldRenderer);
    t.visible(boolp(() => !Vars.state.is(GameState.State.menu)));

    Vars.ui.hudGroup.addChildAt(0, t);
  }));
}

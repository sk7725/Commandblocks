this.global.shieldList = [];
var t = this;
if(!Vars.headless){
  importPackage(Packages.arc.graphics.gl);
  const shieldBuffer = new FrameBuffer(2, 2);

  const shieldRenderer = extend(Table, {
    draw(){
      const length = t.global.shieldList.length;
      if(length <= 0) return;
      //const prev = Draw.scl;
      const prev = new Mat(Draw.proj());
      //Draw.scl = 1;
      Draw.proj(Core.camera.projection());

      if(Core.settings.getBool("animatedshields") && Shaders.shield != null){
        if(!Core.graphics.isHidden() && (shieldBuffer.getWidth() != Core.graphics.getWidth() || shieldBuffer.getHeight() != Core.graphics.getHeight())){
            shieldBuffer.resize(Core.graphics.getWidth(), Core.graphics.getHeight());
        }

        Draw.flush();
        shieldBuffer.begin();
        Core.graphics.clear(Color.clear);

        this.drawEach("drawShield", length);
        this.drawEach("drawShieldOver", length);

        Draw.flush();
        shieldBuffer.end();
        Draw.shader(Shaders.shield);
        Draw.color(Pal.accent);
        Draw.rect(Draw.wrap(shieldBuffer.getTexture()), Core.camera.position.x, Core.camera.position.y, Core.camera.width, -Core.camera.height);
        Draw.color();
        Draw.shader();
      }
      else{
        this.drawEach("drawSimple", length);
      }

      t.global.shieldList = [];
      //Draw.scl = prev;
      Draw.proj(prev);
    },
    drawEach(funcname, length){
      for(var i=0; i<length; i++){
        var e = t.global.shieldList[i];
        if(e instanceof Bullet) e.getBulletType()[funcname](e);
        else e[funcname]();
      }
    }
  });
  shieldRenderer.setFillParent(true);
  shieldRenderer.visible(boolp(() => !Vars.state.is(GameState.State.menu)));

  if(!this.global.shieldSetup){
    this.global.shieldSetup = true;

    Events.on(EventType.ClientLoadEvent, run(e => {
      print("Loading Renderer!");
      //const t = new Table();
      //const t = shieldRenderer;
      //t.setFillParent(true);
      //t.addImage(shieldRenderer);
      //t.visible(boolp(() => !Vars.state.is(GameState.State.menu)));

      Vars.ui.hudGroup.addChildAt(0, shieldRenderer);
    }));
  }

  if(Vars.ui.hudGroup){
    Core.app.post(run(() => {
      print("Loading Renderer!");
      Vars.ui.hudGroup.addChildAt(0, shieldRenderer);
    }));
  }
}

var t=this;
this.global.colors={};
const colorcanvas = extendContent(LightBlock, "colorcanvas", {
  /*
  playerPlaced(tile){
    tile.configure(t.global.colors.brushcolor["U-"+Vars.player.name]);
  },
  */
  load(){
    this.super$load();
    this.region=Core.atlas.find(this.name);
  },
  draw(tile){
  //super.draw(tile); LightEntity entity = tile.ent(); Draw.blend(Blending.additive); Draw.color(Tmp.c1.set(entity.color), entity.efficiency() * 0.3f); Draw.rect(reg(topRegion), tile.drawx(), tile.drawy()); Draw.color(); Draw.blend();
  //Tmp.c1.set(tile.ent().color)
  //use in draw
    Draw.color(Tmp.c1.set(tile.ent().color));
    Draw.rect(this.region, tile.drawx(), tile.drawy());
    Draw.color();
  },
  minimapColor(tile){
    return tile.ent().color;
  },
  trycolor(tile,color){
    if(tile.block()!=this){
      print("Color:failed");
      return;
    }
    try{
      tile.ent().color=color;
    }
    catch(err){
      print("Color:"+err);
    }
  },
  tapped(tile,player){
    switch(t.global.colors.brushtype["U-"+player.name]){
      case 0:
        tile.ent().color=t.global.colors.brushcolor["U-"+player.name];
      break;
      case 1:
        tile.ent().color=-1;
      break;
      case 2:
        tile.ent().color=t.global.colors.brushcolor["U-"+player.name];
        this.trycolor(Vars.world.tile(tile.x  ,tile.y+1),tile.ent().color);
        this.trycolor(Vars.world.tile(tile.x+1,tile.y  ),tile.ent().color);
        this.trycolor(Vars.world.tile(tile.x  ,tile.y-1),tile.ent().color);
        this.trycolor(Vars.world.tile(tile.x-1,tile.y  ),tile.ent().color);
      break;
      case 7:
        t.global.colors.brushcolor["U-"+player.name]=tile.ent().color;
      break;
    }
  },
  configured(tile, player, value){
    //tile.ent().color = value;
    tile.ent().color=value;
    if(!Vars.headless){
      Vars.renderer.minimap.update(tile);
    }
  },
  placed(tile){
    this.super$placed(tile);
    tile.ent().color=-1;
  },
  drawLight(tile){
    //
  },
  buildConfiguration(tile,table){
    //
  },
  playerPlaced(tile){
    //
  },
  drawRequestRegion(req,list){
    var reg = this.icon(Cicon.full);
    Draw.color(Tmp.c1.set(req.config));
    Draw.rect(this.icon(Cicon.full), req.drawx(), req.drawy(),reg.getWidth() * req.animScale * Draw.scl,reg.getHeight() * req.animScale * Draw.scl,0);
    Draw.color();
  }
  //save load brush
});
colorcanvas.hasPower=false;
colorcanvas.configurable=false;
/*
colorcanvas.entityType=prov(() => extendContent(LightBlock.LightEntity , colorcanvas , {
}));
*/

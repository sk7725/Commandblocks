var t=this;
this.global.colors={};//put it in colorcanvas later
this.global.colors.brushcolor=Colors.valueOf("000000").rgba();
const colorpicker = extendContent(Block, "colorpicker", {
  playerPlaced(tile){
    tile.configure(t.global.colors.brushcolor); 
  },
  load(){
  },
  draw(tile){ 
  //super.draw(tile); LightEntity entity = tile.ent(); Draw.blend(Blending.additive); Draw.color(Tmp.c1.set(entity.color), entity.efficiency() * 0.3f); Draw.rect(reg(topRegion), tile.drawx(), tile.drawy()); Draw.color(); Draw.blend(); 
  //Tmp.c1.set(tile.ent().color)
  //use in draw
  },
  buildConfiguration(tile, table){
    //var entity = tile.ent(); 
    //js-fy this at home
    table.addImageButton(Icon.pencil, run(() => { 
      Vars.ui.picker.show(Tmp.c1.set(t.global.colors.brushcolor), true, cons(res => { 
        t.global.colors.brushcolor = res.rgba(); 
      })); 
      Vars.control.input.frag.config.hideConfig(); 
    })).size(40); 
  },
  configured(tile, player, value){
    //tile.ent().color = value;
    t.global.colors.brushcolor=value;
  }
  //save load brush
});

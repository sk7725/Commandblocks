var t=this;
t.global.armorstanda=100;

const armorstandmodder = extendContent(MessageBlock, "armorstandmodder", {
  buildConfiguration(tile, table){
		var myslider=table.addSlider(0,100,1,t.global.armorstanda,null).width(240).get();
		myslider.changed(run(() => {

			Call.setMessageBlockText(null,tile,myslider.getValue()+"");
			t.global.armorstanda=myslider.getValue();
		}));
		//update말고 changed도?
	},
  placed(tile) {
		this.super$placed(tile);
    Call.setMessageBlockText(null,tile,"100");
	},
  drawSelect(tile){
    this.drawPlaceText(tile.ent().message,tile.x,tile.y,true);
  },
  updateTableAlign(tile,table){
    var pos = Core.input.mouseScreen(tile.drawx(), tile.drawy() - tile.block().size * Vars.tilesize / 2 - 1);
    table.setPosition(pos.x, pos.y, Align.top);
  },
  update(tile){
    var n=Number(tile.ent().message);
    if(n!=t.global.armorstanda){
      t.global.armorstanda=n;
    }
  }
});

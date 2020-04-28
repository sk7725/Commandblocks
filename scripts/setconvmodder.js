

var t=this;
const resetspeed=1;
const speedmul=1;

t.global.setconvload=false;
t.global.setconvspeed=resetspeed;

const setconvmodder = extendContent(MessageBlock, "setconvmodder", {
  buildConfiguration(tile, table){
    this.super$buildConfiguration(tile,table);
		table.addImageButton(Icon.undo, Styles.clearTransi, run(() => {

			this.setMessageBlockText(null,tile,resetspeed+"");
      t.global.setconvspeed=resetspeed;
      t.global.setconvload=true;
		})).size(40);
	},
  placed(tile) {
		this.super$placed(tile);
    this.setMessageBlockText(null,tile,resetspeed+"");
    var instnum=this.getinst(tile);
    t.global.setconvspeed=resetspeed;
    t.global.setconvload=true;
	},
  update(tile){
    if(!t.global.setconvload){
      var n=Number(tile.ent().message);
      t.global.setconvspeed=n;
      t.global.setconvload=true;
    }
  },
  draw(tile){
    var i=(Time.time() * t.global.setconvspeed * 8.0 * speedmul) % 4;
    Draw.rect(Core.atlas.find("setconv-0-"+i), tile.drawx(), tile.drawy());
    Draw.rect(Core.atlas.find(this.name + "-top"), tile.drawx(), tile.drawy());
  }
});



var t=this;
const resetspeed=0.2;
const speedmul=1;

t.global.setconvload=false;
t.global.setconvspeed=resetspeed;

const setconvmodder = extendContent(MessageBlock, "setconvmodder", {
  buildConfiguration(tile, table){
    this.super$buildConfiguration(tile,table);
		table.addImageButton(Icon.undo, run(() => {

			this.setMessageBlockText(null,tile,resetspeed+"");
      t.global.setconvspeed=resetspeed;
      t.global.setconvload=true;
		})).size(40);
	},
  placed(tile) {
		this.super$placed(tile);
    this.setMessageBlockText(null,tile,resetspeed+"");
    t.global.setconvspeed=resetspeed;
    t.global.setconvload=true;
	},
  update(tile){
    var n=Number(tile.ent().message);
    if(!t.global.setconvload){
      t.global.setconvspeed=n;
      t.global.setconvload=true;
    }
    if(t.global.setconvspeed!=n) t.global.setconvspeed=n;
  },
  draw(tile){
    var i=Math.floor(Time.time() * t.global.setconvspeed * 8.0 * speedmul) % 4;
    print("setconv-0-"+i);
    Draw.rect(Core.atlas.find("setconv-0-"+i), tile.drawx(), tile.drawy());
    Draw.rect(Core.atlas.find(this.name + "-top"), tile.drawx(), tile.drawy());
  }
});

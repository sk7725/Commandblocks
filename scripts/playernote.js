var noteblocks={};
const notes=["A3","AS3","B3"];
const instruments=["piano"];
const notelength=notes.length;

const soundwave = newEffect(20, e => {
  color(e.color);
  stroke(e.fout() + 0.4);
  Lines.circle(e.x, e.y, 2.0 + e.fin() * 4.0);
});

const playernote = extendContent(Block, "playernote", {
  init(){
    this.super$init();
		//tile.didcmd = false;
	},
  buildConfiguration(tile, table){
		table.addImageButton(Icon.up, Styles.clearTransi, run(() => {
			// Tell client to spin faster
			tile.configure(1);
		})).size(40);
		table.row();
		table.addImageButton(Icon.down, Styles.clearTransi, run(() => {
			// Tell client to spin slower
			tile.configure(-1);
		})).size(40);
	},
	configured(tile, player, value){
		if(value != -1&&value!=0){
			value = 1;
		}
    noteblocks[key].n+=value;
    if(noteblocks[key].n>=notelength) noteblocks[key].n=0;
    else if(noteblocks[key]<0) noteblocks[key].n=notelength-1;
    Vars.ui.showInfoToast(notes[noteblocks[key].n],5);
		//this.itSpin += value;
	},
  playnote(tile,notein,instrument){
    //play&fx
    var ncolor="ffffff";
    Effects.effect(soundwave,Color.valueOf(ncolor),tile.worldx(),tile.worldy());
  },
  placed(tile) {
		this.super$placed(tile);
    var key=tile.x+","+tile.y;
    noteblocks[key]={};
    noteblocks[key].p=false;
    noteblocks[key].n=0;
	},
  removed(tile){
		this.super$removed(tile);
		//var entity=tile.ent();
		var key=tile.x+","+tile.y;
		if(noteblocks.hasOwnProperty(key)){
			delete noteblocks[key];
		}
	},
  update(tile){
    var entity=tile.ent();
    var near = Vars.world.tile(tile.x,tile.y-1).block();
    var key=tile.x+","+tile.y;
    var nblock=noteblocks[key];
    if(tile.entity.cons.valid()){
      this.super$update(tile);
      if(!nblock.p){
        noteblocks[key].p=true;
        var instrument=0;
        if(near=="copperWall") instrument=1;
        this.playnote(tile,nblock.n,instrument);
      }
    }
    else if(nblock.p) noteblocks[key].p=false;
  }
});

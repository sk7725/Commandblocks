var noteblocks={};
const notes=["A","AS","B","C","CS","D","DS","E","F","FS","G","GS"];
const instruments=["piano"];
const notelength=36;

const soundwave = newEffect(20, e => {
  Draw.color(e.color);
  Lines.stroke(e.fout() + 0.4);
  Lines.circle(e.x, e.y, 2.0 + e.fin() * 4.0);
});

const playernote = extendContent(Block, "playernote", {
  init(){
    this.super$init();
		//tile.didcmd = false;
	},
  buildConfiguration(tile, table){
		table.addImageButton(Icon.upOpen, Styles.clearTransi, run(() => {
			
			tile.configure(1)
		})).size(40);
		table.addImageButton(Icon.downOpen, Styles.clearTransi, run(() => {
			
			tile.configure(-1)
		})).size(40);
	},
	configured(tile,player, value){
		//if(value != -1&&value!=0){
		//	value = 1;
		//}
    var key=tile.x+","+tile.y;
    noteblocks[key].n+=value;
    if(noteblocks[key].n>=notelength) noteblocks[key].n=0;
    else if(noteblocks[key].n<0) noteblocks[key].n=notelength-1;
    Vars.ui.showInfoToast((Math.floor((noteblocks[key].n+9)/12)+4)+""+notes[noteblocks[key].n %12],5);
    this.playnote(tile,noteblocks[key].n);
	},
  playnote(tile,notein){
    //play&fx
    var near = Vars.world.tile(tile.x,tile.y-1).block();
    var ncolor="aaaa00";//tmp
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
    
    var key=tile.x+","+tile.y;
    var nblock=noteblocks[key];
    if(tile.entity.cons.valid()){
      this.super$update(tile);
      if(!nblock.p){
        noteblocks[key].p=true;
        //var instrument=0;
        //if(near=="copperWall") instrument=1;
        this.playnote(tile,nblock.n);
      }
    }
    else if(nblock.p) noteblocks[key].p=false;
  }
});

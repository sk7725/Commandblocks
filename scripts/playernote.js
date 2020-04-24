var noteblocks={};
const notes=["A3","AS3","B3"];
const notelength=notes.length;
const playernote = extendContent(Block, "playernote", {
  init(){
    this.super$init();
		//tile.didcmd = false;
	},
  buildConfiguration(tile, table){
		table.addImageButton(Icon.arrowUpSmall, Styles.clearTransi, run(() => {
			// Tell client to spin faster
			tile.configure(1);
		})).size(40);
		table.row();
		table.addImageButton(Icon.arrowDownSmall, Styles.clearTransi, run(() => {
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
  playnote(tile,notein){
    //play&fx
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
    var near = Vars.world.tile(tile.x,tile.y-1);
    var key=tile.x+","+tile.y;
    var nblock=noteblocks[key];
    if(tile.entity.cons.valid()){
      this.super$update(tile);
      if(!nblock.p){
        noteblocks[key].p=true;
        this.playnote(tile,nblock.n);
      }
    }
    else if(nblock.p) noteblocks[key].p=false;
    /*
    var key=tile.x+","+tile.y;
    if(!commandblocksi.hasOwnProperty(key)) commandblocksi[key]={};
    thiscmd=commandblocksi[key];
    if(!thiscmd.hasOwnProperty("didcmd")) thiscmd.didcmd=false;
    if(tile.entity.cons.valid()){
      this.super$update(tile);
      //entity.cons.trigger();
      if(!thiscmd.didcmd){
        var res=commandblocksi.command(tile,entity.message,this,entity.message,false);
        thiscmd.didsuccess = Boolean(res);
        thiscmd.didcmd = true;
      }
      else{
        thiscmd.didsuccess=false;
      }
    }
    else{
      if(thiscmd.didcmd) thiscmd.didcmd=false;
      thiscmd.didsuccess=false;
      return;
    }
  },
  removed(tile){
    this.super$removed(tile);
    var key=tile.x+","+tile.y;
    delete commandblocksi[key];
  }
  */
});

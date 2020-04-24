var noteblocks={};
const notes=["A","AS","B","C","CS","D","DS","E","F","FS","G","GS"];
const instruments=["piano"];
const notelength=36;

const soundwave = newEffect(20, e => {
  Draw.color(e.color);
  Lines.stroke(e.fout() + 0.4);
  Lines.circle(e.x, e.y, 2.0 + e.fin() * 4.0);
});

const playernote = extendContent(MessageBlock, "playernote", {
  loadkey(tile){
    var key=tile.x+","+tile.y;
    noteblocks[key]={};
    noteblocks[key].p=false;
    //noteblocks[key].n=0;
  },
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
    if(!noteblocks.hasOwnProperty(key)) this.loadkey(tile);
    var n=Number(tile.ent().message);
    n+=value;
    if(n>=notelength) n=0;
    else if(n<0) n=notelength-1;
    this.setMessageBlockText(null,tile,n+"");
    Vars.ui.showInfoToast((Math.floor((n+9)/12)+4)+""+notes[n %12],1);
    this.playnote(tile,n);
	},
  playnote(tile,notein){
    //play&fx
    var near = Vars.world.tile(tile.x,tile.y-1).block();
    var red=-1*Math.abs(250*(notein-14)/14)+250;
    var green=Math.abs(250*(notein-21)/14)-125;
    var blue=-1*Math.abs(250*(notein-28)/14)+250;
    print("colorset");print(red);print(green);print(blue);
    //try{
    Effects.effect(soundwave,Color.rgb(Math.max(Math.floor(red),0),Math.max(Math.floor(green),0),Math.max(Math.floor(blue),0)),tile.worldx(),tile.worldy());
    //}
    //catch(err){
      //print(err);
    //}
  },
  placed(tile) {
		this.super$placed(tile);
    var key=tile.x+","+tile.y;
    noteblocks[key]={};
    noteblocks[key].p=false;
    //noteblocks[key].n=0;
    this.setMessageBlockText(null,tile,"0");
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
    if(!noteblocks.hasOwnProperty(key)) this.loadkey(tile);
    var nblock=noteblocks[key];
    if(tile.entity.cons.valid()){
      this.super$update(tile);
      if(!nblock.p){
        noteblocks[key].p=true;
        //var instrument=0;
        //if(near=="copperWall") instrument=1;
        this.playnote(tile,Number(entity.message));
      }
    }
    else if(nblock.p) noteblocks[key].p=false;
  }
});

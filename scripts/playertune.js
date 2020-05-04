//var noteblocks={};
//const notes=["a","as","b","c","cs","d","ds","e","f","fs","g","gs"];
//const instruments=["piano"];
const instruments=["buttonClick","pew","message","bigshot","flame","splash","unlock","door","place","explosion","click","windowHide","laser","artillery","spray","corexplode"];
//const notelength=36;
const increment=1.0594630943592952;
const tincrement=0.01;
//const soundcontent=Sounds.pew.getContentType();
//const soundlib="sound-lib";
var t=this;
t.global.transpose=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
t.global.loadtranspose=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
const soundwave = newEffect(20, e => {
  Draw.color(e.color);
  Lines.stroke(e.fout() + 0.4);
  Lines.circle(e.x, e.y, 2.0 + e.fin() * 4.0);
});

const playertune = extendContent(MessageBlock, "playertune", {
  init(){
    this.super$init();
		//tile.didcmd = false;
	},
  buildConfiguration(tile, table){
    this.super$buildConfiguration(tile,table);
		table.addImageButton(Icon.upOpen, run(() => {

			tile.configure(1)
		})).size(40);
		table.addImageButton(Icon.downOpen, run(() => {

			tile.configure(-1)
		})).size(40);
	},
  getinst(tile){
    var near = Vars.world.tile(tile.x,tile.y-1).block().name;
    var instnum=0;
    if(near=="copper-wall") instnum=1;
    if(near=="titanium-wall") instnum=2;
    if(near=="plastanium-wall") instnum=3;
    if(near=="thorium-wall") instnum=4;
    if(near=="phase-wall") instnum=5;
    if(near=="surge-wall") instnum=6;
    if(near=="door") instnum=7;
    if(near=="router") instnum=8;
    if(near=="junction") instnum=9;
    if(near=="sorter") instnum=10;
    if(near=="mender") instnum=11;
    if(near=="shock-mine") instnum=12;
    if(near=="liquid-router") instnum=13;
    if(near=="liquid-junction") instnum=14;
    if(near=="unloader") instnum=15;
    return instnum;
  },
	configured(tile,player, value){
    var instnum=this.getinst(tile);
    var n=Number(tile.ent().message);
    n+=value;
    t.global.transpose[instnum]=n;
    t.global.loadtranspose[instnum]=1;
    Call.setMessageBlockText(null,tile,n+"");
    //Vars.ui.showInfoToast(1+n*tincrement,1);
    this.playnote(tile,n);
	},
  drawSelect(tile){
    var transval=1+Number(tile.ent().message)*tincrement;
    this.drawPlaceText(tile.ent().message+" ("+transval.toFixed(2)+")",tile.x,tile.y,true);
  },
  updateTableAlign(tile,table){
    var pos = Core.input.mouseScreen(tile.drawx(), tile.drawy() - tile.block().size * Vars.tilesize / 2 - 1);
    table.setPosition(pos.x, pos.y, Align.top);
  },
  playnote(tile,notein){
    //play&fx
    var near = Vars.world.tile(tile.x,tile.y-1).block().name;
    var red=-1*Math.abs(250*(notein-14)/14)+250;
    var green=Math.abs(250*(notein-21)/14)-125;
    var blue=-1*Math.abs(250*(notein-28)/14)+250;
    //print("colorset");print(red);print(green);print(blue);
    Effects.effect(soundwave,Color.rgb(Math.max(Math.floor(red),0),Math.max(Math.floor(green),0),Math.max(Math.floor(blue),0)),tile.worldx(),tile.worldy());
    var instnum=this.getinst(tile);

    Sounds[instruments[instnum]].at(tile.worldx(),tile.worldy(),1+tincrement*t.global.transpose[instnum]);
  },
  placed(tile) {
		this.super$placed(tile);
    Call.setMessageBlockText(null,tile,"0");
    var instnum=this.getinst(tile);
    t.global.transpose[instnum]=0;
    t.global.loadtranspose[instnum]=1;
	},
  update(tile){
    var instnum=this.getinst(tile);
    if(t.global.loadtranspose[instnum]==0){
      var n=Number(tile.ent().message);
      t.global.transpose[instnum]=n;
      t.global.loadtranspose[instnum]=1;
    }
  }
});

playertune.entityType=prov(()=>extendContent(MessageBlock.MessageBlockEntity,playertune,{
  config(){
    return this.message;
  }
}));

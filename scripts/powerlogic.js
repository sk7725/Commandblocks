const presstick=8; const timerid=0;
//var logict=[1,1,1,0];//TT TF FT FF
//abuse tables, hmm
const logict=[[1,1],[1,0],[0,1],[0,0]];
const logicg={
  "and":[1,0,0,0],
  "or":[1,1,1,0],
  "not":[0,0,1,1],
  "nor":[0,0,0,1],
  "nand":[0,1,1,1],
  "xor":[0,1,1,0],
  "arrow":[1,0,1,1]
}

const powerlogic=extendContent(MessageBlock,"powerlogic",{
    placed(tile) {
        this.super$placed(tile);
        this.setMessageBlockText(null,tile,"1 1 1 0");
    },
/*
    buildConfiguration(tile, table){
    this.super$buildConfiguration(tile,table);
		table.addImageButton(Icon.commandRally, run(() => {

		})).size(40);
    table.addImageButton(Icon.line, run(() => {

		})).size(40);
	},
*/
    logiccheck(tile,in1,in2){
      if(in1>0) in1=true;
      else in1=false;
      if(in2>0) in2=true;
      else in2=false;
      //print("LG INPUTS:"+in1+","+in2);
      var input=-1;
      if(in1&&in2) input=0;
      else if(in1&& (!in2)) input=1;
      else if(in2) input=2;
      else input=3;
      //var tmparr=[];
      //tmparr.push(in1); tmparr.push(in2);
      //var input=logict.indexOf(tmparr);
      //print("LG INPUT:"+input);
      //print("LG LIST:"+tmparr);
      var logicn=tile.ent().message.split(" ");
      //if(logicn.indexOf(input)<0) return false;
      return (Number(logicn[input])==0)?false:true;
    },
    getPowerProduction(tile){
      var tx1=0; var ty1=0; var tx2=0; var ty2=0;
      if(tile.rotation()==0){
        tx1=-1; ty1=1;
        tx2=-1; ty2=-1;
      }
      else if(tile.rotation()==1){
        tx1=-1; ty1=-1;
        tx2=1; ty2=-1;
      }
      else if(tile.rotation()==2){
        tx1=1; ty1=-1;
        tx2=1; ty2=1;
      }
      else if(tile.rotation()==3){
        tx1=1; ty1=1;
        tx2=-1; ty2=1;
      }
      var in1=Vars.world.tile(tile.x+tx1,tile.y+ty1);
      var in2=Vars.world.tile(tile.x+tx2,tile.y+ty2);
      //var in1=tile.getNearby((tile.rotation()+1)%4);
      //var in2=tile.getNearby((tile.rotation()+3)%4);
      if(!((in1.block() instanceof PowerNode)&&(in2.block() instanceof PowerNode))) return 0;
      try{
        return (this.logiccheck(tile,in1.ent().power.graph.getPowerBalance(),in2.ent().power.graph.getPowerBalance())) ? 1: 0;
      }
      catch(err){
        print("E:"+err);
        return 0;
      }
    }
    /*
    draw(tile){
      this.super$draw(tile);
      Draw.rect(Core.atlas.find(this.name+"-top"), tile.drawx(), tile.drawy());
    */ //lag concerns, was gonna use logicg
    //TODO:table, draw
})

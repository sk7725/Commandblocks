const presstick=1; const timerid=0; const loopthresh=150;
var gloops=500;//crash it if you can idk
const color1=Color.valueOf("ffaa5f"); const color2=Color.valueOf("84f491");//color of pyratite and mender
const ts=40;//table size
//var logict=[1,1,1,0];//TT TF FT FF
//abuse tables, hmm
const logict=[[1,1],[1,0],[0,1],[0,0]];
const logicg=["1-1-1-1","1-1-1-0","1-1-0-1","1-0-1-1","0-1-1-1","1-1-0-0","1-0-1-0","1-0-0-1","0-1-1-0","0-1-0-1","0-0-1-1","0-0-0-1","0-0-1-0","0-1-0-0","1-0-0-0","0-0-0-0"];
const tficon=["commandRallySmall","lineSmall"];

const powerlogic=extendContent(MessageBlock,"powerlogic",{
    placed(tile) {
        this.super$placed(tile);
        this.setMessageBlockText(null,tile,"1-1-1-0");
        tile.ent().timer.reset(timerid,presstick+1);
    },
    drawSelect(tile){
      //kill the words
    },
    updateTableAlign(tile,table){
      var pos = Core.input.mouseScreen(tile.drawx(), tile.drawy() - Vars.tilesize - tile.block().size * Vars.tilesize / 2 - 1);
      table.setPosition(pos.x, pos.y, Align.top);
    },
    buildConfiguration(tile, table){
      //this.super$buildConfiguration(tile,table);
      try{
        var args=tile.ent().message.split("-");
        table.add().size(ts);
        table.addImage(Icon.lineSmall,color1).size(ts);
        table.addImage(Icon.commandRallySmall,color1).size(ts);
        table.row();
        table.addImage(Icon.lineSmall,color2).size(ts);
        var tt=table.addImageButton(Icon[tficon[Number(args[0])]],Styles.clearTransi,ts, run(() => {
          tile.configure(16);
    		})).get();
        tt.update(run(() => {
          if(tile.block().name!=this.name) return;
          tt.replaceImage(Image(Icon[tficon[Number(tile.ent().message.charAt(0))]]));
        }));
        var tf=table.addImageButton(Icon[tficon[Number(args[1])]],Styles.clearTransi,ts, run(() => {
          tile.configure(17);
    		})).get();
        tf.update(run(() => {
          if(tile.block().name!=this.name) return;
          tf.replaceImage(Image(Icon[tficon[Number(tile.ent().message.charAt(2))]]));
        }));
        table.row();
        table.addImage(Icon.commandRallySmall,color2).size(ts);
        var ft=table.addImageButton(Icon[tficon[Number(args[2])]],Styles.clearTransi,ts, run(() => {
          tile.configure(18);
    		})).get();
        ft.update(run(() => {
          if(tile.block().name!=this.name) return;
          ft.replaceImage(Image(Icon[tficon[Number(tile.ent().message.charAt(4))]]));
        }));
        var ff=table.addImageButton(Icon[tficon[Number(args[3])]],Styles.clearTransi,ts, run(() => {
          tile.configure(19);
    		})).get();
        ff.update(run(() => {
          if(tile.block().name!=this.name) return;
          ff.replaceImage(Image(Icon[tficon[Number(tile.ent().message.charAt(6))]]));
        }));
      }
      catch(err){
        print(err);
      }
      /*
  		table.addImageButton(Icon.lineSmall, run(() => {

  		})).size(40);
      table.addImageButton(Icon.commandRallySmall, run(() => {

  		})).size(40);
      */
	 },
    logiccheck(tile,in1,in2){
      if(tile.ent().timer.getTime(timerid)<=0){
        if(gloops>loopthresh){
          Vars.ui.showInfoToast("Do not overuse!",1);
          return false;
        }
        else{
          gloops+=1;
          return tile.ent().getLastOutput();
        }
        //print("Looping:"+tile.ent().getLoops());
      }
      gloops=0;
      tile.ent().timer.reset(timerid,0);
      if(in1.getPowerProduced()-in1.getPowerNeeded()>0) in1=true;
      else in1=false;
      if(in2.getPowerProduced()-in2.getPowerNeeded()>0) in2=true;
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
      var logicn=tile.ent().message.split("-");
      //if(logicn.indexOf(input)<0) return false;
      tile.ent().setLastOutput((Number(logicn[input])==0)?false:true);
      return (Number(logicn[input])==0)?false:true;
    },
    getPowerProduction(tile){
      //if(tile.ent().message=="") this.setMessageBlockText(null,tile,"1-1-1-0");
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
      //if(!((in1.ent().hasOwnProperty("power"))&&(in2.ent().hasOwnProperty("power")))) return 0;
      try{
        if(in1.ent().power.graph.getID()==tile.ent().power.graph.getID()||in2.ent().power.graph.getID()==tile.ent().power.graph.getID()){
          Vars.ui.showInfoToast("Do not connect output with input!",1);
          return 0;
        }
        //Vars.ui.showInfoToast(this.logiccheck(tile,in1.ent().power.graph.getPowerBalance(),in2.ent().power.graph.getPowerBalance()),1);
        return (this.logiccheck(tile,in1.ent().power.graph,in2.ent().power.graph)) ? 1: 0;
      }
      catch(err){
        return 0;
      }
    },
    configured(tile,player,value){
      //if(!value) return;
      if(value>=0&&value<16) this.setMessageBlockText(null,tile,Math.floor(value/8)%2+"-"+Math.floor(value/4)%2+"-"+Math.floor(value/2)%2+"-"+Math.floor(value)%2);
      if(value>=16&&value<20){
        var args=tile.ent().message.split("-");
        args[value-16]=1-args[value-16];
        this.setMessageBlockText(null,tile,args.join("-"));
      }
    },
    drawConfigure(tile){
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
      Draw.color(color1);
      Lines.square(in1.drawx(), in1.drawy(),1 * Vars.tilesize / 2 + 1);
      Draw.color(color2);
      Lines.square(in2.drawx(), in2.drawy(),1 * Vars.tilesize / 2 + 1);
      this.super$drawConfigure(tile);
    },
    draw(tile){
      //this.super$draw(tile);
      Draw.rect(Core.atlas.find(this.name+"-base"), tile.drawx(), tile.drawy());
      Draw.rect(Core.atlas.find(this.name+"-top"), tile.drawx(), tile.drawy(),90*tile.rotation());
      Draw.rect(Core.atlas.find(this.name+"-"+tile.ent().message), tile.drawx(), tile.drawy(),90*tile.rotation());
    }
    //TODO:table, draw
});

powerlogic.entityType=prov(() => extendContent(MessageBlock.MessageBlockEntity , powerlogic , {
  config(){
    var nums=this.message.split("-");
    if(nums.length!=4 || nums[0]>1||nums[1]>1||nums[2]>1||nums[3]>1|| nums[0]<0||nums[1]<0||nums[2]<0||nums[3]<0) return 14;
    return Number(nums[0])*8+Number(nums[1])*4+Number(nums[2])*2+Number(nums[3]);
  },
  getLastOutput(){
    return this._last;
  },
  setLastOutput(a){
    this._last=a;
  },
  _loops:0,
  _last:false
}));

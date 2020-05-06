const timerid=0;
const color1="ffaa5f"; const color2="84f491";//color of pyratite and mender
const ts=40;//table size
const shadowcolor=new Color(0,0,0,0.22);
const throwstr=8;
const landframe=130;
const topchance=0.4;

const gameyoot=extendContent(MessageBlock,"gameyoot",{
    placed(tile) {
      this.super$placed(tile);
      //Call.setMessageBlockText(null,tile,color1);
      for(var i=0;i<4;i++){
        tile.ent().rollYoot(i,throwstr/4);
      }
    },
    drawSelect(tile){
      //kill the words
    },
/*
    drawConfigure(tile){
      var offset=tile.ent().getPos();
      try{Draw.color(Color.valueOf(tile.ent().message));}
      catch(err){}
      Lines.square(tile.drawx()+offset.x*Vars.tilesize, tile.drawy()+offset.y*Vars.tilesize,1 * Vars.tilesize / 2 + 1);
      this.super$drawConfigure(tile);
    },
*/
    updateTableAlign(tile,table){
      var pos = Core.input.mouseScreen(tile.drawx(), tile.drawy()  - tile.block().size * Vars.tilesize / 2 - 1);
      table.setPosition(pos.x, pos.y, Align.top);
    },
    buildConfiguration(tile, table){
      //this.super$buildConfiguration(tile,table);
      try{
        //table.add().size(ts);
        table.addImageButton(Icon.upOpen,Styles.clearTransi,ts, run(() => {
          tile.configure(1);
    	}));
/*
        table.add().size(ts);
        table.row();

        table.addImageButton(Icon.leftOpen,Styles.clearTransi,ts, run(() => {
        tile.configure(3);
        }));

        table.add().size(ts);
        table.addImageButton(Icon.rightOpen,Styles.clearTransi,ts, run(() => {
          tile.configure(1);
        }));
        table.row();

        table.add().size(ts);
        table.addImageButton(Icon.downOpen,Styles.clearTransi,ts, run(() => {
          tile.configure(4);
    	}));
        table.add().size(ts);
        table.row();
        table.addImageButton(Icon.players,run(() => {
          tile.configure(5);
        })).size(ts);
        table.addImageButton(Icon.commandRally,run(() => {
          tile.configure(0);
        })).size(ts);
        //table.row();
        //table.add().size(ts);
        //this.super$buildConfiguration(tile,table);
*/
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
    configured(tile,player,value){
      //if(!value) return;
      if(value==1){
        //roll yoot
        tile.ent().timer.reset(timerid,0);
        var res=[];
        for(var i=0;i<4;i++){
          if(Math.random()>topchance){
            //flat side
            res.push((Math.random()>0.4)?1:3);
          }
          else{
            //x side
            res.push((Math.random()>0.4)?2:0);
          }
        }
        Call.setMessageBlockText(null,tile,res.join("-"));
        for(var i=0;i<4;i++){
          tile.ent().rollYoot(i,throwstr);
        }
      }
    },
    load(){
      this.super$load();
      this.baseRegion=Core.atlas.find(this.name+"-base");
      this.animRegion=[];
      for(var i=0;i<8;i++){
        this.animRegion.push(Core.atlas.find(this.name+"-"+i));
      }
      this.animBackdoRegion=[];
      for(var i=0;i<8;i++){
        if(i>=3&&i<=5) this.animBackdoRegion.push(Core.atlas.find(this.name+"-"+i+"-1"));
        else this.animBackdoRegion.push(Core.atlas.find(this.name+"-"+i));
      }
    },
    draw(tile){
      //this.super$draw(tile);
      Draw.rect(this.baseRegion, tile.drawx(), tile.drawy());
    },
    drawYootShadow(tile,key,yoot){
      Draw.color(shadowcolor);
      Draw.rect(this.animRegion[key],tile.drawx()+yoot.x, tile.drawy()+yoot.y,yoot.rot);
      //print("DrawShad:"+tile.drawx()+yoot.x+","+tile.drawy()+yoot.y);
    },
    drawYoot(tile,key,yoot,i){
      if(i==0) Draw.rect(this.animBackdoRegion[key],tile.drawx()+yoot.x, tile.drawy()+yoot.y+yoot.h,yoot.rot);
      else Draw.rect(this.animRegion[key],tile.drawx()+yoot.x, tile.drawy()+yoot.y+yoot.h,yoot.rot);
      //print("Draw:"+tile.drawx()+yoot.x+","+tile.drawy()+yoot.y+yoot.h);
    },
    calckey(x,a,b){
      if(a==0) return 0;
      var res=0;
      if(x<0.25*b) res=(8*a*x)/(5*b);
      else if(x<0.5*b) res=(7*a*x)/(5*b)+a/20;
      else res=(a*x)/(2*b)+a/2;
      return Math.floor(res)%8;
    },
    drawLayer(tile){
      var keys=[];
      var res=tile.ent().getOutcome();
      for(var i=0;i<4;i++){
        keys.push(this.calckey((tile.ent().timer.check(timerid,landframe-2*i))?landframe-2*i:tile.ent().timer.getTime(timerid),res[i]*4,landframe-2*i))
      }
      for(var i=0;i<4;i++){
        this.drawYootShadow(tile,keys[i],tile.ent()["getYoot"+i]());
      }
      Draw.color();
      for(var i=0;i<4;i++){
        this.drawYoot(tile,keys[i],tile.ent()["getYoot"+i](),i);
      }
    },
    yootres(tile,yoots){
      var topcnt=0; var flatcnt=0;
      for(var i=0;i<4;i++){
        if(yoots[i]%2==0) topcnt++;
        else flatcnt++;
      }
      if(topcnt==4) return "mo";
      if(flatcnt==4) return "yoot";
      if(flatcnt==3) return "gul";
      if(flatcnt==2) return "gae";
      if(flatcnt==1){
        if(yoots[0]%2==1) return "backdo";
        else return "do";
      }
    },
    update(tile){
      this.super$update(tile);
      if(tile.ent().message!=""&&tile.ent().timer.check(timerid,landframe+59)){
        var outcome=tile.ent().getOutcome();
        var res=this.yootres(tile,outcome);
        print("Yootres:"+res);
        for(var i=0;i<4;i++){
          var yoot=tile.ent()["getYoot"+i];
          switch(res){
            case "mo":
              Effects.effect(Fx.teleportOut,Color.valueOf("7457ce"),tile.drawx()+yoot.x, tile.drawy()+yoot.y);
            break;
            case "yoot":
              Effects.effect(Fx.teleportOut,Color.valueOf("6ecdec"),tile.drawx()+yoot.x, tile.drawy()+yoot.y);
            break;
            case "backdo":
              if(outcome[i]%2==1) Effects.effect(Fx.teleportOut,Color.valueOf("ff795e"),tile.drawx()+yoot.x, tile.drawy()+yoot.y);
            break;
            default:
              if(outcome[i]%2==1) Effects.effect(Fx.teleportOut,Color.valueOf("ffffff"),tile.drawx()+yoot.x, tile.drawy()+yoot.y);
          }
        }
      }
      if(tile.ent().message!=""&&tile.ent().timer.check(timerid,landframe+60)) return;
      for(var i=0;i<4;i++){
        tile.ent().updateYoot(i,tile);
      }
      var message=tile.ent().message;
      if(message!=""&&message!=tile.ent().getOutcome().join("-")){
        var tmparr=message.split("-");
        tile.ent().setOutcome(tmparr);
      }
    }
});

gameyoot.entityType=prov(() => extendContent(MessageBlock.MessageBlockEntity , gameyoot , {
  _friction:0.97,
  _g:-0.1,
  _yoot0:{
    x:0,
    y:0,
    h:0,
    xv:0,
    yv:0,
    hv:0,
    rot:20
  },
  _yoot1:{
    x:0,
    y:0,
    h:0,
    xv:0,
    yv:0,
    hv:0,
    rot:-45
  },
  _yoot2:{
    x:0,
    y:0,
    h:0,
    xv:0,
    yv:0,
    hv:0,
    rot:80
  },
  _yoot3:{
    x:0,
    y:0,
    h:0,
    xv:0,
    yv:0,
    hv:0,
    rot:-75
  },
  getYoot0(){
    return this._yoot0;
  },
  getYoot1(){
    return this._yoot1;
  },
  getYoot2(){
    return this._yoot2;
  },
  getYoot3(){
    return this._yoot3;
  },
  updateYoot(i,tile){
    var yoot=this["_yoot"+i];
    yoot.x+=yoot.xv; yoot.y+=yoot.yv;
    yoot.xv*=this._friction; yoot.yv*=this._friction;
    if(yoot.h>0||yoot.hv>0){ yoot.h+=yoot.hv; yoot.hv+=this._g; }
    if(yoot.h<0){
      yoot.h=0;
      if(yoot.hv<-1) yoot.hv*=-0.3;
      if(yoot.hv>0) Sounds.artillery.at(tile.worldx()+yoot.x,tile.worldy()+yoot.y,10);
    }
  },
  rollYoot(i,str){
    var yoot=this["_yoot"+i];
    yoot.hv=str*0.5*(Math.random()+0.5);
    yoot.h=0;
    yoot.x=0; yoot.y=0;
    yoot.xv=str*(Math.random()*2-1)*0.35;
    yoot.yv=str*(Math.random()*2-1)*0.35;
    yoot.rot=Math.random()*360;
  },
  _outcomes:[0,0,0,0],
  setOutcome(a){
    this._outcomes=a
  },
  getOutcome(){
    return this._outcomes;
  }
}));

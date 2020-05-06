
const color1="ffaa5f"; const color2="84f491";//color of pyratite and mender
const ts=40;//table size
const shadowcolor=new Color(0,0,0,0.22);
const throwstr=8;
const landframe=200;
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
    drawYoot(tile,key,yoot){
      Draw.rect(this.animRegion[key],tile.drawx()+yoot.x, tile.drawy()+yoot.y+yoot.h,yoot.rot);
      //print("Draw:"+tile.drawx()+yoot.x+","+tile.drawy()+yoot.y+yoot.h);
    },
    drawLayer(tile){
      for(var i=0;i<4;i++){
        this.drawYootShadow(tile,0,tile.ent()["getYoot"+i]());
      }
      Draw.color();
      for(var i=0;i<4;i++){
        this.drawYoot(tile,0,tile.ent()["getYoot"+i]());
      }
    },
    update(tile){
      this.super$update(tile);
      for(var i=0;i<4;i++){
        tile.ent().updateYoot(i,tile);
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
    rot:20,
  },
  _yoot1:{
    x:0,
    y:0,
    h:0,
    xv:0,
    yv:0,
    hv:0,
    rot:-45,
  },
  _yoot2:{
    x:0,
    y:0,
    h:0,
    xv:0,
    yv:0,
    hv:0,
    rot:80,
  },
  _yoot3:{
    x:0,
    y:0,
    h:0,
    xv:0,
    yv:0,
    hv:0,
    rot:-75,
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
  }
}));

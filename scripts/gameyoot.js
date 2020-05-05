
const color1="ffaa5f"; const color2="84f491";//color of pyratite and mender
const ts=40;//table size
const shadowcolor=new Color(0,0,0,0.71);
const throwstr=25;
const landframe=95;
const topchance=0.4;

const gameyoot=extendContent(MessageBlock,"gameyoot",{
    placed(tile) {
        this.super$placed(tile);
        //Call.setMessageBlockText(null,tile,color1);
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
      var offset=tile.ent().getPos();
      Draw.rect(this.baseRegion, tile.drawx(), tile.drawy());
    },
    drawYootShadow(tile,yoot){
    
    },
    drawYoot(tile,key,yoot){
      
    },
    drawLayer(tile){
      for(var i=0;i<4;i++){
        this.drawYootShadow(tile,tile.ent()["getYoot"+i]());
      }
      for(var i=0;i<4;i++){
        this.drawYoot(tile,tile.ent().message,tile.ent()["getYoot"+i]());
      }
    },
    update(tile){
      this.super$update(tile);
      for(var i=0;i<4;i++){
        tile.ent().updateYoot(i);
      }
    }
});

gameyoot.entityType=prov(() => extendContent(MessageBlock.MessageBlockEntity , gameyoot , {
  _friction:0.98,
  _g:-0.5,
  _yoot0:{
    x:0,
    y:0,
    h:0,
    xv:10,
    yv:2,
    hv:45,
    rot:20,
  },
  _yoot1:{
    x:0,
    y:0,
    h:0,
    xv:5,
    yv:-10,
    hv:50,
    rot:-45,
  },
  _yoot2:{
    x:0,
    y:0,
    h:0,
    xv:-6,
    yv:4,
    hv:55,
    rot:80,
  },
  _yoot3:{
    x:0,
    y:0,
    h:0,
    xv:-9,
    yv:-1,
    hv:45,
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
  updateYoot(i){
    var yoot=this["_yoot"+i];
    yoot.x+=yoot.xv; yoot.y+=yoot.yv;
    yoot.xv*=this._friction; yoot.yv*=this._friction;
    if(yoot.h>0){ yoot.h-=yoot.hv; yoot.hv-=this._g; }
    if(yoot.h<0) yoot.h=0;
  }
}));

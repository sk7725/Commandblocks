//crash it if you can idk
const color1=Color.valueOf("ffaa5f"); const color2=Color.valueOf("84f491");//color of pyratite and mender
const ts=40;//table size
//var logict=[1,1,1,0];//TT TF FT FF
//abuse tables, hmm
const playermover=extendContent(MessageBlock,"playermover",{
    placed(tile) {
        this.super$placed(tile);
        Call.setMessageBlockText(null,tile,"ffaa5f");
    },
    drawSelect(tile){
      //kill the words
    },
    /
    updateTableAlign(tile,table){
      var pos = Core.input.mouseScreen(tile.drawx(), tile.drawy()  - tile.block().size * Vars.tilesize / 2 - 1);
      table.setPosition(pos.x, pos.y, Align.top);
    },
    buildConfiguration(tile, table){
      //this.super$buildConfiguration(tile,table);
      try{
        table.add().size(ts);
        table.addImageButton(Icon.upOpen,Styles.clearTransi,ts, run(() => {
          tile.configure(0);
    		}));
        table.add().size(ts);
        table.row();

        table.addImageButton(Icon.leftOpen,Styles.clearTransi,ts, run(() => {
        tile.configure(1);
        }));

        table.add().size(ts);
        table.addImageButton(Icon.rightOpen,Styles.clearTransi,ts, run(() => {
          tile.configure(2);
        }));
        table.row();

        table.add().size(ts);
        table.addImageButton(Icon.downOpen,Styles.clearTransi,ts, run(() => {
          tile.configure(3);
    		}));
        table.add().size(ts);
        table.row();
        table.row();
        table.add().size(ts);
        this.super$buildConfiguration(tile,table);
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
      if(value==0) tile.ent().movePos(0,1);
      if(value==1) tile.ent().movePos(-1,0);
      if(value==2) tile.ent().movePos(1,0);
      if(value==3) tile.ent().movePos(0,-1);
    },
    load(){
      this.super$load();
      this.baseRegion=Core.atlas.find(this.name+"-base");
      this.topRegion=Core.atlas.find(this.name+"-top");
    },
    /*drawConfigure(tile){
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
    },*/
    draw(tile){
      //this.super$draw(tile);
      var offset=tile.ent().getPos();
      Draw.rect(this.baseRegion, tile.drawx(), tile.drawy());
      try{Draw.color(Color.valueOf(tile.ent().message));}
      catch(err){}
      Draw.rect(this.topRegion, tile.drawx()+offset.x*Vars.tilesize, tile.drawy()+offset.y*Vars.tilesize);
      Draw.color();
      //Draw.rect(Core.atlas.find(this.name+"-"+tile.ent().message), tile.drawx(), tile.drawy(),90*tile.rotation());
    }
    //TODO:table, draw
});

playermover.entityType=prov(() => extendContent(MessageBlock.MessageBlockEntity , playermover , {
  getPos(){
    return Vec2(this._px,this._py);
  },
  setPos(x,y){
    this._px=x;
    this._py=y;
  },
  movePos(dx,dy){
    this._px+=dx;
    this._py+=dy;
  },
  _px:0,
  _py:0
}));

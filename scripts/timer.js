const timerid=0; const pulseid=1; const maxPulse=360;
//(pulse - getTime)/pulse*360 pulse/maxpulse*360
const timer=extendContent(PowerBlock,"timer",{
    buildConfiguration(tile,table){
        var entity=tile.ent();
        table.addImageButton(Icon.pencil, run(() => {
          try{
            if (Vars.mobile) {

              // Mobile and desktop version have different dialogs
              const input = new Input.TextInput();
              input.text = entity.getPulse();
              input.multiline = false;
              input.numeric = true;
              input.accepted = cons(text => tile.configure(text));

              Core.input.getTextInput(input);
            } else {
              // Create dialog
              const dialog = new FloatingDialog(Core.bundle.get("editmessage"));
              dialog.setFillParent(false);

              // Add text area to dialog
              const textArea = new TextArea(entity.getPulse());
              dialog.cont.add(textArea).size(380, 160);

              // Add "ok" button to dialog
              dialog.buttons.addButton("$ok", run(() => {
                  tile.configure(textArea.getText());
                  dialog.hide();
              }));

              // Show it
              dialog.show();
            }
          }
          catch(err){
            print("err:"+err);
          }
        })).size(40);

        //table.row();
        var myslider=table.addSlider(1,maxPulse,1,entity.getPulse(),null).width(240).get();
        //myslider.setStyle(Styles.vSlider);
        //myslider.width(240);
        myslider.changed(run(() => {
          tile.configure(myslider.getValue());
          if(!Vars.headless) Vars.ui.showInfoToast(myslider.getValue(),0);
        }));//this needs its other half
    },
  configured(tile, player, value){
    if(value<=0||value>maxPulse) return;
    tile.ent().setPulse(value);
    //I use tile.configure to sync
    //oh rite the armored conveyors are broken in multi mybe
    //fuck you printer
  },
  getPowerProduction(tile){
    if(tile.ent().timer.getTime(timerid)<=0) return (tile.ent().getLastOutput())?1:0;
    tile.ent().timer.reset(timerid,0);
    var res=tile.ent().timer.get(pulseid,tile.ent().getPulse());
    tile.ent().setLastOutput(res);
    return (res)?1:0;
  },
  load(){
    this.super$load();
    this.baseRegion=Core.atlas.find(this.name+"-base");
    this.topRegion=Core.atlas.find(this.name+"-needle");
    this.needleRegion=Core.atlas.find(this.name+"-needle-pulse");
  },
  draw(tile){
    Draw.rect(this.baseRegion, tile.drawx(), tile.drawy());
    Draw.rect(this.needleRegion, tile.drawx(), tile.drawy(),(tile.ent().getPulse()-tile.ent().timer.getTime(pulseid))/tile.ent().getPulse() * 360);
    Draw.rect(this.topRegion, tile.drawx(), tile.drawy(),(360-tile.ent().getPulse())%360);
  },
});

timer.entityType=prov(() => extend(TileEntity, {
  _pulse:60,
  config(){
    return this._pulse;
    //saves pulse in schems
  },
  getPulse(){
    return this._pulse;
  },
  setPulse(a){
    this._pulse = a;
  },
  write(stream){
    this.super$write(stream);
    stream.writeShort(this._pulse);
  },
  read(stream,revision){
    this.super$read(stream,revision);
    this._pulse=stream.readShort();
  },
  getLastOutput(){
    return this._last;
  },
  setLastOutput(a){
    this._last=a;
  },
  _last:false
}));

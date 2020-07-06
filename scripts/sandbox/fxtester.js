const customfx = this.global.fx;

const fxtester=extendContent(Block,"fxtester",{
  load(){
    this.super$load();
  },
  draw(tile){
    this.super$draw(tile);
    if(tile.ent().getErr()!=""){
      this.drawPlaceText(tile.ent().getErr(),tile.x,tile.y,false);
    }
  },
  buildConfiguration(tile, table){
    //this.super$buildConfiguration(tile, table);
    const entity = tile.ent();
    // Add buttons
    table.addImageButton(Icon.pencil, Styles.clearTransi, run(() => {
        if (Vars.mobile) {
            // Mobile and desktop version have different dialogs
            try{
              const input = new Input.TextInput();
              input.text = entity.getText();
              input.multiline = true;
              input.accepted = cons(text => entity.setText(text));

              Core.input.getTextInput(input);
            }
            catch(err){
              print(err);
            }

        } else {
            // Create dialog
            const dialog = new FloatingDialog("Table");
            dialog.setFillParent(false);

            // Add text area to dialog
            const textArea = new TextArea(entity.getText());
            dialog.cont.add(textArea).size(380, 160);

            // Add "ok" button to dialog
            dialog.buttons.addButton("$ok", run(() => {
                entity.setText(textArea.getText());
                dialog.hide();
            }));

            // Show it
            dialog.show();
        }
    })).size(40);
    const lb = table.addImageButton((tile.ent().getLong())?Icon.commandRally:Icon.commandRallySmall, Styles.clearTransi, run(() => {
      tile.ent().trigLong();
      lb.replaceImage((tile.ent().getLong())?Icon.commandRally:Icon.commandRallySmall);
    })).get();
    lb.size(40);
    table.addImageButton(Icon.star, Styles.clearTransi, run(() => {
      tile.ent().setErr("");
      var tmpobj = {};
      tmpobj.text = tile.ent().getText();
      tmpobj.parent = tile.ent();
      Effects.effect((tile.ent().getLong())?customfx.evalfxLong:customfx.evalfx, Color.white, tile.worldx(), tile.worldy(), 0, tmpobj);
    })).size(40);
  }
});

//shadertester.maxTextLength=1300;
//shadertester.maxNewlines=50;
fxtester.entityType = prov(() => extend(TileEntity , {
  _text:"Lines.stroke(e.fout());\nLines.circle(e.x, e.y, 16);\nLines.lineAngle(e.x, e.y, e.fout()*1080, 13);\nLines.lineAngle(e.x, e.y, e.fout()*360, 5);\nLines.spikes(e.x, e.y, 14, 1, 12, 0);",
  _err:"",
  //_repeat:false,
  _long:false,
  getText() {
    return this._text;
  },
  setText(text) {
    this._text = text;
  },
  /*
  getRepeat() {
    return this._repeat;
  },
  trigRepeat() {
    this._repeat = !this._repeat;
  },*/
  getLong() {
    return this._long;
  },
  trigLong() {
    this._long = !this._long;
  },
  getErr() {
    return this._err;
  },
  setErr(text) {
    this._err = text;
  },
  write(stream) {
    this.super$write(stream);
    stream.writeUTF(this.getText());
    //stream.writeBoolean(this.getRepeat());
    stream.writeBoolean(this.getLong());
  },
  read(stream, revision) {
    this.super$read(stream, revision);
    this.setText(stream.readUTF());
    //this._repeat = stream.readBoolean();
    this._long = stream.readBoolean();
  }
}));

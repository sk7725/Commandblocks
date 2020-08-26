var t = this;
const jstester=extendContent(Block,"jstester",{
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
            const dialog = new FloatingDialog("JS");
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
    table.addImageButton(Icon.star, Styles.clearTransi, run(() => {
      tile.ent().setErr("");
      try{
        eval(tile.ent().getText());
      }
      catch(err){
        tile.ent().setErr(err);
      }
    })).size(40);
  },
  shouldShowConfigure(tile, player){
    return (!Vars.net.active())&&this.super$shouldShowConfigure(tile, player); 
  }
});

//shadertester.maxTextLength=1300;
//shadertester.maxNewlines=50;
jstester.entityType = prov(() => extend(TileEntity , {
  _text:"print('You have better things to do.');",
  _err:"",
  getText() {
    return this._text;
  },
  setText(text) {
    this._text = text;
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
  },
  read(stream, revision) {
    this.super$read(stream, revision);
    this.setText(stream.readUTF());
  }
}));

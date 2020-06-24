const tabletester=extendContent(Block,"tabletester",{
  dialog: null,
  load(){
    this.super$load();
    this.dialog = new FloatingDialog("Dialog");
		this.dialog.addCloseButton();
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
    table.addImageButton(Icon.star, Styles.clearTransi, run(() => {
      tile.ent().setErr("");
      try{
        this.dialog.cont.clear();
        var cont = this.dialog.cont;
        eval(tile.ent().getText());
        this.dialog.show();
      }
      catch(err){
        tile.ent().setErr(err);
      }
    })).size(40);
  }
});

//by Summet

//shadertester.maxTextLength=1300;
//shadertester.maxNewlines=50;
tabletester.entityType = prov(() => extend(TileEntity , {
  _text:"cont.table(cons(table=>{\ntable.setBackground(TextureRegionDrawable(Core.atlas.find('router')));\n}));",
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

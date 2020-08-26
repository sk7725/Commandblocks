var t = this;
const drawtester=extendContent(Block,"drawtester",{
  draw(tile){
    try{
      eval(tile.ent().getText());
    }
    catch(err){
      this.drawPlaceText(err,tile.x,tile.y,false);
      Draw.rect(this.region, tile.drawx(), tile.drawy());
    }
  },
  load(){
    this.super$load();
    this.region=Core.atlas.find(this.name);
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
            const dialog = new FloatingDialog("Draw");
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
  },
  shouldShowConfigure(tile, player){
    return (!Vars.net.active())&&this.super$shouldShowConfigure(tile, player); 
  }
});

//shadertester.maxTextLength=1300;
//shadertester.maxNewlines=50;
drawtester.entityType = prov(() => extend(TileEntity , {
  _text:"Draw.blend(Blending.additive);\nDraw.color(Pal.accent);\nDraw.rect('router', tile.drawx(), tile.drawy());\nDraw.blend();\nDraw.color();",
  getText() {
    return this._text;
  },
  setText(text) {
    this._text = text;
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

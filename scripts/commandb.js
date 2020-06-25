const commandb = extendContent(MessageBlock, "commandb", {
  dialog: null,
  placed(tile) {
    this.super$placed(tile);
  },
  shouldShowConfigure(tile, player){
    return (!Vars.net.active())||player.isAdmin;
  },
  canPlaceOn(tile){
    return ((!Vars.net.active())||player.isAdmin)&&this.super$canPlaceOn(tile);
	},
	canBreak(tile){
		return((!Vars.net.active())||player.isAdmin)&&this.super$canBreak(tile);
	},
  handleDamage(tile,amount){
    return 0;
  },
  handleBulletHit(entity,bullet){
    entity.damage(0);
  },
  /*
  draw(tile) {

  },
  */
  load(){
    this.super$load();
    this.dialog = new FloatingDialog(Core.bundle.get("command.title"));
    this.cmdRegion = [];
  },
  buildConfiguration(tile, table){
    table.addImageButton(Icon.pencil, Styles.clearTransi, run(() => {
      this.dialog.cont.clear();
      try{
        this.setupDialog(tile, this.dialog);
      }
      catch(err){
        print(err);
      }
      this.dialog.show();
    }));
  },
  setupDialog(tile, dialog){
    var cont = dialog.cont;
    var textarea = new TextArea(tile.ent().message.replace(/\n/g, "\r"));
    textarea.setMessageText(Core.bundle.get("command.command.textbox"));

    var error = tile.ent().getErr();

    cont.pane(cons(table => {
      table.margin(10).top();
      table.add(Core.bundle.get("command.command.name")).growX().left().color(Pal.accent);
      table.row();
      table.addImage().growX().height(3).pad(6).color(Pal.accent);
      table.row();

      const ta = table.add(textarea).height(200).growX().pad(6).get();
      if(Vars.mobile){
        ta.tapped(run(() => {
          const input = new Input.TextInput();
          input.text = textarea.getText().replace(/\r/g, "\n");
          input.multiline = true;
          input.accepted = cons(tx => textarea.setText(tx.replace(/\n/g, "\r")));
          Core.input.getTextInput(input);
        }));
      }
      ta.accepted = cons(tx => {

      });
      table.row();

      if(error!=""){
        table.labelWrap("[scarlet]E: "+error+"[]").growX().padLeft(19);
        table.row();
      }

      table.table(cons(r => {
        r.right();
        r.addImageButton(Icon.paste, Styles.defaulti, run(()=>{
          Core.app.setClipboardText((Vars.mobile)?textarea.getText().replace(/\r/g,"\n"):textarea.getText());
        })).size(40);

        if(error!=""){
          Styles.defaulti.imageUpColor = Color.red;
          r.addImageButton(Icon.paste, run(()=>{
            Core.app.setClipboardText(error);
          })).size(40).padLeft(5);
          Styles.defaulti.imageUpColor = Color.white;
        }
      })).growX();
      table.row();

      table.add(Core.bundle.get("command.options.name")).growX().left().color(Pal.accent);
      table.row();
      table.addImage().growX().height(3).pad(6).color(Pal.accent);
      table.row();

      const boolc = method => new Boolc(){get : method};
      const boolp = method => new Boolp(){get : method};

      table.table(cons(r => {
        r.left();
        r.add(Core.bundle.get("command.options.type")).left().padRight(5).pad(6);
        r.addImageButton(TextureRegionDrawable(Core.atlas.find("commandblocks-commandblock")), run(() => {
          //
        }));
        r.row();
      })).growX();
      table.row();

      table.table(cons(r => {
        r.addCheck(Core.bundle.get("command.options.needspower"),boolc(c=>{})).checked(boolp(()=>tile.ent().getPower()).get()).pad(6).growX().get().left();
        r.row();
      })).growX();
      table.row();

      table.table(cons(r => {
        r.addCheck(Core.bundle.get("command.options.conditional"),boolc(c=>{})).checked(boolp(()=>tile.ent().getCond()).get()).pad(6).growX().get().left();
        r.row();
      })).growX();
      table.row();

      table.table(cons(t => {
        t.left();
        t.add(Core.bundle.get("command.options.delay")).left().padRight(5).pad(6); Vars.platform.addDialog(t.addField(tile.ent().getDelay(), cons(tx=>{})).get());
      })).growX();
      table.row();
    })).width((Vars.mobile)?460:530);
  }
});

commandb.entityType=prov(()=>extendContent(MessageBlock.MessageBlockEntity, commandb, {
  _type: 0,
  _cond: false,
  _power: true,
  _delay: 0,
  _err: "",
  getType() {
    return this._type;
  },
  setType(a) {
    this._type = a%3;
  },
  getCond() {
    return this._cond;
  },
  setCond(a) {
    this._cond = (a)?true:false;
  },
  getPower() {
    return this._power;
  },
  setPower(a) {
    this._power = (a)?true:false;
  },
  getDelay() {
    return this._delay;
  },
  setDelay(a) {
    this._delay = (!isNaN(Math.floor(a))&&Math.floor(a)>=0)?((Math.floor(a)>32767)?32767:Math.floor(a)):0;
  },
  getErr() {
    return this._err;
  },
  setErr(text) {
    this._err = text;
  },
  write(stream) {
    this.super$write(stream);
    stream.writeByte(this.getType());
    stream.writeBoolean(this.getCond());
    stream.writeBoolean(this.getPower());
    stream.writeShort(this.getDelay());
  },
  read(stream, revision) {
    this.super$read(stream, revision);
    this.setType(stream.readByte());
    this.setCond(stream.readBoolean());
    this.setPower(stream.readBoolean());
    this.setDelay(stream.readShort());
    this.setErr("");
  }
}));

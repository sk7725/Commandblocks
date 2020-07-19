const lastlog = extendContent(Block, "lastlog", {
  dialog: null,
  parseLog(text){
    var arr = text.split("\n");
    for(var i=0;i<arr.length;i++){
      arr[i] = arr[i].replace(/Command Mod/g,"[cyan]Command Mod");
      arr[i] += "[]";

      if(arr[i].indexOf("Loaded sound:")>-1){
        var index = arr[i].indexOf("Loaded sound:");//+13
        arr[i] = arr[i].substring(0, index+13) + "[coral]" + arr[i].substring(index+13, arr[i].length) + "[]";
      }

      var t = arr[i];
      if(t.substring(0,3)=="[W]"){
        t = "[yellow]\[W\][]" + t.substring(3,t.length);
        arr[i] = t;
      }
      else if(t.substring(0,3)=="[I]"){
        t = "[royal]\[I\][]" + t.substring(3,t.length);
        arr[i] = t;
      }
      else if(t.substring(0,3)=="[E]"){
        t = "[scarlet]\[E\][]" + t.substring(3,t.length);
        arr[i] = t;
      }
    }
    return arr.join("\n");
  },
  loadDialog(cont){
    cont.pane(cons(table => {
      table.top().left();
      table.add(this.parseLog(Core.settings.getDataDirectory().child('last_log.txt').readString()));
    })).grow();
  },
  showDialog(){
    this.dialog.cont.clear();
    this.loadDialog(this.dialog.cont);
    this.dialog.show();
  },
  load(){
    this.super$load();
    this.dialog = new FloatingDialog(Core.bundle.get("block.commandblocks-lastlog.dialog"));
		this.dialog.addCloseButton();
  },
  buildConfiguration(tile, table){
    Vars.control.input.frag.config.hideConfig();
    if(Vars.mobile){
      try{
        this.showDialog();
      }
      catch(err){
        print("Cannot open last_log.txt: "+err);
      }
    }
	},
  isHidden(){
    return Vars.net.active() || !Vars.mobile;
  }
});

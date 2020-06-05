//const FileChooser=Packages.mindustry.ui.dialogs.FileChooser;
if (typeof(cons2)== "undefined"){
  const cons2 = method => new Cons2(){get : method};
}

const musicList = ["celesting", "crowning", "divining", "fielding", "hearting", "wanting"];

const playermusic = extendContent(Block, "playermusic", {
  music:null,
  musics:[],
  custom:false,
  buildConfiguration(tile, table){
    const entity = tile.ent();

    table.addImageButton(Icon.play, run(() => {
      try{
        if(this.music != null && this.custom) this.music.play();
        else this.musics[tile.ent().getVal()-1].play();
      }
      catch(err){
        print(err);
      }
    })).size(40);
    table.addImageButton(Icon.pause, run(() => {
      try{
        if(this.music != null && this.custom) this.music.pause();
        else this.musics[tile.ent().getVal()-1].pause();
      }
      catch(err){
        print(err);
      }
    })).size(40);
    table.addImageButton(Icon.block, run(() => {
      try{
        if(this.music != null && this.custom) this.music.stop();
        else this.musics[tile.ent().getVal()-1].stop();
      }
      catch(err){
        print(err);
      }
    })).size(40);
    table.row();

    table.addImageButton(Icon.upOpen, run(() => {
      if(tile.ent().getVal()<this.musics.length) tile.configure(-1);
      this.custom = false;
    })).size(40);
    table.addImageButton(Icon.downOpen, run(() => {
      if(tile.ent().getVal()>1) tile.configure(-2);
      this.custom = false;
    })).size(40);

    table.addImageButton(Icon.file, run(() => {
      // Create dialog
      try{
        /*
        const dialog = new FileChooser("Choose Music", boolf(f=>(true)), true, cons(f=>{
          try{
            if(this.music != null) this.music.dispose();
            this.music = Core.audio.newMusic(f);
            this.music.setVolume(1);
          }
          catch(err){
            print("Ins: "+err);
            print(err.stack);
          }
        }));
        dialog.show();
        */
        Vars.platform.showFileChooser(true, "mp3", cons(f => {
          try{
            if(this.music != null) this.music.dispose();
            this.music = Core.audio.newMusic(f);
            this.music.setVolume(1);
            this.custom = true;
          }
          catch(err){
            this.music = null;
          }
        }));
      }
      catch(err){
        print(err);
        print(err.stack);
      }
    })).size(40);
  },
  configured(tile, player, value){
    if(value==-1||value==-2){
      if(value==-1){
        tile.ent().addVal(1);
      }
      else{
        tile.ent().addVal(-1);
      }
      Vars.ui.showInfoToast("Now Playing: "+tile.ent().getVal(),3);
    }
    else if(value>0&&value<=this.musics.length) tile.ent().setVal(value);
  },
  update(tile){
    if(tile.entity.cons.valid()){
      if(this.music != null && this.music.isPlaying()) return;
      try{
        var val = tile.ent().getVal()-1;
        for(var i=0;i<this.musics.length;i++){
          if(this.musics[i].isPlaying() && i != val) this.musics[i].stop();
        }
        if(!this.musics[val].isPlaying()) this.musics[val].play();
      }
      catch(err){}
    }
  },
  load(){
    this.super$load();
    if(this.musics.length>0){
      for(var i=0;i<this.musics.length;i++){
        try{
          this.musics[i].dispose();
        }
        catch(err){}
      }
    }
    for(var i=0;i<musicList.length;i++){
      (Core.assets.load("sounds/"+musicList[i]+".ogg", Packages.arc.audio.Music)).loaded = cons(a => this.musics.push(a));
    }

    /*
    Vars.mods.listFiles("music", cons2((l, f)=>{
      this.musics.push(Core.audio.newMusic(f));
    }));*/
  }
});

playermusic.entityType=prov(() => extend(TileEntity, {
  _now:1,
  config(){
    return this._now;
    //saves pulse in schems
  },
  getVal(){
    return this._now;
  },
  setVal(a){
    this._now = a;
  },
  addVal(a){
    this._now += a;
  },
  write(stream){
    this.super$write(stream);
    stream.writeShort(this._now);
  },
  read(stream,revision){
    this.super$read(stream,revision);
    this._now=stream.readShort();
  }
}));
//var muselist={};
/*
const playermusic = extendContent(MessageBlock, "playermusic", {
	playmuse(musename,tile){
		if(!musename){
			//Vars.ui.showInfoToast("Played nothing!",7);
			//Vars.control.music.play(null);
                        Vars.ui.showLabel("Playing nothing...",5,tile.worldx(),tile.worldy());
		}
		else{
			//var muse=Vars.content.getByName(ContentType.unit,"commandblocks-xmusic-"+musename).activeSound;
			//Vars.control.music.play(muse);
			//if music=sound(unlikely)
                        var thismod = Vars.mods.locateMod("commandblocks").file; //var musefi=thismod.child(!Vars.ios ? "music-"+musename + ".ogg" :"music-"+ musename + ".mp3");
                        var musefi=thismod.child("mod.json");
			if(musefi.exists()){
				//var mpath = Vars.tree.resolve("music-"+musename + ".ogg").exists() && !Vars.ios ? "music-"+musename + ".ogg" :"music-"+ musename + ".mp3";
                                if(muselist.hasOwnProperty(musename)) return; //already playing
				var muse = newMusic(musefi);
				Vars.ui.showInfoToast("Playing music-"+musename,7+"...");
				//Vars.control.music.playOnce(muse);
                                if(muse.isPlaying()){
                                        //muse.stop();
                                        Vars.ui.showLabel("Music music-"+musename+" already playing...",5,tile.worldx(),tile.worldy());
                                }
                                else {
                                        muselist[musename]=muse;
                                        muse.play();
                                        Vars.ui.showLabel("Music music-"+musename+" playing...",5,tile.worldx(),tile.worldy());
                                }
			}
			else{
				Vars.ui.showLabel("Cannot find "+thismod.list().toArray()+"...",5,tile.worldx(),tile.worldy());
			}
		}
	},
	update(tile){
		var entity=tile.ent();
		var musename=entity.message;
		if(tile.entity.cons.valid()){
      this.super$update(tile);
      //entity.cons.trigger();
      if(true){
        //entity.played=true;
				this.playmuse(musename,tile);
      }
    }
		else{
			//entity.played=false;
		}
	}
});
*/

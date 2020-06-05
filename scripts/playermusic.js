const FileChooser=Packages.mindustry.ui.dialogs.FileChooser;

const playermusic = extendContent(MessageBlock, "playermusic", {
  music:null,
  buildConfiguration(tile, table){
    const entity = tile.ent();
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
          }
          catch(err){
            print("Ins: "+err);
            print(err.stack);
          }
        }));
      }
      catch(err){
        print(err);
        print(err.stack);
      }
    })).size(40);
    table.addImageButton(Icon.play, run(() => {
      try{
        if(this.music != null) this.music.play();
      }
      catch(err){
        print(err);
      }
    })).size(40);
    table.addImageButton(Icon.pause, run(() => {
      try{
        if(this.music != null) this.music.pause();
      }
      catch(err){
        print(err);
      }
    })).size(40);
    table.addImageButton(Icon.block, run(() => {
      try{
        if(this.music != null) this.music.stop();
      }
      catch(err){
        print(err);
      }
    })).size(40);
  }
});
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

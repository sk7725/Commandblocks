var muselist={};
const playermusic = extendContent(MessageBlock, "playermusic", {
	playmuse(musename){
		if(!musename){
			Vars.ui.showInfoToast("Played nothing!",7);
			//Vars.control.music.play(null);
		}
		else{
			//var muse=Vars.content.getByName(ContentType.unit,"commandblocks-xmusic-"+musename).activeSound;
			//Vars.control.music.play(muse);
			//if music=sound(unlikely)
                        var thismod = Vars.modDirectory.child("commandblocks"); var musefi=thismod.child(!Vars.ios ? "music-"+musename + ".ogg" :"music-"+ musename + ".mp3");
			if(musefi.exists()){
				//var mpath = Vars.tree.resolve("music-"+musename + ".ogg").exists() && !Vars.ios ? "music-"+musename + ".ogg" :"music-"+ musename + ".mp3";
                                if(muselist.hasOwnProperty(musename)) return; //already playing
				var muse = newMusic(musefi);
				Vars.ui.showInfoToast("Playing music-"+musename,7+"...");
				//Vars.control.music.playOnce(muse);
                                if(muse.isPlaying()){
                                        //muse.stop();
                                }
                                else {
                                        muselist[musename]=muse;
                                        muse.play();
                                }
			}
			else{
				Vars.ui.showInfoToast("Cannot find "+musefi,1);
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
				this.playmuse(musename);
      }
    }
		else{
			//entity.played=false;
		}
	}
});

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
			if(Vars.tree.resolve("music-"+musename + ".ogg").exists()){
				var mpath = Vars.tree.resolve("music-"+musename + ".ogg").exists() && !Vars.ios ? "music-"+musename + ".ogg" :"music-"+ musename + ".mp3";
                                if(muselist.hasOwnProperty(mpath)) return; //already playing
				var muse = newMusic(mpath);
				Vars.ui.showInfoToast("Playing music-"+musename,7+"...");
				//Vars.control.music.playOnce(muse);
                                if(muse.isPlaying()){
                                        //muse.stop();
                                }
                                else {
                                        muselist[mpath]=muse;
                                        muse.play();
                                }
			}
			else{
				Vars.ui.showInfoToast("Cannot find music-"+musename,7+"!");
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

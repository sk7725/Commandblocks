
const playermusic = extendContent(MessageBlock, "playermusic", {
	playmuse(musename){
		if(!musename){
			Vars.ui.showInfoToast("Played nothing!",7);
			Vars.control.music.play(null);
		}
		else{
			//var muse=Vars.content.getByName(ContentType.unit,"commandblocks-xmusic-"+musename).activeSound;
			//Vars.control.music.play(muse);
			//if music=sound(unlikely)
			if(Vars.tree.get("music-"+musename + ".ogg").exists()){
				var mpath = Vars.tree.get("music-"+musename + ".ogg").exists() && !Vars.ios ? "music-"+musename + ".ogg" :"music-"+ musename + ".mp3";
				var muse = newMusic(mpath);
				Vars.ui.showInfoToast("Playing music-"+musename,7+"...");
				Vars.control.music.play(muse);
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
      if(!entity.hasOwnProperty("played")||!entity.played){
        entity.played=true;
				this.playmuse(musename);
      }
    }
		else{
			entity.played=false;
		}
	}
});


const playermusic = extendContent(MessageBlock, "playermusic", {
	configured(tile,value){
		var entity=tile.ent();
		var musename=entity.message;
		if(!musename){
			Vars.ui.showInfoToast("Played nothing!",7);
		}
		else{
			//var muse=Vars.content.getByName(ContentType.unit,"commandblocks-xmusic-"+musename).activeSound;
			//Vars.control.music.play(muse);
			//if music=sound(unlikely)
			if(Vars.tree.get("music-"+musename + ".ogg").exists()){
				var mpath = Vars.tree.get("music-"+musename + ".ogg").exists() && !Vars.ios ? "music-"+musename + ".ogg" :"music-"+ musename + ".mp3";
				var muse = newMusic(mpath);
				Vars.ui.showInfoToast("Playing music-"+musename,7);
				Vars.control.music.play(muse);
			}
			else{
				Vars.ui.showInfoToast("Cannot find music-"+musename,7);
			}
		}
	}
});

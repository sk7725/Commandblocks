
const playermusic = extendContent(MessageBlock, "playermusic", {
	configured(tile,value){
		var entity=tile.ent();
		var musename=entity.message;
		if(musename==""){
			Vars.control.music.play(null);
		}
		else{
			//var muse=Vars.content.getByName(ContentType.unit,"commandblocks-xmusic-"+musename).activeSound;
			//Vars.control.music.play(muse);
			//if music=sound(unlikely)
			var mpath = Vars.tree.get("music-"+musename + ".ogg").exists() && !Vars.ios ? musename + ".ogg" : musename + ".mp3";
			var muse = newMusic(mpath);
			Vars.control.music.play(muse);
		}
	}
});

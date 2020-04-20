const commandcached=this.global.commandcached;
const unitcacher = extendContent(MessageBlock, "unitcacher", {
	unitOn(tile,unit){
		var entity=tile.ent();
		var key="NOTAG";
		if(entity.message!="") key=entity.message;
		commandcached[key]=unit;
	},
	removed(tile){
		this.super$removed(tile);
		var entity=tile.ent();
		var key="NOTAG";
		if(entity.message!="") key=entity.message;
		if(commandcached.hasOwnProperty(key)&&key!="NOTAG"){
			delete commandcached[key];
		}
	}
});

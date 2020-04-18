/*
MessageBlockEntity entity = tile.ent();
if(entity != null){
    entity.message = result.toString();
    entity.lines = entity.message.split("\n");
}
*/
const commandblock = extendContent(MessageBlock, "commandblock", {
  command(tile,msg){
    if(msg.substring(0,1)=="/") msg=msg.substring(1,msg.length);
    var argstmp = msg.substring(1).split('"');
    var args=[];
    for(var i=0;i<argstmp.length;i++){
      if(i%2==0){
        if(argstmp[i].trim()!=''){
          args=args.concat(argstmp[i].trim().split(' '));
        }
      }
      else{
        args.push(argstmp[i].trim());
      }
    }
    if(args.length==0){
      return;
    }
    var cmd = args[0];
    args = args.splice(1);
    switch(cmd){
      case 'say':
        setMessageBlockText(null,tile,args.join(' '));
      break;
    }
  },
  init(){
    this.super$init();
		this.didcmd = false;
	},
  update(tile){
    var entity=tile.ent();
    if(tile.entity.cons.valid()){
      this.super$update(tile);
      //entity.cons.trigger();
      if(!this.didcmd){
        this.command(tile,entity.message);
        this.didcmd = true;
      }

    }
    else{
      if(this.didcmd) this.didcmd=false;
      return;
    }
  }
  /*
	draw(tile) {
		Draw.rect(Core.atlas.find(this.name + "_" + tile.x % 2),
			tile.drawx(),
			tile.drawy());
	},

	generateIcons() {
		return [Core.atlas.find(this.name)];
	},

	calcOffset(tile) {
		var x = tile.x;
		if (x % 2 == 0) {
			x++;
		} else {
			x--;
		}
		return x;
	},

	canPlaceOn(tile){
		const x = this.calcOffset(tile);
		const other = Vars.world.tile(x, tile.y);
		return other.block() == "air"
	},
  */
/*
	removed(tile) {
		this.super$removed(tile);
		const x = this.calcOffset(tile);
		const key = tile.x + "," + tile.y;
		//Prevent trying to delete the other half infinitely
		if (alive[key]) {
			alive[key] = false;
			Call.setTile(Vars.world.tile(x, tile.y), Blocks.air, tile.team, 0);
		}
	},*/
	//chad: false
});


const temp=extendContent(Block,"temp",{
  say(tile, msg){
    Call.sendMessage(msg+"|"+tile.ent());
  },
  placed(tile){
    this.say(tile, "PLAYERPLACED");
  },
  playerPlaced(tile){
    this.say(tile, "PLAYERPLACED");
  },
  removed(tile){
    this.say(tile, "REMOVED");
  },
  onDestroyed(tile){
    this.say(tile, "ONDESTROYED");
  }
});

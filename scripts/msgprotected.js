const msgprotected = extendContent(MessageBlock, "msgprotected", {
	shouldShowConfigure(tile, player){
    return !Vars.net.server||player.isAdmin;
  }
});

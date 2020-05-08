const msgprotected = extendContent(MessageBlock, "msgprotected", {
	shouldShowConfigure(tile, player){
    return (!Vars.net.active())||player.isAdmin;
  }
});

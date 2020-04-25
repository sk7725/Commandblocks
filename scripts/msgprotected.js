const msgprotected = extendContent(MessageBlock, "msgprotected", {
	shouldShowConfigure(tile, player){
    return player.isLocal();
  }
});

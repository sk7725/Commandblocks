Events.on(EventType.DepositEvent, run(e=>{
  Call.sendMessage(e.player+" thrown "+e.item+"x"+e.amount+" to "+e.tile);
}));

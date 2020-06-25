Events.on(EventType.DepositEvent.class, run(e=>{
  Call.sendMessage(e.player+" thrown "+e.item+"x"+e.amount+" to "+e.tile);
}));

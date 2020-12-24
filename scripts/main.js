if(!Vars.headless){
  Events.on(ClientLoadEvent, () => {
    Core.app.post(() => {
      Vars.ui.showConfirm("$download.title", "$download.text", () => {
        Core.app.openURI("https://github.com/sk7725/BetaMindy");
      })
    })
  })
}

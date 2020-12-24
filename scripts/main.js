if(!Vars.headless && Vars.mods.locateMod("betamindy") == null){
  Events.on(ClientLoadEvent, () => {
    Core.app.post(() => {
      Vars.ui.showConfirm("$download.title", "$download.text", () => {
        Core.app.openURI("https://github.com/sk7725/BetaMindy");
      });
      var mod = Vars.mods.locateMod("beta-mindy-r");
      mod.meta.displayName = "[lightgray]Beta[gray]Mindy[][]";
      mod.meta.description = "download.text";
    });
  });
}

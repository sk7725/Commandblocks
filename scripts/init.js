StatusEffects.burning.color = Pal.lightFlame;
StatusEffects.freezing.color = Liquids.cryofluid.color;
StatusEffects.wet.color = Liquids.water.color;
StatusEffects.tarred.color = Liquids.oil.color;
StatusEffects.melting.color = Liquids.slag.color
StatusEffects.overdrive.color = Pal.accent;
StatusEffects.shocked.color = Pal.lancerLaser;
StatusEffects.corroded.color = Pal.plastanium;
StatusEffects.boss.color = Pal.health;
StatusEffects.shielded.color = Pal.stoneGray;

if (Vars.ui.hudGroup){

  Core.app.post(run(() => {
    Vars.ui.showCustomConfirm(Core.bundle.get("warning.title"), Core.bundle.get("warning.text"), "[accent]"+Core.bundle.get("ok")+"[]", "[lightgray]"+Core.bundle.get("cancel")+"[]", run(()=>{
      Core.app.exit();
    }), run(()=>{}));
  }));
}

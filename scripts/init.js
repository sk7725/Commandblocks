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

if(!Vars.headless && Vars.ui.hudGroup){

  Core.app.post(run(() => {
    Vars.ui.showCustomConfirm(Core.bundle.get("warning.title"), Core.bundle.get("warning.text"), "[accent]"+Core.bundle.get("ok")+"[]", "[lightgray]"+Core.bundle.get("cancel")+"[]", run(()=>{
      Core.app.exit();
    }), run(()=>{}));
  }));
}

function loadSingleEffect(eff, intensity, hidep){
  var seff= extendContent(StatusEffect,eff+"-"+intensity+"-"+hidep,{});
  seff.speedMultiplier=1;
  seff.damageMultiplier=1;
  seff.armorMultiplier=1;
  seff.damage=0;
  var seffcolor= Color.valueOf("ffffff");
  switch(eff){
    case "speed":
      seff.speedMultiplier=intensity*0.1+1.1;
      seffcolor= Color.valueOf("7cafc6");
    break;
    case "slowness":
      seff.speedMultiplier=-1*intensity*0.05+0.95;
      seffcolor= Color.valueOf("5a6c81");
    break;
    case "strength":
      seff.damageMultiplier=intensity*0.1+1.1;
      seffcolor= Color.valueOf("932423");
    break;
    case "weakness":
      seff.damageMultiplier=-1*intensity*0.05+0.95;
      seffcolor= Color.valueOf("484d48");
    break;
    case "resistance":
      seff.armorMultiplier=intensity*0.2+1.1;
      seffcolor= Color.valueOf("99453a");
    break;
    case "pain":
      seff.armorMultiplier=-1*intensity*0.05+0.95;
      seffcolor= Color.valueOf("e49a3a");
    break;
    case "poison":
      seff.damage=0.05*intensity+0.05;
      seffcolor= Color.valueOf("4e9331");
    break;
    case "wither":
      seff.damage=0.1*intensity+0.1;
      seffcolor= Color.valueOf("352a27");
    break;
    case "regeneration":
      seff.damage=-0.01*intensity-0.01;
      if(seff.damage<-1) seff.damage=-1;
      seffcolor= Color.valueOf("cd5cab");
    break;
    case "instant_health":
      seff.damage=-0.1*intensity-0.1;
      if(seff.damage<-1) seff.damage=-1;
      seffcolor= Color.valueOf("f82423");
    break;
    case "instant_damage":
      seff.damage=10*intensity+10;
      seffcolor= Color.valueOf("430a09");
    break;
  }
  if(!hidep){
    var potion = newEffect(25, e => {
      Draw.color(seffcolor);
      Lines.stroke(e.fout() + 0.15);
      /*
      Angles.randLenVectors(e.id, 2, 6, (x, y) => {
        Lines.circle(e.x + x, e.y + y, 0.5 + e.fin() * 1.7);
      });
      */
      //new Floatc2({get: function(x, y){/*code*/}})
      Angles.randLenVectors(e.id, 2, 8.2, new Floatc2({get: function(x, y){Lines.circle(e.x + x, e.y + y, 0.5 + e.fin() * 1.8);}}));
    });
    seff.color=seffcolor;
    seff.effect=potion;
  }
  this.global.potionEffects[eff+"-"+intensity+"-"+hidep]=seff;
}

function loadEffects(eff){
  for(var i=0; i<10; i++){
    loadSingleEffect(eff, i, false);
    loadSingleEffect(eff, i, true);
  }
}

loadEffects("speed");
loadEffects("slowness");
loadEffects("strength");
loadEffects("weakness");
loadEffects("resistance");
loadEffects("pain");
loadEffects("poison");
loadEffects("wither");
loadEffects("instant_damage");

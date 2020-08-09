if(!this.global.newSounds){
  this.global.newSounds = {};
}
importPackage(Packages.arc.audio);
var t = this;

function loadsound(name){
  /*if(t.global.newSounds[name] !== undefined && t.global.newSounds[name] !== null && t.global.newSounds[name] != Sounds.none) return;
  try{
    (Core.assets.load("sounds/"+ name +".ogg", Packages.arc.audio.Sound)).loaded = cons(a => {
      try{
        t.global.newSounds[name] = a;
        print("Loaded sound: "+name);
      }
      catch(err){
        t.global.newSounds[name] = Sounds.none;
        print("Failed to load sound!");
        print(err);
      }
    });
  }
  catch(err){
    t.global.newSounds[name] = Sounds.none;
    print("Failed to load sound!");
    print(err);
  }
  if(!t.global.newSounds[name]){
    t.global.newSounds[name] = Sounds.none;
    //print("Failed to load sound! Please restart the game!");
  }*/
  if(Vars.headless) {
    sounds[name]=new MockSound();
    return;
  }
  var path="sounds/"+name+".ogg";
  if(Core.assets.contains(path,Sound)) t.global.newSounds[name]=Core.assets.get(path,Sound);
  else Core.assets.load(path,Sound).loaded=cons(a=>t.global.newSounds[name]=a);
}

loadsound("boostsound");
loadsound("tntfuse");
loadsound("beep");
loadsound("pistonextend");
loadsound("pistoncontract");
loadsound("spearshot");
loadsound("spearappear");
loadsound("boing");
loadsound("sparklebg");

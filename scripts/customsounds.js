if(!this.global.newSounds){
  this.global.newSounds = {};
}

var t = this;

function loadsound(name){
  if(t.global.newSounds[name] !== undefined && t.global.newSounds[name] !== null && t.global.newSounds[name] != Sounds.none) return;
  try{
    (Core.assets.load("sounds/"+ name +".ogg", Packages.arc.audio.Sound)).loaded = cons(a => {
      try{
        t.global.newSounds[name] = a;
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
    print("Failed to load sound! Please restart the game!");
  }
}

loadsound("boostsound");
loadsound("tntfuse");
loadsound("beep");

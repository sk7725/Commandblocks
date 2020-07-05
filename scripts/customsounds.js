this.global.newSounds = {};

var t = this;

function loadsound(name){
  try{
    (Core.assets.load("sounds/commandblocks/"+ name +".ogg", Packages.arc.audio.Sound)).loaded = cons(a => {
      t.global.newSounds[name] = a;
    });
  }
  catch(err){
    print("Failed to load sound!");
    print(err);
  }
}

loadsound("boostsound");
loadsound("tntfuse");

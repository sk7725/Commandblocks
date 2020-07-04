if (typeof(cons2)== "undefined"){
  const cons2 = method => new Cons2(){get : method};
}

const mp3player = extendContent(Block, "mp3player", {
  music:null,
  buildConfiguration(tile, table){
    const entity = tile.ent();

    table.addImageButton(Icon.play, Styles.clearTransi, run(() => {
      try{
        if(this.music != null) this.music.play();
      }
      catch(err){
        print(err);
      }
    })).size(40);
    table.addImageButton(Icon.pause, Styles.clearTransi, run(() => {
      try{
        if(this.music != null) this.music.pause();
      }
      catch(err){
        print(err);
      }
    })).size(40);
    table.addImageButton(Icon.block, Styles.clearTransi, run(() => {
      try{
        if(this.music != null) this.music.stop();
      }
      catch(err){
        print(err);
      }
    })).size(40);

    table.addImageButton(Icon.file, Styles.clearTransi, run(() => {
      // Create dialog
      try{
        /*
        const dialog = new FileChooser("Choose Music", boolf(f=>(true)), true, cons(f=>{
          try{
            if(this.music != null) this.music.dispose();
            this.music = Core.audio.newMusic(f);
            this.music.setVolume(1);
          }
          catch(err){
            print("Ins: "+err);
            print(err.stack);
          }
        }));
        dialog.show();
        */
        Vars.platform.showFileChooser(true, "mp3", cons(f => {
          try{
            if(this.music != null) this.music.dispose();
            this.music = Core.audio.newMusic(f);
            this.music.setVolume(1);
          }
          catch(err){
            this.music = null;
          }
        }));
      }
      catch(err){
        print(err);
        print(err.stack);
      }
    })).size(40);
    
  },
  update(tile){
    if(Vars.mobile){
      if(tile.entity.cons.valid()){
        if(this.music == null) return;
        try{
          if(!this.music.isPlaying()) this.music.play();
        }
        catch(err){}
      }
    }
  } else {
    print("ONLY FOR MOBILE");
    tile.entity.kill();
  }
});

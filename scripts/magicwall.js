
const bitcolor1=Color.valueOf("00e5ff");
const bitcolor2=Color.valueOf("ff65db");
const bitcolorspeed=0.01;
const magicwall=extendContent(Wall,"magicwall",{
    draw(tile){
      Draw.color(bitcolor1,bitcolor2,(Math.sin(Time.time()*bitcolorspeed)+1)/2);
      Draw.rect(this.animRegion, tile.drawx(), tile.drawy());
      Draw.color();
    },
    load(){
      this.super$load();
      this.region=Core.atlas.find(this.name);
      this.animRegion=Core.atlas.find(this.name+"-anim");
    },
    init(){
      this.super$init();

      this.thisBlock=Vars.content.getByName(ContentType.block,this.name);
    },
    onDestroyed(tile){
      this.super$onDestroyed(tile);
      var replacement=this.thisBlock;
      if(Math.random()>0.5){
        this.replaceWalls=Vars.content.blocks().copy().eachFilter(boolf(e=>(!(e instanceof Wall)))).toArray();
        replacement=this.replaceWalls[Math.floor(Math.random() * this.replaceWalls.length)];
      }
      Vars.world.tile(tile.x, tile.y).setNet(replacement, tile.team, 0);
    }
});

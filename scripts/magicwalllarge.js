
const bitcolor1=Color.valueOf("00e5ff");
const bitcolor2=Color.valueOf("ff65db");
const bitcolorspeed=0.01;
const magicwalllarge=extendContent(Wall,"magicwalllarge",{
    draw(tile){
      Draw.color(bitcolor1,bitcolor2,(Mathf.sin(Time.time()*bitcolorspeed)+1)/2);
      Draw.rect(this.animRegion, tile.drawx(), tile.drawy());
      Draw.color();
    },
    load(){
      this.super$load();
      this.region=Core.atlas.find(this.name);
      this.animRegion=Core.atlas.find(this.name+"-anim");
    },
    handleDamage(tile,amount){
      return 1.0;
    },
    handleBulletHit(entity,bullet){
      entity.damage(1.0);
    }
});

const commandblocksc=this.global.commandblocks;
/*
const commandblockchained = extendContent(MessageBlock, "commandblockchained", { 
getfacingpos(tx, ty, trot){
var tmpobj={};
if(trot==0){
tmpobj.x=tx-1;  tmpobj.y=ty;
}
else if(trot==1){
tmpobj.x=tx;  tmpobj.y=ty-1;
}
else if(trot==2){
tmpobj.x=tx+1;  tmpobj.y=ty;
}
else{
tmpobj.x=tx;  tmpobj.y=ty+1;
}
return tmpobj;
},		
update(tile){ 
var entity=tile.ent(); 
if(tile.entity.cons.valid()){ 
this.super$update(tile); //entity.cons.trigger(); 
const facepos=this.getfacingpos(tile.x,tile.y,tile.rotation());		
const x=facepos.x; const y=facepos.y;		
var near = Vars.world.tile(x,y);
if(near.block()=="commandblock"||near.block()=="commandblockrepeating"||near.block()="commandblockchained"){
if(true){
this.success=commandblocksc.command(tile,entity.message); 
}
else{
this.success=false;
}
}
} 
else{ 
this.success=false; return; 
} 
}
});
*/

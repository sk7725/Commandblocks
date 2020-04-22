//const attr = ["update","destructible","unloadable","solid","solidifies","rotate","breakable","rebuildable","placeableOn","insulated","health","baseExplosiveness","floating","size","expanded","timers","cacheLayer","fillsTile","layer","layer2","alwaysReplace","group","priority","configurable","consumesTap","drawLiquidLight","posConfig","sync","targetable","canOverdrive","outlineColor","outlineIcon","hasShadow","breakSound","activeSound","activeSoundVolume","idleSound","idleSoundVolume","requirements","category","buildCost","buildVisibility","buildCostMultiplier","instantTransfer","alwaysUnlocked"];
//const attrstorage = ["hasItems","hasLiquids","hasPower","outputsLiquid","consumesPower","outputsPower","itemCapacity","liquidCapacity","liquidPressure","consumes"];

const posreaderjson = extendContent(MessageBlock, "posreaderjson", {
	getfacingpos(tx, ty, trot){
		var tmpobj={};
		if(trot==0){
			tmpobj.x=tx+1;
			tmpobj.y=ty;
		}
		else if(trot==1){
			tmpobj.x=tx;
			tmpobj.y=ty+1;
		}
		else if(trot==2){
			tmpobj.x=tx-1;
			tmpobj.y=ty;
		}
		else{
			tmpobj.x=tx;
			tmpobj.y=ty-1;
		}
		return tmpobj;
	},
	placed(tile) {
		this.super$placed(tile);
		const facepos=this.getfacingpos(tile.x,tile.y,tile.rotation());
		const x=facepos.x;
    const y=facepos.y;
		var near = Vars.world.tile(x,y).block();
    //this.setMessageBlockText(null,tile,JSON.stringify(Blocks));
    this.setMessageBlockText(null,tile,near.attributes.toString());
	}
});

posreaderjson.maxNewlines=60;
posreaderjson.maxTextLength=60000;


const tppad = extendContent(ItemBridge, "tppad", {
	tapped(tile, player){
		const entity = tile.ent();
		const other = Vars.world.tile(entity.link);
		if(this.linkValid(tile, other) && entity.power.status > 0.5 && !player.isDead() && other != null && other.entity != null && entity.getchargeProgress() <= 0){
			if(player.dst(tile) > this.size * Vars.tilesize / 2 + 12){
				player.moveTarget = player.moveTarget == tile.entity ? null : tile.entity;
			}else{
				entity.setchargeProgress(Mathf.dst(tile.drawx(), tile.drawy(),other.drawx(), other.drawy()) / 3);
				entity.setconAble(1);
				player.set(other.drawx(),other.drawy());
				if(player == Vars.player) Core.camera.position.set(player);
				Time.run(2 , run(() => {
					Sounds.respawn.at(other);
					Sounds.respawn.at(tile);
					Effects.effect(Fx.spawn, other);
					Effects.effect(Fx.spawn, tile);
				}))
			}
		}
  },
  drawLayer(tile){
		const entity = tile.ent();
		const other = Vars.world.tile(entity.link);
		if(other != null && entity.power.status > 0.5 && entity.getchargeProgress() <= 0){
			var drawheat = entity.power.status;
			const f = (Time.time() / 100) % 1 * drawheat;
			const f2 = ((Time.time() + 25) / 100) % 1 * drawheat;
			const f3 = ((Time.time() + 50) / 100) % 1 * drawheat;
			const f4 = ((Time.time() + 75) / 100) % 1 * drawheat;
			const ang = entity.angleTo(other);
			const len = Mathf.dst(tile.drawx(), tile.drawy(),other.drawx(), other.drawy()) / 4;
			const size1 = 8;
			const size2 = 8;
			const trnx = Angles.trnsx(ang, len);
			const trny = Angles.trnsy(ang, len);

			Draw.blend(Blending.additive);
			Draw.color(Pal.accent);

			Draw.alpha((1 - f));
			Lines.stroke((1 - f) * 1.4);
			Lines.poly(tile.drawx() + f * trnx, tile.drawy() + f * trny, 6, (1 - f) * size1 + size2);

			Draw.alpha((1 - f2));
			Lines.stroke((1 - f2) * 1.4);
			Lines.poly(tile.drawx() + f2 * trnx, tile.drawy() + f2 * trny, 6, (1 - f2) * size1 + size2);

			Draw.alpha((1 - f3));
			Lines.stroke((1 - f3) * 1.4);
			Lines.poly(tile.drawx() + f3 * trnx, tile.drawy() + f3 * trny, 6, (1 - f3) * size1 + size2);

			Draw.alpha((1 - f4));
			Lines.stroke((1 - f4) * 1.4);
			Lines.poly(tile.drawx() + f4 * trnx, tile.drawy() + f4 * trny, 6, (1 - f4) * size1 + size2);

			Draw.blend();
			Draw.color();
		}
  },
    linkValid(tile, other, checkDouble){
        if(other == null || tile == null || other == tile) return false;
        if(Math.pow(other.x - tile.x, 2) + Math.pow(other.y - tile.y, 2) > Math.pow(this.range + 0.5, 2)) return false;
        return other.block() == this && (!checkDouble || other.ent().link != tile.pos());
    },
    drawPlace(x, y, rotation, valid){
        link = this.findLink(x, y);
		if (link != null) {
			const sin = Mathf.absin(Time.time(), 6, 1);
			Tmp.v1.set(x * Vars.tilesize + this.offset(), y * Vars.tilesize + this.offset()).sub(link.drawx(), link.drawy()).limit((this.size / 2 + 1) * Vars.tilesize + sin + 0.5);
			const x2 = x * Vars.tilesize - Tmp.v1.x;
			const y2 = y * Vars.tilesize - Tmp.v1.y;
            const x1 = link.drawx() + Tmp.v1.x;
			const y1 = link.drawy() + Tmp.v1.y;
			const segs = Math.floor(link.dst(x * Vars.tilesize, y * Vars.tilesize) / Vars.tilesize);

			Lines.stroke(4, Pal.gray);
			Lines.dashLine(x1, y1, x2, y2, segs);
			Lines.stroke(2, Pal.placing);
			Lines.dashLine(x1, y1, x2, y2, segs);
			Drawf.circles(link.drawx(), link.drawy(), (this.size / 3 + 1) * Vars.tilesize + sin - 2, Pal.accent);
			Drawf.arrow(link.drawx(), link.drawy(),x * Vars.tilesize + this.offset(), y * Vars.tilesize + this.offset(), this.size * Vars.tilesize + sin, 4 + sin, Pal.accent);
			Draw.reset();
		}
		Drawf.dashCircle(x * Vars.tilesize, y * Vars.tilesize, (this.range + 1) * Vars.tilesize, Pal.accent);
    },
	drawConfigure(tile) {
		const entity = tile.ent();

		const sin = Mathf.absin(Time.time(), 6, 1);

		Draw.color(Pal.accent);
		Lines.stroke(1);
		Drawf.circles(tile.drawx(), tile.drawy(), (tile.block().size / 2 + 1) * Vars.tilesize + sin - 2, Pal.accent);
		const other = Vars.world.tile(entity.link);
		if(!this.linkValid(tile, other)) return;
		if(other != null){
			Drawf.circles(other.drawx(), other.drawy(), (tile.block().size / 3 + 1) * Vars.tilesize + sin - 2, Pal.place);
			Drawf.arrow(tile.drawx(), tile.drawy(), other.drawx(), other.drawy(), this.size * Vars.tilesize + sin, 4 + sin, Pal.accent);
		}
		Drawf.dashCircle(tile.drawx(), tile.drawy(), this.range * Vars.tilesize, Pal.accent);

        Draw.color(Pal.placing);
        Lines.stroke(1.0);
        Lines.dashCircle(tile.drawx(), tile.drawy(), this.range * Vars.tilesize);

        Draw.reset();

        Draw.color(Pal.accent);
        Lines.stroke(1.0);
        Lines.square(tile.drawx(), tile.drawy(),
        tile.block().size * Vars.tilesize / 2.0 + 1.0);


        Draw.color(Pal.accent);
        Lines.stroke(1.0);
        Lines.square(tile.drawx(), tile.drawy(),
        tile.block().size * Vars.tilesize / 2.0 + 1.0);
		Draw.color(Pal.place);
		Lines.square(other.drawx(), other.drawy(),other.block().size * Vars.tilesize / 2.0 );
        Draw.reset();
    },
	update(tile){
		const entity = tile.ent();
		const other = Vars.world.tile(entity.link);
    /*
		if(entity.power.status < 0.5){
			tppad.configurable = true;
		}else tppad.configurable = false;
    */
		if(entity.getchargeProgress() >= 0){
			entity.subchargeProgress(entity.power.status * entity.timeScale);
		}
	},
	acceptItem(item, tile, source){
		return false;
	}
});

tppad.range = 1200;

tppad.entityType=prov(()=>extend(ItemBridge.ItemBridgeEntity ,{
  getconAble(){return this._conAble},
  setconAble(value){this._conAble = value},
  _conAble: 0,
  getchargeProgress(){
    return this._chargeProgress
  },
  setchargeProgress(a){
    this._chargeProgress = a;
  },
  subchargeProgress(a){
    this._chargeProgress -= a;
  },
  _chargeProgress : 0
}));

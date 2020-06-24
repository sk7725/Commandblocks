const newmove = function(unit){
	if(!unit.isFlying()) return;
	
	const anti = Mathf.clamp(1.0 - unit.drag() * Time.delta());
	unit.moveBy(-unit.velocity().x / anti * Time.delta(), -unit.velocity().y / anti * Time.delta());
	Vars.collisions.move(unit, unit.velocity().x / anti * Time.delta(), unit.velocity().y / anti * Time.delta());
};

Vars.collisions = extend(EntityCollisions, {
	tmp: new Rect(),
	rect: new Rect(),
	rect2: new Rect(),
	
	moveDelta(entity, deltax, deltay, x){
        entity.hitboxTile(this.rect);
        entity.hitboxTile(this.rect2);
        this.rect.x += deltax;
        this.rect.y += deltay;

        var tilex = Math.round((this.rect.x + this.rect.width / 2) / Vars.tilesize), tiley = Math.round((this.rect.y + this.rect.height / 2) / Vars.tilesize);

        for(dx = -1; dx <= 1; dx++){
            for(dy = -1; dy <= 1; dy++){
                var wx = dx + tilex, wy = dy + tiley;
                if(this.shouldCollide(wx, wy, entity)){
                    this.tmp.setSize(Vars.tilesize).setCenter(wx * Vars.tilesize, wy * Vars.tilesize);
                    if(this.tmp.overlaps(this.rect)){
                        var v = Geometry.overlap(this.rect, this.tmp, x);
                        this.rect.x += v.x;
                        this.rect.y += v.y;
                    }
                }
            }
        }

        entity.setX(entity.getX() + this.rect.x - this.rect2.x);
        entity.setY(entity.getY() + this.rect.y - this.rect2.y);
	},
	
	solid(x, y){
        var tile = Vars.world.tile(x, y);
        return tile != null && tile.solid();
    },
	
	shouldCollide(wx, wy, unit){
		if(unit.isFlying()){
			var tile = Vars.world.tile(wx, wy);
			//todo block properties
			return tile != null && tile.block() != null && ["commandblocks-walltimelarge", "commandblocks-walltime"].indexOf(tile.link().block().name) > -1;
		}else{
			return this.solid(wx, wy) && entity.collidesGrid(wx, wy);
		}
	}
});

Events.on(EventType.Trigger.update, run(function(){
	for(i = 0; i < Vars.unitGroup.all().size; i++){
		newmove(Vars.unitGroup.all().get(i));
	};
	for(i = 0; i < Vars.playerGroup.all().size; i++){
		newmove(Vars.playerGroup.all().get(i));
	};
}));
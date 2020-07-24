const color1 = Color.valueOf("ffaa5f"); const color2 = Color.valueOf("84f491");
const root = this.global.skills.skills;
const skillfunc = this.global.skills.func;

const animspeed = 0.013; const animwidth = 60;

const color3 = Color.valueOf("82ffe8");
const skillupFx = newEffect(15, e => {
  Lines.stroke(1.5 * e.fout());
  Draw.color(color3);
  Lines.poly(e.x, e.y, 4, 0.1 + e.fin() * 3);
});
const skillup = extendContent(StatusEffect,"skillup",{});
skillup.color = color3;
skillup.effect = skillupFx;
var t = this;

const skillinstFx = newEffect(15, e => {
  Lines.stroke(1.5 * e.fout());
  Draw.color(Pal.accent);
  Lines.poly(e.x, e.y, 4, 0.1 + e.fin() * 3);
});
const skillinst = extendContent(StatusEffect,"skillinst",{});
skillinst.color = Pal.accent;
skillinst.effect = skillinstFx;

var localSkill = {
  skill:"",
  lastused:0
};

const researchskill = extendContent(Block, "researchskill", {
	dialog: null,
	blockpos: {},

	load(){
		this.super$load();

		//load languages
		var uparr = Object.keys(root);
		for(var i=0; i<uparr.length; i++){
			root[uparr[i]].n = i;
			root[uparr[i]].name = uparr[i];
			root[uparr[i]].displayName = Core.bundle.get("skill." + uparr[i] + ".name");
			root[uparr[i]].shortDesc = Core.bundle.get("skill." + uparr[i] + ".short");
			root[uparr[i]].description = Core.bundle.get("skill." + uparr[i] + ".description");
		}

		this.animRegion = [];
		for(var i=0; i<19; i++){
			if(i == 1 || i == 18) continue;
			this.animRegion.push(Core.atlas.find(this.name + "-" + i));
		}

		this.dialog = new FloatingDialog(Core.bundle.get("research.title"));
		this.dialog.addCloseButton();

		Events.on(EventType.WorldLoadEvent, run(event => {
			researchskill.blockpos = {};
      t.global.skilltile = null;
      localSkill.skill = "";
      localSkill.lastused = 0;
		}));
	},
	update(tile){
		this.super$update(tile);
		var ent = tile.ent();
		if(!ent.enabled()) return;
		if(!ent.isValidated()){
			ent.validate();
			if(tile.getTeamID() in this.blockpos) ent.disable();
			else this.blockpos[tile.getTeamID()] = tile.pos();
		}
    if(tile.getTeam() == Vars.player.getTeam() && (t.global.skilltile == null || t.global.skilltile != tile.pos())) t.global.skilltile = tile.pos();
		if(skillfunc.update(tile.ent().skill(),tile)) tile.ent().useSkill();
    if(Vars.player.hasEffect(skillup)&&tile.ent().skill().skill!=""&&tile.ent().skill().skill!="zetarecharge") tile.ent().skillCooltimeReduce(2);
    if(Vars.player.hasEffect(skillinst)&&tile.ent().skill().skill!="") tile.ent().skillCooltimeSet(0);

	},
	draw(tile){
		if(tile.ent().enabled()) Draw.rect(this.animRegion[Mathf.floorPositive(animwidth+2+animwidth*Mathf.sin(Time.time()*animspeed))%17], tile.drawx(), tile.drawy());
		else this.super$draw(tile);
	},
	canPlaceOn(tile){
		if(Vars.headless){
			//todo find a good way to check team on non-local clients
			return true;
		}else{
			return !(Vars.player.getTeam().id in this.blockpos);
		}
	},
	canBreak(tile){
		return tile.ent().getRes().length <= 0 || !tile.ent().enabled();
	},
	removed(tile){
		if(this.blockpos[tile.getTeamID()] == tile.pos()){
			delete this.blockpos[tile.getTeamID()];
		}
		this.super$removed(tile);
	},
	buildConfiguration(tile, table){
		Vars.control.input.frag.config.hideConfig();
		if(!tile.ent().enabled()) return;
		this.makelist(tile);
		this.dialog.show();
	},
	makelist(tile){
		this.dialog.cont.clear();
		this.dialog.cont.pane(cons(table => {
			table.margin(10).top();
			var uparr = Object.keys(root);
			var canres = [];
			var cannotres = [];
			var researched = [];
			for(var i=0; i<uparr.length; i++){
				if(root[uparr[i]].hasOwnProperty("uses") && Vars.content.getByName(ContentType.item, root[uparr[i]].uses.item) == null) continue;
				if(this.isresearched(tile, uparr[i])) researched.push(root[uparr[i]]);
				else if(this.canresearch(tile, root[uparr[i]], uparr[i])) canres.push(root[uparr[i]]);
				else cannotres.push(root[uparr[i]]);
			}
			if(researched.length > 0){
				table.add(Core.bundle.get("research.researched")).growX().left().color(color2);
				table.row();
				table.addImage().growX().height(3).pad(6).color(color2);
				table.row();
				for(var i=0; i<researched.length; i++){
					this.makesingle(tile, table, researched[i], "researched");
				}
			}
			if(canres.length > 0){
				table.add(Core.bundle.get("research.canres")).growX().left().color(Pal.accent);
				table.row();
				table.addImage().growX().height(3).pad(6).color(Pal.accent);
				table.row();
				for(var i=0;i<canres.length;i++){
					this.makesingle(tile, table, canres[i], "canres");
				}
			}
			if(cannotres.length > 0){
				table.add(Core.bundle.get("research.cannotres")).growX().left().color(Pal.accent);
				table.row();
				table.addImage().growX().height(3).pad(6).color(Pal.accent);
				table.row();
				for(var i=0; i<cannotres.length; i++){
					this.makesingle(tile, table, cannotres[i], (cannotres[i].hasOwnProperty("parent") && (!this.isresearched(tile, cannotres[i].parent))) ? "noparent" : "cannotres");
				}
			}
		})).width(Vars.mobile ? 460 : 530);
	},

	configured(tile,player,value){
		//research in sync
		if(value == 0) return;
		if(value < 0){
			var obj = root[Object.keys(root)[-1*value-1]];
			try{
				if(obj.name == "phaseskill") skillfunc[obj.name](player, tile);
				else skillfunc[obj.name](player);
        if(!Vars.net.client()) player.addItem(player.item().item,Math.floor(-1*obj.uses.amount));
			}catch(err){
				print("err:" + err);
			}
			return;
		}
		var obj = root[Object.keys(root)[value-1]];
		if(obj == null) return;
		//use up cost
		if(!Vars.state.rules.infiniteResources){
			var arr = obj.cost;
			var core = Vars.state.teams.get(Vars.player.getTeam()).cores.first();
			for(var i = 0;i<arr.length;i++){
				var item = Vars.content.getByName(ContentType.item, arr[i].item);
				core.items.remove(item, arr[i].amount);
			}
		}
		//tba
		tile.ent().pushRes(value-1);
	},
	canresearch(tile, obj, name){
		if(obj.hasOwnProperty("uses") && Vars.content.getByName(ContentType.item,obj.uses.item) == null) return false;
		if(!obj.hasOwnProperty("cost")){
			if(!obj.hasOwnProperty("parent")) return true;
    }
		else if(!Vars.state.rules.infiniteResources){
			//test whether items are sufficient
			var arr = obj.cost;
			for(var i=0; i<arr.length; i++){
				var item = Vars.content.getByName(ContentType.item, arr[i].item);
				if(item == null) continue;
				var camount = Vars.state.teams.get(Vars.player.getTeam()).cores.first().items.get(item);
				if(camount < arr[i].amount) return false;
			}
		}
		//test whether parent is researched
		if(obj.hasOwnProperty("parent")){
			return this.isresearched(tile, obj.parent);
		}
		return true;
	},
	isresearched(tile,name){
		//tba
		return tile.ent().getRes().indexOf(root[name].n) >- 1;
	},
	makeinfo(tile,obj){
		//ubgradable info
		const infod = new FloatingDialog(Core.bundle.get("info.title"));
		infod.cont.pane(cons(table => {
			table.margin(10);
			//var item=(obj.hasOwnProperty("uses"))?Vars.content.getByName(ContentType.item,obj.uses.item):Vars.content.getByName(ContentType.block,obj.icon);
			table.table(cons(title => {
				if(obj.hasOwnProperty("uses")) title.addImage(Vars.content.getByName(ContentType.item, obj.uses.item).icon(Cicon.xlarge)).size(8 * 6);
				title.add("[accent]" + obj.displayName).padLeft(5);
			}));

			table.row();
			table.addImage().height(3).color(Color.lightGray).pad(15).padLeft(0).padRight(0).fillX();
			table.row();

			table.add(obj.description).padLeft(5).padRight(5).width(400).wrap().fillX();
			table.row();

			table.addImage().height(3).color(Color.lightGray).pad(15).padLeft(0).padRight(0).fillX();
			table.row();

			table.left().defaults().fillX();
			if(obj.hasOwnProperty("uses")){
				table.table(cons(t => {
					t.add("[lightgray]" + Core.bundle.get("skill.uses") + ":[] ");
					t.add(new ItemDisplay(Vars.content.getByName(ContentType.item, obj.uses.item), obj.uses.amount, true)).padRight(5);
					t.left();
				}));
				table.row();
			}
			if(obj.hasOwnProperty("tier")){
				table.table(cons(t => {
					t.add("[lightgray]" + Core.bundle.get("skill.tier") + ":[] " + obj.tier);
					t.left();
				}));
				//table.add(Core.bundle.format("skill.tier")+": "+obj.tier);
				table.row();
			}
			if(obj.hasOwnProperty("duration")){
				table.table(cons(t => {
					t.add("[lightgray]" + Core.bundle.get("skill.duration") + ":[] " + obj.duration + " " + Core.bundle.get("unit.seconds"));
					t.left();
				}));
				table.row();
			}
			if(obj.hasOwnProperty("cooltime")){
				table.table(cons(t => {
					t.add("[lightgray]" + Core.bundle.get("skill.cooltime") + ":[] "+obj.cooltime+" " + Core.bundle.get("unit.seconds"));
					t.left();
				}));
				//table.add(Core.bundle.format("skill.cooltime")+": "+obj.cooltime+" "+Core.bundle.format("unit.seconds"));
				table.row();
			}
			if(obj.hasOwnProperty("healthcost")){
				table.table(cons(t => {
					t.add("[lightgray]" + Core.bundle.get("skill.healthcost") + ":[] "+obj.healthcost + " %");
					t.left();
				}));
				//table.add(Core.bundle.format("skill.cooltime")+": "+obj.cooltime+" "+Core.bundle.format("unit.seconds"));
				table.row();
			}
      if(obj.hasOwnProperty("unfinished")){
				table.table(cons(t => {
					t.add(Core.bundle.get("skill.unfinished"));
					t.left();
				}));
				//table.add(Core.bundle.format("skill.cooltime")+": "+obj.cooltime+" "+Core.bundle.format("unit.seconds"));
				table.row();
			}
		}));
		infod.addCloseButton();
		infod.show();
	},
	makesingle(tile, table, obj, type){
		//makes a single block of the research list
		if(obj.hasOwnProperty("uses") && Vars.content.getByName(ContentType.item, obj.uses.item) == null) return;
		table.table(Styles.black6, cons(t => {
			t.defaults().pad(2).left().top();
			t.margin(14).left();
			t.table(cons(title => {
				title.left();
				//table.add(new ItemDisplay(stack.item, stack.amount, displayName)).padRight(5);
				if(obj.hasOwnProperty("uses")) title.add(new ItemDisplay(Vars.content.getByName(ContentType.item, obj.uses.item), obj.uses.amount, false)).padRight(5);
				title.add(obj.displayName + "\n[accent]" + Core.bundle.get(obj.type) + "[]").growX().wrap();
				//title.add().growX();

				title.addImageButton(Icon.infoCircle, Styles.clearTransi, run(() => {
						this.makeinfo(tile,obj);
				})).size(50);

				if(type != "researched"){
					title.addImageButton(Icon.hammer, Styles.clearTransi, run(() => {
						if(this.canresearch(tile, obj,obj.name)){
							Vars.ui.showConfirm(obj.displayName, Core.bundle.get("research.confirmdialog"), null, run(() => {
								tile.configure(obj.n+1);
								if(tile.ent().skill().skill == "") tile.ent().setSkill(obj.name + "");
								this.makelist(tile);
							}));
						}
						else this.makelist(tile);
					})).size(50).disabled(type != "canres");
				}else{
					var s = tile.ent().skill();
					title.addImageButton((s.skill == obj.name)?Icon.star:Icon.ok, Styles.clearTransi, run(() => {
						tile.ent().setSkill(s.skill == obj.name ? "" : obj.name + "");
						this.makelist(tile);
					})).size(50);
				}
			})).growX().left().padTop(-14).padRight(-14);

			t.row();
			if(obj.hasOwnProperty("shortDesc")){
				t.table(cons(desc => {
					desc.labelWrap("[lightgray]" + obj.shortDesc).growX();
					/*
					if(obj.hasOwnProperty("uses")){
						//t.add("[lightgray]Uses : []");
						var item=Vars.content.getByName(ContentType.item,obj.uses.item);
						desc.add(" [royal]" + obj.uses.amount);
						desc.addImage(item.icon(Cicon.small)).size(8 * 3);
						//t.row();
					}
					*/
				}));
				t.row();
			}

			if(obj.hasOwnProperty("cost") && type != "researched" && type != "noparent"){
				t.table(cons(c => {
					c.add((type != "cannotres") ? "[white]" + Core.bundle.get("research.cost") + ":[]" : "[scarlet]" + Core.bundle.get("research.cost") + ":[]").growX();
					for(var i=0; i<obj.cost.length; i++){
						var item = Vars.content.getByName(ContentType.item, obj.cost[i].item);
						c.add(" [white]" + obj.cost[i].amount);
						c.addImage(item.icon(Cicon.small)).size(8 * 3);
					}
				}));
				t.row();
			}
			if(obj.hasOwnProperty("parent") && type == "noparent"){
				t.table(cons(c => {
					c.add(((type != "noparent") ? "[white]" + Core.bundle.get("research.parent") + ": []":"[scarlet]" + Core.bundle.get("research.parent") + ": []") + root[obj.parent].displayName).growX();
				}));
				t.row();
			}
		})).width(Vars.mobile ? 400 : 470);
		table.row();
	},

});

researchskill.entityType = prov(() => extend(TileEntity , {
	//to reduce checks
	_validated: false,
	isValidated(){
		return this._validated;
	},
	validate(){
		this._validated = true;
	},

	_resarr:[],
	getRes(){
		return this._resarr;
	},
	setRes(a){
		this._resarr = a;
	},
	pushRes(a){
		this._resarr.push(a);
	},
	resetRes(){
		this._resarr = [];
	},

	_enabled:true,
	enabled(){
		return this._enabled;
	},
	disable(){
		this._enabled = false;
	},

	_skill:{
		skill:"",
		lastused:0
	},
	skill(){
		if(Vars.net.client()) return localSkill;
		return this._skill;
	},
	setSkill(a){
		if(Vars.net.client()) localSkill.skill = a;
		this._skill.skill = a;
	},
	useSkill(){
		if(Vars.net.client()) localSkill.lastused = Time.time();
		this._skill.lastused = Time.time();
	},
  skillCooltimeReduce(a){
		if(Vars.net.client()) localSkill.lastused -= a;
		this._skill.lastused -= a;
	},
  skillCooltimeSet(a){
		if(Vars.net.client()) localSkill.lastused = a;
		this._skill.lastused = a;
	},

	write(stream){
		this.super$write(stream);
		stream.writeShort(this._resarr.length);
		for(var i=0; i<this._resarr.length; i++){
			stream.writeShort(this._resarr[i]);
		}
		stream.writeBoolean(this._enabled);
		stream.writeShort(Object.keys(root).indexOf(this._skill.skill));
	},
	read(stream,revision){
		this.super$read(stream,revision);
		this.resetRes();
		var amount=stream.readShort();
		for(var i=0; i<amount; i++){
			this.pushRes(stream.readShort());
		}
		this._enabled=stream.readBoolean();
		this._skill.skill=Object.keys(root)[stream.readShort()];
		this._skill.lastused=0;
	}
}));

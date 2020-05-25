
const color1=Color.valueOf("ffaa5f"); const color2=Color.valueOf("84f491");
const customtree=this.global.customtree;
const root={
	"coalbomb":{
		displayName:"Coal Bomb",
		type:"Attack Skill",
		shortDesc:"Throws a bomb foward.",
		description:"Thows a bomb foward, which explodes when it hits the ground. Low damage but better that nothing.",
		tier:1,
		cooltime:1.5,
		uses:{
			item:"coal",
			amount:3
		},
		cost:[
			{
				item:"lead",
				amount:30
			},
			{
				item:"metaglass",
				amount:90
			}
		]
	},
	"phasetp":{
		displayName:"Quick Escape",
		type:"Movement Skill",
		shortDesc:"Teleports to a near random location.",
		description:"Teleports to a ramdom location selected in a radius of 16 blocks. Useful for dodging bullets or escaping in a hunch.",
		tier:1,
		cooltime:1,
		uses:{
			item:"phase-fabric",
			amount:1
		},
		cost:[
			{
				item:"metaglass",
				amount:45
			},
			{
				item:"silicon",
				amount:100
			},
			{
				item:"phase-fabric",
				amount:50
			}
		]
	}
};

const researchtest = extendContent(Block, "researchtest", {
	canresearch(tile,obj){
		if(!obj.hasOwnProperty("cost")) return true;
		var arr=obj.cost;
		for(var i=0;i<arr.length;i++){
			var item=Vars.content.getByName(ContentType.item,arr[i].item);
			var camount=Vars.state.teams.get(Vars.player.getTeam()).cores.first().items.get(item);
			if(camount<arr[i].amount) return false;
		}
		return true;
	},
	makeinfo(tile,obj){
		const infod = new FloatingDialog(Core.bundle.get("info.title"));
		infod.cont.pane(cons(table=>{
			table.margin(10);
			//var item=(obj.hasOwnProperty("uses"))?Vars.content.getByName(ContentType.item,obj.uses.item):Vars.content.getByName(ContentType.block,obj.icon);
			table.table(cons(title => {
        if(obj.hasOwnProperty("uses")) title.addImage(Vars.content.getByName(ContentType.item,obj.uses.item).icon(Cicon.xlarge)).size(8 * 6);
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
				table.table(cons(t=>{
					t.add("[lightgray]"+Core.bundle.format("skill.uses")+":[] ");
					t.add(new ItemDisplay(Vars.content.getByName(ContentType.item,obj.uses.item), obj.uses.amount, true)).padRight(5);
					t.left();
				}));
        table.row();
			}
			if(obj.hasOwnProperty("tier")){
				table.table(cons(t=>{
					t.add("[lightgray]"+Core.bundle.format("skill.tier")+":[] "+obj.tier);
					t.left();
				}));
				//table.add(Core.bundle.format("skill.tier")+": "+obj.tier);
        table.row();
			}
			if(obj.hasOwnProperty("cooltime")){
				table.table(cons(t=>{
					t.add("[lightgray]"+Core.bundle.format("skill.cooltime")+":[] "+obj.cooltime+" "+Core.bundle.format("unit.seconds"));
					t.left();
				}));
				//table.add(Core.bundle.format("skill.cooltime")+": "+obj.cooltime+" "+Core.bundle.format("unit.seconds"));
        table.row();
			}
			if(obj.hasOwnProperty("healthcost")){
				table.table(cons(t=>{
					t.add("[lightgray]"+Core.bundle.format("skill.healthcost")+":[] "+obj.healthcost+" %");
					t.left();
				}));
				//table.add(Core.bundle.format("skill.cooltime")+": "+obj.cooltime+" "+Core.bundle.format("unit.seconds"));
        table.row();
			}
		}));
		infod.addCloseButton();
		infod.show();
	},
	makesingle(tile,dialog,table,obj,type){
		table.table(Styles.black6, cons(t => {
			t.defaults().pad(2).left().top();
			t.margin(14).left();
			t.table(cons(title => {
				title.left();
				//table.add(new ItemDisplay(stack.item, stack.amount, displayName)).padRight(5);
				if(obj.hasOwnProperty("uses")) title.add(new ItemDisplay(Vars.content.getByName(ContentType.item,obj.uses.item), obj.uses.amount, false)).padRight(5);
				title.add(obj.displayName+ "\n[accent]"+obj.type+"[]").growX().wrap();
				//title.add().growX();

				title.addImageButton(Icon.infoCircle, Styles.clearTransi, run(() => {
						this.makeinfo(tile,obj);
				})).size(50);

				if(type!="researched"){
					title.addImageButton(Icon.hammer, Styles.clearTransi, run(() => {
						if(false){}
						else this.makelist(tile,dialog);
					})).size(50).disabled(type!="canres");
				}
				else{
					title.addImageButton(Icon.ok, Styles.clearTransi, run(() => {
							//
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

			if(obj.hasOwnProperty("cost")&&type!="researched"){
				t.table(cons(c =>{
					c.add((type!="cannotres")?"[white]"+Core.bundle.get("research.cost")+" : []":"[scarlet]"+Core.bundle.get("research.cost")+" : []").growX();
					for(var i=0;i<obj.cost.length;i++){
						var item=Vars.content.getByName(ContentType.item,obj.cost[i].item);
						c.add(" [white]" + obj.cost[i].amount);
						c.addImage(item.icon(Cicon.small)).size(8 * 3);
					}
				}));
				t.row();
			}
		})).width(Vars.mobile ? 430 : 500);
		table.row();
	},
	makelist(tile,dialog){
		dialog.cont.clear();
		dialog.cont.pane(cons(table => {
      table.margin(10).top();
			var uparr=Object.keys(root);
			var canres=[];
			var cannotres=[];
			var researched=[];
			for(var i=0;i<uparr.length;i++){
				if(false){
					researched.push(root[uparr[i]]);
				}
				else if(this.canresearch(tile,root[uparr[i]])){
					canres.push(root[uparr[i]]);
				}
				else{
					cannotres.push(root[uparr[i]]);
				}
			}
			if(researched.length>0){
				table.add(Core.bundle.get("research.researched")).growX().left().color(color2);
				table.row();
				table.addImage().growX().height(3).pad(6).color(color2);
				table.row();
				for(var i=0;i<researched.length;i++){
					this.makesingle(tile,dialog,table,researched[i],"researched");
				}
			}
			if(canres.length>0){
				table.add(Core.bundle.get("research.canres")).growX().left().color(Pal.accent);
				table.row();
				table.addImage().growX().height(3).pad(6).color(Pal.accent);
				table.row();
				for(var i=0;i<canres.length;i++){
					this.makesingle(tile,dialog,table,canres[i],"canres");
				}
			}
			if(cannotres.length>0){
				table.add(Core.bundle.get("research.cannotres")).growX().left().color(Pal.accent);
				table.row();
				table.addImage().growX().height(3).pad(6).color(Pal.accent);
				table.row();
				for(var i=0;i<cannotres.length;i++){
					this.makesingle(tile,dialog,table,cannotres[i],"cannotres");
				}
			}
		}));
	},
	buildConfiguration(tile, table){
		var entity=tile.ent();
		table.addImageButton(Icon.book, run(() => {
      try{
				const dialog = new FloatingDialog(Core.bundle.get("research.title"));
				// Show it
				dialog.addCloseButton();
				this.makelist(tile,dialog);
				dialog.show();
      }
      catch(err){
        print("err:"+err);
      }
    })).size(40);
		//this.super$buildConfiguration(tile,table);
	}
});

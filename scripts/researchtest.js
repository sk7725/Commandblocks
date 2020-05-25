/*
MessageBlockEntity entity = tile.ent();
if(entity != null){
    entity.message = result.toString();
    entity.lines = entity.message.split("\n");
}
*/
const customtree=this.global.customtree;
const root={
	"coalbomb":{
		displayName:"Coal Bomb",
		type:"Attack Skill",
		shortDesc:"Throws a bomb foward.",
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
		displayName:"Quick Escape",
		type:"Movement Skill",
		shortDesc:"Teleports to a near random location. aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
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

const researchtest = extendContent(MessageBlock, "researchtest", {
	canresearch(tile,obj){
		return true;
	},
	makesingle(tile,dialog,table,obj,type){
		table.table(Styles.black6, cons(t => {
			t.defaults().pad(2).left().top();
			t.margin(14).left();
			t.table(cons(title => {
					title.left();
					title.add(obj.displayName+ "\n[accent]"+obj.type+"[]").width(200).wrap();
					title.add().growX();

					title.addImageButton(Icon.infoCircle, Styles.cleari, run(() => {
							//
					})).size(50);

					if(type!="researched"){
						title.addImageTextButton("Start",Icon.hammer, Styles.cleart, run(() => {
								//
						})).height(50).margin(8).width(130).disabled(type!="canres");
					}
			})).growX().left().padTop(-14).padRight(-14);

			t.row();
			if(obj.hasOwnProperty("shortDesc")){
				t.labelWrap("[lightgray]" + obj.shortDesc).growX();
				if(obj.hasOwnProperty("uses")){
					//t.add("[lightgray]Uses : []");
					var item=Vars.content.getByName(ContentType.item,obj.uses.item);
					t.table(cons(items => {
	          items.add("    [royal]" + obj.uses.amount);
	          items.addImage(item.icon(Cicon.small)).size(8 * 3).pad(4);
	        })).left();
					//t.row();
				}
				t.row();
			}

			if(obj.hasOwnProperty("cost")&&type!="researched"){
				t.add((type!="cannotres")?"[white]Research Cost : []":"[scarlet]Research Cost : []");
				for(var i=0;i<obj.cost.length;i++){
					var item=Vars.content.getByName(ContentType.item,obj.cost[i].item);
					t.table(cons(items => {
	          items.add("    [white]" + obj.cost[i].amount);
	          items.addImage(item.icon(Cicon.small)).size(8 * 3).pad(4);
	        })).left();
				}
				t.row();
			}
		})).width(Vars.mobile ? 430 : 500);
		table.row();
	},
	makelist(tile,dialog){
		dialog.cont.pane(cons(table => {
      table.margin(10).top();
			var uparr=Object.keys(root);
			var canres=[];
			var cannotres=[];
			var researched=[];
			for(var i=0;i<uparr.length;i++){
				if(true){
					researched.push(root[uparr[i]]);
				}
				else if(this.canresearch(tile,root[uparr[i]])){
					canres.push(root[uparr[i]]);
				}
				else{
					cannotres.push(root[uparr[i]]);
				}
			}
			if(canres.length>0){
				table.add("Available for Research").growX().left().color(Pal.accent);
				table.row();
				table.addImage().growX().height(3).pad(6).color(Pal.accent);
				table.row();
				for(var i=0;i<canres.length;i++){
					this.makesingle(tile,dialog,table,canres[i],"canres");
				}
			}
			if(cannotres.length>0){
				table.add("Unavailable").growX().left().color(Pal.accent);
				table.row();
				table.addImage().growX().height(3).pad(6).color(Pal.accent);
				table.row();
				for(var i=0;i<cannotres.length;i++){
					this.makesingle(tile,dialog,table,cannotres[i],"cannotres");
				}
			}
			if(researched.length>0){
				table.add("Researched").growX().left().color(Pal.gray);
				table.row();
				table.addImage().growX().height(3).pad(6).color(Pal.gray);
				table.row();
				for(var i=0;i<researched.length;i++){
					this.makesingle(tile,dialog,table,researched[i],"researched");
				}
			}
		}));
	},
	buildConfiguration(tile, table){
		var entity=tile.ent();
		table.addImageButton(Icon.book, run(() => {
      try{
				const dialog = new FloatingDialog("Research");
				// Show it
				this.makelist(tile,dialog);
				dialog.addCloseButton();
				dialog.show();
      }
      catch(err){
        print("err:"+err);
      }
    })).size(40);
		//this.super$buildConfiguration(tile,table);
	}
});

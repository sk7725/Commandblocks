//my take
var filtitem=Items.pyratite;//UI later
var lastitem=null;
const bitcolor1=Color.valueOf("00e5ff");
const bitcolor2=Color.valueOf("ff65db");
const bitcolorspeed=0.5;
const magicrouter=extendContent(Router,"magicrouter",{
  handleItem(item,tile, source){
        var entity = tile.ent();
        this.super$handleItem(tile.ent().getItem()==null?item:tile.ent().getItem(),tile,source);
        /*
        entity.items.add(filtitem, 1);
        entity.lastItem = filtitem;
        entity.time = 0;
        entity.lastInput = source;
        */
    },
    setBars(){
      this.super$setBars();
    //initialize
    //this.bars.remove("liquid");
      this.bars.remove("items");
    },
    buildConfiguration(tile, table){
        var entity = tile.ent();
        ItemSelection.buildTable(table, Vars.content.items(), prov(() => entity.getItem()), cons(item => {
            lastitem = item;
            tile.configure(item == null ? -1 : item.id);
        }));
    },
    configured(tile, player, value){
        tile.ent().setitem(Vars.content.item(value));
    },
    playerPlaced(tile){
      if(lastitem != null){
          tile.configure(lastitem.id);
      }
    },
    draw(tile){
      this.super$draw(tile);
      print("Lerp:"+(Math.sin(Time.time()*bitcolorspeed)+1)/2);
      Draw.color(bitcolor1.lerp(bitcolor2,0);
      Draw.rect(this.animRegion, tile.drawx(), tile.drawy());
      Draw.color();
      var item = tile.ent().getItem();
      if(item == null) return;
      Draw.color(item.color);
      Draw.rect("center", tile.drawx(), tile.drawy());
      Draw.color();
    },
    drawRequestConfig(req, list){
        this.drawRequestConfigCenter(req, Vars.content.item(req.config), "center");
    },
    load(){
      this.super$load();
      this.region=Core.atlas.find(this.name);
      this.animRegion=Core.atlas.find(this.name+"-anim");
    },
});

magicrouter.entityType=prov(() => extendContent(Router.RouterEntity , magicrouter , {
  config(){
    return this._outputItem == null ? -1 : this._outputItem.id;
  },
  write(stream){
    this.super$write(stream);
    stream.writeShort(this._outputItem == null ? -1 : this._outputItem.id);
  },
  read(stream,revision){
    this.super$read(stream,revision);
    this._outputItem=Vars.content.item(stream.readShort());
  },
  _outputItem:null,
  getItem(){
    return this._outputItem;
  },
  setitem(item){
    this._outputItem=item;
  }
}));

//my take
var filtitem=Items.pyratite;//UI later
var lastitem=null;
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
      var item = tile.ent().getItem();
      if(item == null) return;
      Draw.color(item.color);
      Draw.rect("center", tile.drawx(), tile.drawy());
      Draw.color();
    },
    drawRequestConfig(req, list){
        this.drawRequestConfigCenter(req, Vars.content.item(req.config), "center");
    }

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

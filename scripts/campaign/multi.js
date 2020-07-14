//from younggam
const multi = extendContent(GenericCrafter,"multi",{
  _output:[
    [   null                ,null                 ,null],
    [   [["thorium",1],["surge-alloy",2]]                 ,[["slag",5]]         ,null],
    [   [["scrap",1],["plastanium",2],["spore-pod",2]]    ,[["oil",5]]          ,null],
    [   [["silicon",1]]                                   ,null                 ,null],
    [   [["titanium",1]]                 ,null                 ,null],
    [   [["thorium",1],["surge-alloy",3]]                 ,[["slag",3]]         ,null],
    [   [["scrap",1],["plastanium",2],["spore-pod",2]]    ,[["oil",5]]          ,null],
    [   [["silicon",1]]                                   ,null                 ,null],
    [   [["titanium",1]]                 ,null                 ,null],
    [   [["thorium",1],["surge-alloy",3]]                 ,[["slag",5],["oil",4]]         ,null],
  ],
  _input:[
    [   [["sand",1]     ,["lead",2]]             ,[["water",5],["cryofluid",3]]    ,null],
    [   [["coal",1]     ,["sand",1]]             ,[["water",5]]    ,1],
    [   [["pyratite",1] ,["blast-compound",1]]   ,[["water",5]]    ,1],
    [   [["sand",1]]                             ,null             ,null],
    [   [["sand",1]     ,["lead",2]]             ,[["water",5]]    ,null],
    [   [["coal",1]     ,["sand",1]]             ,[["water",5]]    ,1],
    [   [["pyratite",1] ,["blast-compound",1]]   ,[["water",5]]    ,1],
    [   [["sand",1]]     ,null                   ,null],
    [   [["sand",1]     ,["lead",2]]             ,[["water",5]]    ,null],
    [   [["coal",1]     ,["sand",1]]             ,[["water",5]]    ,1],
  ],
  craftTimes:[12,60,72,30,12,60,72,30,12,60],
  enableInv:true,
  output:[],
  input:[],
  itemList:[],
  liquidList:[],
  dumpToggle:true,
  isSameOutput:[],
  hasOutputItem:[],
  inputItemList:[],
  inputLiquidList:[],
  outputItemList:[],
  outputLiquidList:[],
  outputsItems(){
    return this.hasOutputItem;
  },
  //마우스가 위에 있을때 보여주는 창
  drawSelect(tile){
    if(!this.enableInv){
      return;
    }
    var index=0;
    var a=this.itemList.length;
    //decide how much to put in a row
    var c=this.size+2+(this.size+1)%2;
    //align to center and display item icon and quantity
    for(i=0;i<Math.ceil(a/c);i++){
      var b=c;
      if(i==parseInt(a/c)){
        b=a%c;
      }
      for(var j=0;j<b;j++){
        Draw.rect(this.itemList[index].icon(Cicon.xlarge),tile.drawx()-Math.floor(b/2)*8+j*8,tile.drawy()+(this.size+2)*4-8*i,8,8);
        this.drawPlaceText(tile.entity.getItemStat()[index],tile.x-Math.floor(b/2)+j,tile.y-i,true);
        index++;
      }
    }
  },
  //input이 충분한지 보는 자체 함수 newRecipes 필요
  checkinput(tile,i){
    const entity=tile.ent();
    //items
    if(this.input[i][0][0]!=null){
      for(var j=0;j<this.input[i][0].length;j++){
        if(entity.items.get(this.input[i][0][j].item)<this.input[i][0][j].amount) return true;
      }
    }
    //liquids
    if(this.input[i][1][0]!=null){
      for(var j=0;j<this.input[i][1].length;j++){
        if(entity.liquids.get(this.input[i][1][j].liquid)<this.input[i][1][j].amount) return true;
      }
    }
    return false;
  },
  //custom function that checks space for item and liquid
  checkoutput(tile,i){
    const entity=tile.ent();
    //items
    if(this.output[i][0][0]!=null){
      for(var j=0;j<this.output[i][0].length;j++){
        if(entity.items.get(this.output[i][0][j].item)+this.output[i][0][j].amount>this.itemCapacity) return true;
      }
    }
    //liquids
    if(this.output[i][1][0]!=null){
      for(var j=0;j<this.output[i][1].length;j++){
        if(entity.liquids.get(this.output[i][1][j].liquid)+this.output[i][1][j].amount>this.liquidCapacity) return true;
      }
    }
    return false;
  },
  //custom function that decides whether to produce
  checkCond(tile,i){
    const entity=tile.ent();
    if(entity.getToggle()==i){
      if(this.hasPower==true&&entity.power.status<=0&&this.input[i][2]!=null){
        return false;
      }
      else if(this.checkinput(tile,i)){
        return false;
      }
      //check power
      else if(this.checkoutput(tile,i)){
        return false;
      }else{
        return true;
      }
    }
  },
  //custom function for consumeing items and liquids
  customCons(tile,i){
    const entity=tile.ent();
    entity.saveCond(this.checkCond(tile,i));
    if(this.checkCond(tile,i)){
      //do produce
      if(entity.getProgress(i)!=0&&entity.getProgress(i)!=null){
        entity.progress=entity.getProgress(i);
        entity.saveProgress(i,0);
      }
      entity.progress+=this.getProgressIncrease(entity,this.craftTimes[i]);
      entity.totalProgress+=entity.delta();
      entity.warmup=Mathf.lerpDelta(entity.warmup,1,0.02);

      if(Mathf.chance(Time.delta()*this.updateEffectChance)){
        Effects.effect(this.updateEffect,entity.x+Mathf.range(this.size*4),entity.y+Mathf.range(this.size*4));
      }

    }else{
      entity.warmup=Mathf.lerp(entity.warmup,0,0.02);
    }
  },
  //decides which item to accept
  acceptItem(item,tile,source){
    const entity=tile.ent();
    if(entity==null||entity.items==null) return false;
    if(entity.items.get(item)>=this.itemCapacity) return false;
    for(var i in this.inputItemList){
      if(item==this.inputItemList[i]){
        return true;
      }
    }
    return false;
  },
  //decides which liquid to accept
  acceptLiquid(tile,source,liquid,amount){
    const entity=tile.ent();
    if(entity==null||entity.liquids==null) return false;
    if(entity.liquids.get(liquid)+amount>this.liquidCapacity) return false;
    for(var i in this.inputLiquidList){
      if(liquid==this.inputLiquidList[i]){
        return true;
      }
    }
    return false;
  },
  //displays whether input is enough
  displayConsumption(tile,table){
    const entity=tile.ent();
    var z=0;
    var y=0;
    var x=0;
    table.left();
    //input 아이템, 액체 그림 띄우기
    for(var i=0;i<this.input.length;i++){
      //아이템
      if(this.input[i][0][0]!=null){
        for(var j=0;j<this.input[i][0].length;j++){
          (function (i,j,input){
          var item=input[i][0][j].item
          var amount=input[i][0][j].amount
          table.add(new ReqImage(new ItemImage(item.icon(Cicon.medium),amount),boolp(()=>entity!=null&&entity.items.has(item,amount)&&entity.items!=null))).size(8*4);
        })(i,j,this.input)
        }
        z+=this.input[i][0].length;
      }
      //액체
      if(this.input[i][1][0]!=null){
        for(var l=0;l<this.input[i][1].length;l++){
          (function (i,l,input){
            var liquid=input[i][1][l].liquid;
            var amount=input[i][1][l].amount;
            table.add(new ReqImage(new ItemImage(liquid.icon(Cicon.medium),amount),boolp(()=>entity!=null&&entity.liquids.get(liquid)>amount&&entity.liquids!=null))).size(8*4);
          })(i,l,this.input)
        }
        z+=this.input[i][1].length;
      }
      //아이템 유뮤 바에서 레시피 구분및 자동 줄바꿈을 위해 정리된 input item 필요.
      if(z==0){
        table.addImage(Icon.cancel).size(8*4);
        x+=1;
      }
      if(this.input[i+1]!=null){
        if(this.input[i+1][0][0]!=null){
          y+=this.input[i+1][0].length;
        }
        if(this.input[i+1][1][0]!=null){
          y+=this.input[i+1][1].length;
        }
        x+=z;
        if(x+y<=7&&y!=0){
          table.addImage(Icon.pause).size(8*4);
          x+=1;
        }else if(x+y<=6&&y==0){
          table.addImage(Icon.pause).size(8*4);
          x+=1;
        }else{
          table.row();
          x=0;
        }
      }
      y=0;
      z=0;
    }
  },
  //for dislpying info
  setStats(){
    this.super$setStats();
    this.stats.remove(BlockStat.powerUse);
    this.stats.remove(BlockStat.productionTime);
    //crafTimes
    for(var i=0;i<this.craftTimes.length;i++){
      this.stats.add(BlockStat.productionTime,i+1,StatUnit.none);
      this.stats.add(BlockStat.productionTime,this.craftTimes[i]/60,StatUnit.seconds);
    }
    //output
    for(var j=0;j<this.output.length;j++){
      this.stats.add(BlockStat.output,j+1,StatUnit.none);
      //items
      if(this.output[j][0][0]!=null){
        for(var jj=0;jj<this.output[j][0].length;jj++){
          this.stats.add(BlockStat.output,this.output[j][0][jj]);
        }
      }
      //liquids
      if(this.output[j][1][0]!=null){
        for(var jj=0;jj<this.output[j][1].length;jj++){
          this.stats.add(BlockStat.output,this.output[j][1][jj].liquid,this.output[j][1][jj].amount,false);
        }
      }
    }
    //input
    for(var k=0;k<this.input.length;k++){
      this.stats.add(BlockStat.input,k+1,StatUnit.none);
      //items
      if(this.input[k][0][0]!=null){
        for(var l=0;l<this.input[k][0].length;l++){
          this.stats.add(BlockStat.input,this.input[k][0][l]);
        }
      }
      //liquids
      if(this.input[k][1][0]!=null){
        for(var l=0;l<this.input[k][1].length;l++){
          this.stats.add(BlockStat.input,this.input[k][1][l].liquid,this.input[k][1][l].amount,false);
        }
      }
    }
    var powerBarI=false;
    var powerBarO=false;
    //decdes whether show poweroutput bar
    for(var i=0;i<this.output.length;i++){
      if(this.output[i][2]!=null){
        powerBarO|=true;
      }
    }
    //decides whether show powerUse bar
    for(var i=0;i<this.input.length;i++){
      if(this.input[i][2]!=null){
        powerBarI|=true;
      }
    }
    //poweroutput
    if(powerBarO){
      for(var ii=0;ii<this.output.length;ii++){
        if(this.output[ii][2]!=null){
          this.stats.add(BlockStat.basePowerGeneration,ii+1,StatUnit.none);
          this.stats.add(BlockStat.basePowerGeneration,this.output[ii][2]*60,StatUnit.powerSecond);
        }else{
          this.stats.add(BlockStat.basePowerGeneration,ii+1,StatUnit.none);
          this.stats.add(BlockStat.basePowerGeneration,0,StatUnit.powerSecond);
        }
      }
    }
    if(powerBarI){
      //powerconsume
      for(var l=0;l<this.input.length;l++){
        if(this.input[l][2]!=null){
          this.stats.add(BlockStat.powerUse,l+1,StatUnit.none);
          this.stats.add(BlockStat.powerUse,this.input[l][2]*60,StatUnit.powerSecond);
        }else{
          this.stats.add(BlockStat.powerUse,l+1,StatUnit.none);
          this.stats.add(BlockStat.powerUse,0,StatUnit.powerSecond);
        }
      }
    }
  },
  //for displaying bars
  setBars(){
    this.super$setBars();
    //initialize
    this.bars.remove("liquid");
    this.bars.remove("items");
    var powerBarI=false;
    var powerBarO=false;
    //decdes whether show poweroutput bar
    for(var i=0;i<this.output.length;i++){
      if(this.output[i][2]!=null){
        powerBarO|=true;
      }
    }
    //decides whether show powerUse bar
    for(var i=0;i<this.input.length;i++){
      if(this.input[i][2]!=null){
        powerBarI|=true;
      }
    }
    if(!powerBarI){
      this.bars.remove("power");
    }
    if(powerBarO){
      this.outputsPower=true;
      this.bars.add("poweroutput",func(entity=>
        new Bar(prov(()=>Core.bundle.format("bar.poweroutput",entity.block.getPowerProduction(entity.tile)*60*entity.timeScale)),prov(()=>Pal.powerBar),floatp(()=>entity!=null?entity.getPowerStat():0))
      ));
    }else if(!powerBarI){
      this.outputsPower=true;
    }else{
      this.outputsPower=false;
    }
    //show current Items amount
    if(this.itemList[0]!=null){
      (function(itemCapacity,itemList,bars){
        bars.add("items",func(entity=>
          new Bar(prov(()=>Core.bundle.format("bar.items",entity.getItemStat().join('/')))
          ,prov(()=>Pal.items)
          ,floatp(()=>entity.items.total()/(itemCapacity*itemList.length)))
        ));
      })(this.itemCapacity,this.itemList,this.bars)
    }
    //display every Liquids that can contain
    if(this.liquidList[0]!=null){
      for(var i=0;i<this.liquidList.length;i++){
        (function(i,liquidList,liquidCapacity,bars){
          bars.add("liquid"+i,func(entity=>
            new Bar(prov(()=>liquidList[i].localizedName),prov(()=>liquidList[i].barColor()),floatp(()=>entity.liquids.get(liquidList[i])/liquidCapacity))
          ));
        })(i,this.liquidList,this.liquidCapacity,this.bars)
      }
    }
  },
  //for progress
  getProgressIncrease(entity,baseTime){
    //when use power
    if(this.input[entity.getToggle()][2]!=null){
      return this.super$getProgressIncrease(entity,baseTime);
    }
    //
    else{
      return 1/baseTime*entity.delta();
    }
  },
  //acutal power prodcution
  getPowerProduction(tile){
    const entity=tile.ent();
    var i=entity.getToggle();
    if(i<0||i>=this.input.length) return 0;
    if(this.output[i][2]!=null&&entity.getCond()){
      //when use power
      if(this.input[i][2]!=null){
        entity.setPowerStat(entity.efficiency());
        return this.output[i][2]*entity.efficiency();
      }
      //
      else{
        entity.setPowerStat(1);
        return this.output[i][2];
      }
    }
    entity.setPowerStat(0);
    return 0;
  },
  //custom function that add or remove items when progress is ongoing.
  customProd(tile,i){
    const entity=tile.ent();
    //consume items
    if(this.input[i][0][0]!=null){
      for(var k=0;k<this.input[i][0].length;k++){
        entity.items.remove(this.input[i][0][k]);
      }
    }
    //consume liquids
    if(this.input[i][1][0]!=null){
      for(var j=0;j<this.input[i][1].length;j++){
        entity.liquids.remove(this.input[i][1][j].liquid,this.input[i][1][j].amount);
      }
    }
    //produce items
    if(this.output[i][0][0]!=null){
      for(var a=0;a<this.output[i][0].length;a++){
        this.useContent(tile,this.output[i][0][a].item);
        for(var aa=0;aa<this.output[i][0][a].amount;aa++){
          this.offloadNear(tile,this.output[i][0][a].item);
        }
      }
    }
    //produce liquids
    if(this.output[i][1][0]!=null){
      for(var j=0;j<this.output[i][1].length;j++){
        this.useContent(tile,this.output[i][1][j].liquid);
        this.handleLiquid(tile,tile,this.output[i][1][j].liquid,Math.min(this.output[i][1][j].amount,this.liquidCapacity-entity.liquids.get(this.output[i][1][j].liquid)));
      }
    }
    Effects.effect(this.craftEffect,tile.drawx(),tile.drawy());
    entity.progress=0;
  },
  shouldIdleSound(tile){
    return tile.entity.getCond()
  },
  //update. called every tick
  update(tile){
    const entity=tile.ent();
    //to not rewrite whole update
    if(typeof this["customUpdate"]==="function") this.customUpdate(tile);
    for(var i=0;i<this.itemList.length;i++){
      entity.getItemStat()[i]=entity.items.get(this.itemList[i]);
    }
    //calls customCons and customProd
    if(entity.getToggle()>=0&&entity.getToggle()<this.input.length) {
      this.customCons(tile,entity.getToggle());
      if(entity.progress>=1) this.customProd(tile,entity.getToggle());
    }
    //dump
    var itemTimer=entity.timer.get(this.timerDump,this.dumpTime);
    //when normal button checked
    if(entity.getToggle()!=this.input.length){
      if(this.dumpToggle&&entity.getToggle()!=-1){
        if(itemTimer&&this.output[entity.getToggle()][0][0]!=null){
          for(var ij=0;ij<this.output[entity.getToggle()][0].length;ij++){
            if(entity.items.get(this.output[entity.getToggle()][0][ij].item)>0){
              this.tryDump(tile,this.output[entity.getToggle()][0][ij].item);
              break;
            }
          }
        }
        if(this.output[entity.getToggle()][1][0]!=null){
          for(var i=0;i<this.output[entity.getToggle()][1].length;i++){
            if(entity.liquids.get(this.output[entity.getToggle()][1][i].liquid)>0.001){
              this.tryDumpLiquid(tile,this.output[entity.getToggle()][1][i].liquid);
              break;
            }
          }
        }
      }else{
        if(itemTimer){
          for(var i in this.outputItemList){
            if(entity.items.get(this.outputItemList[i])>0){
              this.tryDump(tile,this.outputItemList[i]);
              break;
            }
          }
        }
        for(var i in this.outputLiquidList){
          if(entity.liquids.get(this.outputLiquidList[i])>0.001){
            this.tryDumpLiquid(tile,this.outputLiquidList[i]);
            break;
          }
        }
      }
    }
    //when trash button is checked. dump everything if possible/
    else if(entity.getToggle()==this.input.length){
      //dump items and liquids even input
      if(entity.timer.get(this.timerDump,this.dumpTime)&&entity.items.total()>0){
        this.tryDump(tile);
      }
      if(entity.liquids.total()>0.01){
        for(var i=0;i<this.liquidList.length;i++){
          if(entity.liquids.get(this.liquidList[i])>0.01){
            this.tryDumpLiquid(tile,this.liquidList[i]);
            break;
          }
        }
      }
    }
  },
  //initialize
  init(){
    for(var i=0;i<this._output.length;i++){
      if(this.output[i]==null)  this.output[i]=[];
      this.output[i][2]=this._output[i][2];
    }
    for(var i=0;i<this._input.length;i++){
      if(this.input[i]==null) this.input[i]=[];
      this.input[i][2]=this._input[i][2];
    }
    //exlude null things. change output and input to ItemStack, LiquidStack
    for(var i=0;i<this._output.length;i++){
      this.output[i][0]=[];
      this.output[i][1]=[];
      //ItemStack
      if(this._output[i][0]!=null){
        var index=0;
        for(var j=0;j<this._output[i][0].length;j++){
          if(this._output[i][0][j]!=null){
            this.outputItemList[Vars.content.getByName(ContentType.item,this._output[i][0][j][0]).id]=Vars.content.getByName(ContentType.item,this._output[i][0][j][0]);
            this.output[i][0][index]=new ItemStack(Vars.content.getByName(ContentType.item,this._output[i][0][j][0]),this._output[i][0][j][1]);
            index++;
          }
        }
      }
      //LiquidStack
      if(this._output[i][1]!=null){
        var index=0;
        for(var j=0;j<this._output[i][1].length;j++){
          if(this._output[i][1][j]!=null){
            this.outputLiquidList[Vars.content.getByName(ContentType.liquid,this._output[i][1][j][0]).id]=Vars.content.getByName(ContentType.liquid,this._output[i][1][j][0]);
            this.output[i][1][index]=new LiquidStack(Vars.content.getByName(ContentType.liquid,this._output[i][1][j][0]),this._output[i][1][j][1]);
            index++;
          }
        }
      }
    }
    for(var i=0;i<this._input.length;i++){
      this.input[i][0]=[];
      this.input[i][1]=[];
      //ItemStack
      if(this._input[i][0]!=null){
        var index=0;
        for(var j=0;j<this._input[i][0].length;j++){
          if(this._input[i][0][j]!=null){
            this.input[i][0][index]=new ItemStack(Vars.content.getByName(ContentType.item,this._input[i][0][j][0]),this._input[i][0][j][1]);
            this.inputItemList[Vars.content.getByName(ContentType.item,this._input[i][0][j][0]).id]=Vars.content.getByName(ContentType.item,this._input[i][0][j][0]);
            index++;
          }
        }
      }
      //LiquidStack
      if(this._input[i][1]!=null){
        var index=0;
        for(var j=0;j<this._input[i][1].length;j++){
          if(this._input[i][1][j]!=null){
            this.input[i][1][index]=new LiquidStack(Vars.content.getByName(ContentType.liquid,this._input[i][1][j][0]),this._input[i][1][j][1]);
            this.inputLiquidList[Vars.content.getByName(ContentType.liquid,this._input[i][1][j][0]).id]=Vars.content.getByName(ContentType.liquid,this._input[i][1][j][0]);
            index++;
          }
        }
      }
    }
    //exclude overlapped things to set list of items
    var _itemList=[];
    var indexI=0;
    //output item
    for(var i=0;i<this.output.length;i++){
      if(this.output[i][0][0]!=null){
        for(var j=0;j<this.output[i][0].length;j++){
          _itemList[indexI]=this.output[i][0][j].item;
          indexI++;
        }
      }
    }
    //input item
    for(var i=0;i<this.input.length;i++){
      if(this.input[i][0][0]!=null){
        for(var j=0;j<this.input[i][0].length;j++){
          _itemList[indexI]=this.input[i][0][j].item;
          indexI++;
        }
      }
    }
    var indexI_=0;
    for(var i=0;i<_itemList.length;i++){
      if(_itemList.indexOf(_itemList[i])!=i){

      }else{
        this.itemList[indexI_]=_itemList[i];
        indexI_++;
      }
    }
    //exclude overlapped things to set list of liquids
    var _liquidList=[];
    var indexL=0;
    //output liquid
    for(var i=0;i<this.output.length;i++){
      if(this.output[i][1][0]!=null){
        for(var j=0;j<this.output[i][1].length;j++){
          _liquidList[indexL]=this.output[i][1][j].liquid;
          indexL++;
        }
      }
    }
    //input liquid
    for(var i=0;i<this.input.length;i++){
      if(this.input[i][1][0]!=null){
        for(var j=0;j<this.input[i][1].length;j++){
          _liquidList[indexL]=this.input[i][1][j].liquid;
          indexL++;
        }
      }
    }
    var indexL_=0;
    for(var i=0;i<_liquidList.length;i++){
      if(_liquidList.indexOf(_liquidList[i])!=i){

      }else{
        this.liquidList[indexL_]=_liquidList[i];
        indexL_++;
      }
    }
    var sortO=[];
    //for buttons. find outputs that actually same
    for(var i=0;i<this._output.length;i++){
      var index=0;
      if(sortO[i]==null) sortO[i]=[];
      if(this._output[i][0]!=null){
        for(var j=0;j<this._output[i][0].length;j++){
          if(this._output[i][0][j]!=null){
            sortO[i][index]=this._output[i][0][j].join('');
            index++;
          }
        }
      }
      if(this._output[i][1]!=null){
        for(var j=0;j<this._output[i][1].length;j++){
          if(this._output[i][1][j]!=null){
            sortO[i][index]=this._output[i][1][j].join('');
            index++;
          }
        }
      }
      sortO[i][index]=this._output[i][2];
    }
    var c=[];
    for(var k=0;k<sortO.length;k++){
      if(c[k]==null){
        c[k]=[];
        for(var p=0;p<sortO.length;p++){
          c[k][p]=true;
        }
      }
      for(var l=0;l<sortO[k].length;l++){
        for(var n=0;n<sortO.length;n++){
          var r=false;
          for(var q=0;q<sortO[n].length;q++){
            r|=(sortO[n][q]==sortO[k][l]&&sortO[n].length==sortO[k].length);
          }
          c[k][n]&=r
        }
      }
    }
    var e=[];
    for(var m=0;m<sortO.length;m++){
      if(sortO[m][0]==null){
        e[m]=true;
      }else{
        e[m]=false;
      }
    }
    for(var m=0;m<sortO.length;m++){
      if(sortO[m][0]==null){
        c[m]=e;
      }
    }
    this.isSameOutput=c;
    this.super$init();
    var bools=false;
    for(var i=0;i<this.output.length;i++) bools|=this.output[i][1][0]!=null;
    if(bools) this.outputsLiquid=true;
    var hasOutputItem=false;
    for(var i=0;i<this.output.length;i++) hasOutputItem|=this.output[i][0][0]!=null;
    this.hasOutputItem=hasOutputItem;
  },
  //custom function that decides which button should be checked.
  setCheckButton(a,z,tile){
    const entity=tile.ent();
    if(a==-1){
      return false;
    }
    //check trash buttosn
    else if(a==this.output.length&&z==this.output.length){
      return true;
    }else if(a==this.output.length&&z!=this.output.length){
      return false;
    }
    //check normal buttons
    var d=[];
    for(var j=0;j<this.isSameOutput[a].length;j++){
      if(this.isSameOutput[a][j]==true){
        d[j]=j;
      }else{
        d[j]=-10;
      }
    }
    if(d.includes(z)&&d[z]!=-10&&d[z]!=null){
      return true;
    }else{
      return false;
    }
  },
  //show config menu
  buildConfiguration(tile,table){
    const entity=tile.ent();
    var group=new ButtonGroup();
    group.setMinCheckCount(0);
    group.setMaxCheckCount(-1);
    var output=this.output;
    for(var i=0;i<this.input.length+1;i++){
      //representative images
      (function (i,tile){
        var button=table.addImageButton(Tex.whiteui,Styles.clearToggleTransi,40,run(()=>tile.configure(button.isChecked()?i:-1))).group(group).get();
        button.getStyle().imageUp=new TextureRegionDrawable(i!=output.length?output[i][0][0]!=null?output[i][0][0].item.icon(Cicon.small):output[i][1][0]!=null?output[i][1][0].liquid.icon(Cicon.small):output[i][2]!=null?Icon.power:Icon.cancel:Icon.trash);
        button.update(run(()=>button.setChecked(typeof tile.block()["setCheckButton"]==="function"?tile.block().setCheckButton(entity.getToggle(),i,tile):false)));
      })(i,tile)
    }
    table.row();
    //other images
    var lengths=[];
    var max=0;
    for(var l=0;l<this.output.length;l++){
      if(lengths[l]==null) lengths[l]=[0,0,0];
      if(this.output[l][0][0]!=null) lengths[l][0]=this.output[l][0].length-1;
      if(this.output[l][1][0]!=null){
        if(this.output[l][0][0]!=null) lengths[l][1]=this.output[l][1].length;
        else lengths[l][1]=this.output[l][1].length-1;
      }
      if(this.output[l][2]!=null) lengths[l][2]=1;
    }
    for(var i=0;i<lengths.length;i++){
      max=max<lengths[i][0]+lengths[i][1]+lengths[i][2]?lengths[i][0]+lengths[i][1]+lengths[i][2]:max;
    }
    for(var i=0;i<max;i++){
      for(var j=0;j<this.output.length;j++){
        if(lengths[j][0]>0){
          table.addImage(this.output[j][0][this.output[j][0].length-lengths[j][0]].item.icon(Cicon.small));
          lengths[j][0]--;
        }else if(lengths[j][1]>0){
          table.addImage(this.output[j][1][this.output[j][1].length-lengths[j][1]].liquid.icon(Cicon.small));
          lengths[j][1]--;
        }else if(lengths[j][2]>0){
          if(output[j][0][0]!=null||output[j][1][0]!=null){
            table.addImage(Icon.power);
          }else table.addImage(Tex.clear);
          lengths[j][2]--;
        }else{
          table.addImage(Tex.clear);
        }
      }
      table.row();
    }
  },
  //save which buttons is pressed
  configured(tile,player,value){
    const entity=tile.ent();
    //save current progress.
    if(entity.getToggle()>=0&&entity.getToggle()<this.input.length){
      entity.saveProgress(entity.getToggle(),entity.progress);
    }
    if(value==-1||value==this.input.length) entity.saveCond(false);
    entity.progress=0;
    entity.modifyToggle(value);
  }
});
//전력 소모 실제
multi.consumes.add(extend(ConsumePower,{
  requestedPower(entity){
    if(entity==null){
      return 0;
    }
    for(var i=0;i<multi.input.length;i++){
      if(entity.getToggle()==i&&multi.input[i][2]!=null&&entity.getCond()){
        return multi.input[i][2];
      }
    }
    return 0;
  }
}));
//엔티티 확장
multi.entityType=prov(()=>extend(GenericCrafter.GenericCrafterEntity,{
    //버튼 눌린거 저장
    //버튼 눌린거 저장
    modifyToggle(a){
      this._toggle=a;
    },
    getToggle(){
      return this._toggle;
    },
    _toggle:0,
    //버튼 바꼈을때 진행상황 저장
    saveProgress(c,d){
      this._progressArr[c]=d;
    },
    getProgress(e){
      return this._progressArr[e];
    },
    _progressArr:[],
    //현재 생산 중인지 저장
    saveCond(f){
      this._cond=f;
    },
    getCond(){
      return this._cond;
    },
    _cond:false,
    //전력 출력 바 용 현재 전력출력상황
    setPowerStat(g){
      this._powerStat=g;
    },
    getPowerStat(){
      return this._powerStat;
    },
    _powerStat:0,
    //현재 각 아이템 수량
    getItemStat(){
      return this._itemStat;
    },
    _itemStat:[],
    //
    config(){
      return this._toggle;
    },
    write(stream){
      this.super$write(stream);
      stream.writeShort(this._toggle);
    },
    read(stream,revision){
      this.super$read(stream,revision);
      this._toggle=stream.readShort();
    }
}));
//별개 값
multi.configurable=true;
multi.hasItems=true;
multi.hasLiquids=true;
multi.hasPower=true;

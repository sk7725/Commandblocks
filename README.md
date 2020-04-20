# Commandblocks
Mindustry Command Block Mod(MCBM)
This mod adds Minecraft-like Command Blocks, along with other blocks.
This is currently in development.

## Blocks
+ Command Block   
Executes command once when power requirements are met.   
+ Chained Command Block   
Executes command when the command block it is facing away from has executed successfully.   
It will execute one tick after the command block it is facing away from.   
+ Repeating Command Block   
Executes command every tick when power requirements are met.   
+ Unit Command Block   
Executes command as an unit, for the unit stepping on this block.   
The unit has to be on this block and not fly.   
+ Unit Tagger   
Remembers the last unit that stepped on this tile, using its message as the tag.     
The unit has to be on this block and not fly, and only a single unit will be tagged.   
If the block is removed, the tagged unit will be untagged.    
For more information on tags, refer to `Target Selectors`.    
+ Position Reader   
Gets the x and y coordinates where this block is placed.   
```
Pos: ( tile.x , tile.y ) / Rot: tile.rotation()
```
+ Tile Reader   
Gets the information of the tile this block is facing when this block is placed.   
```
floor.name:block.name:overlay[x,y] entity=entity.getClass():getTeam()
```
+ Tile Entity Reader   
Gets the information of the tile entity this block is facing when this block is placed.   
Is empty if no tile entity is found.   
```
TileEntity{tile=tile, health=health}
```

## Commands
Commands will fail to work when an error happens, params are invalid , or requirements below are not made.   
Starting the command with a / is optional.   
Some params are optional.   

### /say string:text  
In multiplayer, sends text to all players.

### /title pos:x pos:y
Emits text to all players.
  + /title pos:x pos:y top|world int:duration string:text   
    - top   
    shows the text as a popup at the top of the screen.   
    - world   
    Shows the text as a popup at x,y.   
  + /title pos:x pos:y string:functionname (arguments)    
  Runs an UI function called functionname that can show text in various forms.   
  Refer [here](https://github.com/Anuken/Mindustry/blob/master/core/src/mindustry/core/UI.java) for the list of functions.   

### /overwrite string:text  
Overwrites this command block's content to text.

### /setblock pos:x pos:y string:block (int:rotation) (int:team) (replace|keep|build|force) 
Sets the tile at x,y to the specified block.  
Rotation should be between 0 and 3, default is 0.  
Team should be -1 and 255, default is -1. When team is -1, the team is set to the executor's team.  
Fails if the previous block is already the same as the current block.  
  - replace
  destroys the previous block, and sets a new block. (default)
  - keep
  only sets the block if previous block is Air.
  - build
  destroys the previous block, and sets a new block, as if a player built it.
  - force
  sets a new block. crashes the game if the previous block is a tile entity.

### /execute 
Executes a command from another tile or unit's perspective.  
Fails if the executed command fails, or the tile or entity is not found.   
`execute` is optional, one can start a command with `at/as`
  + /execute at pos:x pos:y string:command   
    Executes as a tile at x,y.   
  + /execute as target:target string:command   
    Executes as a target.
  
### /f(/function) string:functionname (arguments)
Runs a function of the executor called functionname. Fails if the executor is neither a tile nor an unit.     
Refer [here](https://github.com/Anuken/Mindustry/blob/master/core/src/mindustry/world/Tile.java) for the list of functions (if executor is a Tile), or [here](https://github.com/Anuken/Mindustry/blob/master/core/src/mindustry/entities/type/Unit.java) (if executor is an Unit).   
Can only be used inside an /execute.   
  + Example   
  ```
  execute at ~ ~2 function setTeam team:5
  //sets the team of the tile 2 blocks to the north of the executor to 5.
  //calls setTeam( Team.get(5) ) of the tile 2 blocks to the north of the executor.
  ```
### /fb(/functionblock) string:functionname (arguments)
Runs a function of the block of the executor called functionname. Fails if the executor is not a tile.   
Refer [here](https://github.com/Anuken/Mindustry/blob/master/core/src/mindustry/world/Block.java) or [here](https://github.com/Anuken/Mindustry/blob/master/core/src/mindustry/world/BlockStorage.java) for the list of functions.   
Can only be used inside an /execute.   
  + Example   
  ```
  execute at ~ ~2 functionblock handleStack item:copper 5 tile:~,~ js:null
  //gives 5 copper to the block 2 blocks to the north of the executor.
  ```

### /fe(/functionent) string:functionname (arguments)
Runs a function of the tile entity of the executor called functionname. Fails if the executor is not a tile.   
Refer [here](https://github.com/Anuken/Mindustry/blob/master/core/src/mindustry/entities/type/TileEntity.java) for the list of functions.   
Can only be used inside an /execute.   
  + Example   
  ```
  execute at ~ ~2 functionent damage 50
  //damages the tile 2 blocks to the north of the executor by 50.
  ```

### /gamerule string:rulename boolean:state   
Sets the gamerule. Fails if no such gamerule exists.   
  - commandBlockOutput   
    whether to log command failures in multiplayer chat.   
  - commandBlockTitle   
    whether to log command failures as a popup.   

### /fx(/particle) string:effect (pos:x pos:y) (string:color)   
Plays particle effects on the given position. Fails if coordinates are below 0.   

### /give string:item (int:amount)
Gives the executor an amount of an item.   
If the executor is a tile, amount may be negative.   
Fails if amount is negative and executor is not a tile, or amount is negative and less than 1 items were removed.   

### /clear      
Clears the executor of the item. Fails if the executor does not have an inventory.   
  - /clear string:item   
    if the executor is a tile. Fails if less then 1 items are removed.   
  - /clear  
    if the executor is an unit.   

## Tilde Notation   
Using ~ before a number for a coordinate will get the coordinate relative to the executor.   
All coordinates are based on the tile coordinate, not the world coordinate.    

## Refer a Type   
For a param that is not a string/int, the following syntax may be used for some commands.   
`tile:x,y` `team:teamnumber` `block|floor|item|fx|liquid|bullet:name` `seffect:statuseffectname` `target:targetselector` `js:null|undefined|this`

## Target Selectors   
`@s` The executor of the command.
`@sb` The block of the executor of the command.
`@se` The tile entity of the executor of the command.
`@a` The player.
`@t` Is a `this` of the origin command block. Use only when you know what you are doing.   
`@c[tagname]` A cache of the unit tagged by the Unit Tagger.   
`x,y` The tile at the position.   
`@p` WIP!   

## Block List
This is the full list of blocks, as of version 104.
  ```
  //environment
  air, spawn, deepwater, water, taintedWater, tar, stone, craters, charr, sand, darksand, ice, snow, darksandTaintedWater,
  holostone, rocks, sporerocks, icerocks, cliffs, sporePine, snowPine, pine, shrubs, whiteTree, whiteTreeDead, sporeCluster,
  iceSnow, sandWater, darksandWater, duneRocks, sandRocks, moss, sporeMoss, shale, shaleRocks, shaleBoulder, sandBoulder, grass, salt,
  metalFloor, metalFloorDamaged, metalFloor2, metalFloor3, metalFloor5, ignarock, magmarock, hotrock, snowrocks, rock, snowrock, saltRocks,
  darkPanel1, darkPanel2, darkPanel3, darkPanel4, darkPanel5, darkPanel6, darkMetal,
  pebbles, tendrils,

  //ores
  oreCopper, oreLead, oreScrap, oreCoal, oreTitanium, oreThorium,

  //crafting
  siliconSmelter, kiln, graphitePress, plastaniumCompressor, multiPress, phaseWeaver, surgeSmelter, pyratiteMixer, blastMixer, cryofluidMixer,
  melter, separator, sporePress, pulverizer, incinerator, coalCentrifuge,

  //sandbox
  powerSource, powerVoid, itemSource, itemVoid, liquidSource, liquidVoid, message, illuminator,

  //defense
  copperWall, copperWallLarge, titaniumWall, titaniumWallLarge, plastaniumWall, plastaniumWallLarge, thoriumWall, thoriumWallLarge, door, doorLarge,
  phaseWall, phaseWallLarge, surgeWall, surgeWallLarge, mender, mendProjector, overdriveProjector, forceProjector, shockMine,
  scrapWall, scrapWallLarge, scrapWallHuge, scrapWallGigantic, thruster, //ok, these names are getting ridiculous, but at least I don't have humongous walls yet

  //transport
  conveyor, titaniumConveyor, armoredConveyor, distributor, junction, itemBridge, phaseConveyor, sorter, invertedSorter, router, overflowGate, massDriver,

  //liquids
  mechanicalPump, rotaryPump, thermalPump, conduit, pulseConduit, platedConduit, liquidRouter, liquidTank, liquidJunction, bridgeConduit, phaseConduit,

  //power
  combustionGenerator, thermalGenerator, turbineGenerator, differentialGenerator, rtgGenerator, solarPanel, largeSolarPanel, thoriumReactor,
  impactReactor, battery, batteryLarge, powerNode, powerNodeLarge, surgeTower, diode,

  //production
  mechanicalDrill, pneumaticDrill, laserDrill, blastDrill, waterExtractor, oilExtractor, cultivator,

  //storage
  coreShard, coreFoundation, coreNucleus, vault, container, unloader, launchPad, launchPadLarge,

  //turrets
  duo, scatter, scorch, hail, arc, wave, lancer, swarmer, salvo, fuse, ripple, cyclone, spectre, meltdown,

  //units
  commandCenter, draugFactory, spiritFactory, phantomFactory, wraithFactory, ghoulFactory, revenantFactory, daggerFactory, crawlerFactory, titanFactory,
  fortressFactory, repairPoint,

  //upgrades
  dartPad, deltaPad, tauPad, omegaPad, javelinPad, tridentPad, glaivePad;
  ```

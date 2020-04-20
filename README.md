# Commandblocks
Mindustry Command Block Mod(MCBM)
This mod adds Minecraft-like Command Blocks, along with other blocks.
This is currently in development.

## Blocks
+ Command Block
Executes command once when power requirements are met.
+ Chained Command Block
Executes command when power requirements are met, and the command block it is facing away from has executed successfully.
It will execute one tick after the command block it is facing away from.
+ Repeating Command Block
Executes command every tick when power requirements are met.
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

##Commands
Commands will fail to work when an error happens, params are invalid , or requirements below are not made.
<this is a required param>, [this is an optional param]. Skipping optional params is not allowed.

+ /say <string:text>
In multiplayer, sends <text> to all players. This is used if an error occured.
+ /overwrite <string:text>
Overwrites this command block's content to <text>.
+ /setblock <pos:x y> <Block:block> [int:rotation] [int:team] [replace|keep|build|force]
Sets the tile at <x y> to the specified <block>.
[rotation] should be between 0 and 3, default is 0.
[team] should be -1 and 255, default is -1. When [team] is -1, the team is set to the executor's team.
Fails if the previous block is already the same as the current block.
  - replace
  destroys the previous block, and sets a new block. (default)
  - keep
  only sets the block if previous block is Air.
  - build
  destroys the previous block, and sets a new block, as if a player built it.
  - force
  sets a new block. crashes the game if the previous block is a tile entity.

##Blocks
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

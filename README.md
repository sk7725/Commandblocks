# Commandblocks   
Mindustry Command Block Mod(MCBM)   
This mod adds Minecraft-like Command Blocks, along with other blocks.   
This is currently in development.   
`As of 4.8, Command Blocks require you to be an Admin to edit.`   
+ We now have a (half) Discord Server: [https://discord.gg/RCCVQFW](https://discord.gg/RCCVQFW)

## Blocks   
`Blocks that need further descriptions.`   
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
+ Mod Reader   
Gets the information of the mod.   
+ Note Player   
Plays a note when the power requirement is met. Instrument changes depending on the wall under it.   
All walls, door, router, junction, sorter, mender, shock mine, liquid router and junction, and unloaders have different instruments.   
+ Note Tuner   
Tunes a note. The instrument that will be tuned depends on the block under it.   
+ Music Player   
Plays an array of notes. First, specify the BPM, then the notes seperated by spaces, using x for rests. End the note with - for double length, and / for half(these may be stacked). This is not done yet.   
```
150 6e 6d 6c 6d 6e 6e 6e- 6d 6d 6d x 6e 6e 6e-   
```
+ Camera Wall   
Acts as a wall to the center of the camera. Can be ignored with a fast enough screen swipe.   
The hitbox is 3x3, one block to all four directions. Turns off if it is not rendered(minimap open, or out of screen).      
+ Directional Camera Wall   
Acts as a one-way to the center of the camera. Much more stable.   
The hitbox is 1 in width, and stretches infinitely to the back, making it more stable.   
+ Key Block   
Produces power if a key is pressed. Is not synced in multiplayer.   
Refer [here](https://github.com/Anuken/Arc/blob/v104.6/arc-core/src/arc/input/KeyCode.java) for the list of loggable keys.   

## Commands   
`List and description of commands.`   
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
  Refer [here](https://github.com/Anuken/Mindustry/blob/v104.6/core/src/mindustry/core/UI.java) for the list of functions.   

### /overwrite string:text  
Overwrites this command block's content to text.

### /setblock pos:x pos:y string:block (int:rotation) (int:team) (replace|keep|build|force)
Sets the tile at x,y to the specified block.   
Rotation should be between 0 and 3, default is 0.   
Team should be -1 and 255, default is -1. When team is -1, the team is set to the executor's team.   
Fails if the previous block is already the same as the current block.   
`replace` destroys the previous block, and sets a new block. (default)   
`keep` only sets the block if previous block is Air.   
`build` destroys the previous block, and sets a new block, as if a player built it.   
`force` sets a new block. crashes the game if the previous block is a tile entity.   

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
Refer [here](https://github.com/Anuken/Mindustry/blob/v104.6/core/src/mindustry/world/Tile.java) for the list of functions (if executor is a Tile), or [here](https://github.com/Anuken/Mindustry/blob/v104.6/core/src/mindustry/entities/type/Unit.java) (if executor is an Unit).   
Can only be used inside an /execute.   
  + Example   
  ```
  execute at ~ ~2 function setTeam team:5
  //sets the team of the tile 2 blocks to the north of the executor to 5.
  //calls setTeam( Team.get(5) ) of the tile 2 blocks to the north of the executor.
  ```
### /fb(/functionblock) string:functionname (arguments)
Runs a function of the block of the executor called functionname. Fails if the executor is not a tile.   
Refer [here](https://github.com/Anuken/Mindustry/blob/v104.6/core/src/mindustry/world/Block.java) or [here](https://github.com/Anuken/Mindustry/blob/v104.6/core/src/mindustry/world/BlockStorage.java) for the list of functions.   
Can only be used inside an /execute.   
  + Example   
  ```
  execute at ~ ~2 functionblock handleStack item:copper 5 tile:~,~ js:null
  //gives 5 copper to the block 2 blocks to the north of the executor.
  ```

### /fe(/functionent) string:functionname (arguments)
Runs a function of the tile entity of the executor called functionname. Fails if the executor is not a tile.   
Refer [here](https://github.com/Anuken/Mindustry/blob/v104.6/core/src/mindustry/entities/type/TileEntity.java) for the list of functions.   
Can only be used inside an /execute.   
  + Example   
  ```
  execute at ~ ~2 functionent damage 50
  //damages the tile 2 blocks to the north of the executor by 50.
  ```

### /gamerule string:rulename (boolean|int:state)   
Sets the gamerule or gets the current gamerule.   
Fails if no such gamerule exists, or state is not specified and the current state of the gamerule is false or 0.   
`commandBlockOutput` whether to log command failures in multiplayer chat.   
`commandBlockTitle` whether to log command failures as a popup.   
`setWave` sets current wave.   
`sendCommandFeedback` whether to log extra descriptive command outputs.   
`doCommands` whether to run commands at all, `/gamerule` will bypass this rule but other commands will be blocked.    
For more gamerules, refer [here](https://github.com/Anuken/Mindustry/blob/v104.6/core/src/mindustry/game/Rules.java).   

### /fx(/particle) string:effect (pos:x pos:y) (string:color)   
Plays particle effects on the given position. Fails if coordinates are below 0.   

### /playsound string:effect (pos:x pos:y) (int:volume)   
Plays a sound on the given position. Fails if coordinates are below 0. Default volume is 0.5.   

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

### /effect target:target string:statuseffect (int:duration) (int:level) (boolean:hideparticle)
Gives the executor a status effect for the given duration of seconds.   
Fails if executor is not an unit. Some effects are custom potion effects, which are affected by the given level and hideparticle.   
`speed` sets speedMultiplier to level\*0.1+1.1.   
`slowness` sets speedMultiplier to -1\*level\*0.05+0.95.   
`strength` sets damageMultiplier to level\*0.1+1.1.   
`weakness` sets damageMultiplier to -1\*level\*0.05+0.95.   
`resistance` sets armorMultiplier to level\*0.2+1.1.   
`pain` sets armorMultiplier to -1\*level\*0.05+0.95.   
`poison` gives damage of 0.05\*level+0.05 every frame. Kills, unlike what it looks like.   
`wither` gives damage of 0.1\*level+0.1 every frame. Kills.   
`instant_damage` gives damage of 10\*level+10. Duration is overridden.   
`burning, freezing, wet, melting, tarred, overdrive, shielded, shocked, corroded, boss` are vanilla status effects. Refer [here](https://simonwoodburyforget.github.io/mindustry-modding/#StatusEffect).   
`SPEED MULTIPLIERS ARE NOT SUPPOSED TO WORK FOR PLAYERS, MAY RESULT IN UNEXPECTED BEHAVIORS SUCH AS CRASHES.`   

### /kill (target:target)      
Kills the target. The target is the executor if unspecified. Fails if the target is not an unit.   

### /assert      
The executor asserts dominance.   

### /configure pos:x pos:y (int|boolean:value)      
Configures a block at the specified position to a value.   
Doors accept boolean, others accept intergers. Value may be unspecified for doors(then it will toggle).   
Fails if the block is not configurable, or if it is a door that is already in the given state.   

### /tp target:target
Teleports a target to a destination.  
Fails if the destination is an array of multiple targets.   
  + /tp target:target target:destination (facing) (float:angle)   
    Teleports to the destination's coordinates. The destination target must specify only one entity.   
    Angle may use tilde notation to add to the current rotation.   
  + /tp target:target pos:x pos:y (facing) (float:angle)   
    Teleports to the specified coordinates.   
    Angle may use tilde notation to add to the current rotation.   

### /summon string:unittype (pos:x pos:y) (int:team)   
Summons an unit at the specified position. Fails if coordinates are below 0.   
Team should be -1 and 255, default is -1. When team is -1, the team is set to the executor's team.   
Only vanilla units may be summoned with the exception of the armor stand, which can be summoned with `armorstand`.   

### /fire(/shoot) string:bullet (pos:x pos:y) (float:angle) (int:team) (float:velocity) (float:lifetime) (boolean:bind)   
Fires a bullet at the specified position. Fails if coordinates are below 0.   
Angle may use tilde notation to add to the current rotation.    
Team should be -1 and 255, default is -1. When team is -1, the team is set to the executor's team.   
Velocity and lifetime are multipliers, and defalts are 1.   
Bind is whether the executor becomes the owner of the bullet, default is false.   

### /attribute string:attributename (boolean|int|type:state)   
Sets an attribute or gets an attribute of the executor. Fails if the executor is not a tile.   
Can only be used inside an /execute.   
Refer [here](https://github.com/Anuken/Mindustry/blob/v104.6/core/src/mindustry/world/Block.java) for the list of attributes.   

## Tilde Notation   
Using ~ before a number for a coordinate will get the coordinate relative to the executor.   
All coordinates are based on the tile coordinate, not the world coordinate.    

## Refer a Type   
For a param that is not a string/int, the following syntax is used in `/f(and its counterparts)`, `/gamerule`, and `/attribute`.   
`tile|tileblock|tileent:x,y` `team:teamnumber` `block|floor|item|fx|liquid|bullet:name` `seffect:statuseffectname` `target:targetselector` `js:null|undefined|this|true|false`

## Target Selectors   
`@s` The executor of the command.
`@sb` The block of the executor of the command.
`@se` The tile entity of the executor of the command.
`@p` The player(not to be confused with a single player).   
`@a` All players.   
`@u` All units except players.   
`@t` Is a `this` of the origin command block. Use only when you know what you are doing.   
`@c[tagname]` A cache of the unit tagged by the Unit Tagger.   
`x,y` The tile at the position.   
`@e` All entities. Tile entities are excluded by default. Target arguments may be used.   
A string will refer to a player with that name.   

### Target Arguments   
Target arguments filter targets.   
The format is `[argument1=value,argument2=value,...]`, and `=!` may replace `=` to exclude, not include.   
Use it next to Target Selectors with no whitespace in between. For example: `@e[type=unit]`.   
+ type(string)   
  `player` `unit`(excludes players) `mob`(players&units) `bullet` `tile`(tile entity, not a tile) `effect` `groundEffect` `alleffect`(effects&groundEffects) `puddle` `shield` `fire`   
+ name(string)   
+ team(int)   
  -1 for the team of the executor.   
+ x y dx dy(pos)   
  filters in a rectangle, refer [here](https://minecraft.gamepedia.com/Commands#Target_selector_arguments).   
+ r(float)
  filters in a circle, the radius is in tiles.   

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
## Item List   
This is the full list of items, as of version 104.   
  ```
  scrap, copper, lead, graphite, coal, titanium, thorium, silicon, plastanium, phasefabric, surgealloy, sporePod, sand, blastCompound, pyratite, metaglass;   
  ```

## Particle List   
This is the full list of effects, as of version 104.   
```
  none, placeBlock, breakBlock, smoke, spawn, tapBlock, select,
  vtolHover, unitDrop, unitPickup, unitLand, pickup, healWave, heal, landShock, reactorsmoke, nuclearsmoke, nuclearcloud,
  redgeneratespark, generatespark, fuelburn, plasticburn, pulverize, pulverizeRed, pulverizeRedder, pulverizeSmall, pulverizeMedium,
  producesmoke, smeltsmoke, formsmoke, blastsmoke, lava, doorclose, dooropen, dooropenlarge, doorcloselarge, purify, purifyoil, purifystone, generate,
  mine, mineBig, mineHuge, smelt, teleportActivate, teleport, teleportOut, ripple, bubble, launch,
  healBlock, healBlockFull, healWaveMend, overdriveWave, overdriveBlockFull, shieldBreak, hitBulletSmall, hitFuse,
  hitBulletBig, hitFlameSmall, hitLiquid, hitLaser, hitLancer, hitMeltdown, despawn, flakExplosion, blastExplosion,
  plasticExplosion, artilleryTrail, incendTrail, missileTrail, absorb, flakExplosionBig, plasticExplosionFlak, burning, fire,
  fireSmoke, steam, fireballsmoke, ballfire, freezing, melting, wet, oily, overdriven, dropItem, shockwave,
  bigShockwave, nuclearShockwave, explosion, blockExplosion, blockExplosionSmoke, shootSmall, shootHeal, shootSmallSmoke, shootBig, shootBig2, shootBigSmoke,
  shootBigSmoke2, shootSmallFlame, shootPyraFlame, shootLiquid, shellEjectSmall, shellEjectMedium,
  shellEjectBig, lancerLaserShoot, lancerLaserShootSmoke, lancerLaserCharge, lancerLaserChargeBegin, lightningCharge, lightningShoot,
  unitSpawn, spawnShockwave, magmasmoke, impactShockwave, impactcloud, impactsmoke, dynamicExplosion, padlaunch, commandSend, coreLand;
```

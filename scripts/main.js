print("Command Mod Load Start!");
//INIT
require("commandblocks/init");
//require("collisions");
require("shaders");
require("renderer");

//UNITS
require("units/armorstand");
require("units/gamesoccerball");

//CUSTOM ASSETS
require("customsounds");
require("customfx");
require("customb");

require("command");
//require("commandargs");

//CAMPAIGN
require("campaign/ores");
require("campaign/upgradewave");
require("campaign/coremain");
require("campaign/campfire");
require("campaign/bitcrystal");
require("campaign/crafters");
require("campaign/turrets");
require("campaign/explosive");
require("campaign/explosivelarge");
require("campaign/treegrower");
require("campaign/loader");
require("campaign/enderchest");
require("campaign/enderbox");
require("campaign/tppad");

//SERVER
require("msgprotected");

//SANDBOX
require("commandb");
require("legacy/commandblock");
require("legacy/commandblockrepeating");
require("legacy/commandblockchained");
require("legacy/commandblockunit");

require("posreader");
require("posreaderblock");
require("posreaderent");
require("posreaderjson");

require("unitreader");
require("unitcacher");

//WALLS
require("walls/wallzeta");
require("walls/wallzetalarge");
require("walls/wallspace");
require("walls/wallspacelarge");
require("walls/walltime");
require("walls/walltimelarge");
require("walls/magicwall");
require("walls/magicwalllarge");

require("walls/wallinvi");
require("walls/camwall");
require("walls/camwalldir");

//ETC
require("playernote");
require("playertune");
require("playermusic");

require("button");
require("buttonbig");
require("buttonpad");
require("buttonpadbig");
require("buttonrouter");
require("buttonrouterbig");

require("powerswitch");
require("powerlogicg");
require("powertrans");

require("setconv");
require("setconva");
require("setconvmodder");
require("bundle-lib");

//PISTONS
require("piston");
require("sporeblock");

require("colorcanvas");
require("colorpicker");
require("colorpickerhex");
require("colorpickerbrush");

require("units/armorstandmodder");
require("magicrouter");
require("magictele");

require("signblock");

require("timer");
require("accel");
require("keyblock");

require("boostpad");
require("slimeblock");

require("blockcopy");
require("lastlog");
require("mp3player");

require("playermover");
require("gameyoot");

require("buttongg");

//SKILLS
require("skills");
require("researchskill");

//TESTERS
require("sandbox/shadertester");
require("sandbox/drawtester");
require("sandbox/tabletester");
require("sandbox/jstester");
require("sandbox/fxtester");

print("Load Complete!");

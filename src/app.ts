/*
This module is responsible of booting up the system
It provides visual information at start (printing to the terminal)
and then calls in sequence all the modules

===== WORKFLOW =====
- print system info
- initialize orchestator module
    - initialize cache management module
- initialize credentials manager
- hook to buttons to determine whether to turn on/off websocket and AP
- 
*/
require("dotenv").config();


/* ===== MODULES BOOTUP ===== */
require("./orchestrator");
require("./settingsManager");
require("./modeManager");
require("./socketManager");
require("./serverManager");
require("./dataRetriever");

import * as figlet from "figlet";
import dbManager from "./dbManager";


const tomato = `
          _______________________________
         [_______________________________]
         |===============================|
         |   __                          |
         |._/_.' _, ,__  ,_ /_ _  / /'   |
         | / _  / / /// / // /(-'/ / /|  |
         | \\__)(_(_//(_/_/(_/(__(_(_/_/_ |
         |            /                  |
         |       C O N D E N S E D       |
         |                               |
         |            .-"""-.            |
         |           /:':..':\\           |
         |==========|.:::::..:|==========|
         |           \\::::::./           |
         |            '-:::-'            |
         |     ___                       |
         |      |  _ ,_ _  _ -|- _       |
         |      | (_)| | |(_| |_(_)      |
         |                               |
         |V( )V( )V(  S O U P  )V( )V( )V|
         |----------           ----------|
         '==============================='
`

console.log(figlet.textSync("POMODORINO"));
console.log(tomato);

dbManager.touchUserTable("lorenzofar");

// TODO: implement workflow

/*
 * File: my_game_1.js 
 * This is the logic of our game. 
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";
import MyGame1 from "./my_game_1_light_control.js";

window.onload = function () {
    engine.init("GLCanvas");

    let myGame = new MyGame1();
    myGame.start();
}
/*
 * File: my_game_main_1.js 
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";

// user stuff
import Hero from "./objects/hero.js";
import MyGame2 from "./my_game_2.js";

class MyGame1 extends engine.Scene {
    constructor() {
        super();
        this.kBg = "assets/TX Tileset Grass.png";
        this.kProp = "assets/TX Props.png";
        this.kChar = "assets/AnimationSheet_Character.png";
        this.sunshine = "assets/sunshineTwo.png";
        this.cloudOne = "assets/cloudOne.png";
        this.cloudTwo = "assets/cloudTwo.png";
        this.rain = "assets/rainOne.png";

        // The camera to view the scene
        this.mCamera = null;

        // The background and objects in the scene
        this.mBg = null;
        this.mStatue = null;
        this.mShrine = null;

        // The main character
        this.mChar = null;

        // Light
        this.mLight = null;

        // The weather
        this.mSunny = null;
        this.mCloudy = null;
        this.mRainy = null;
        this.mCurrentWeather = null;
    }

    load() {
        engine.texture.load(this.kBg);
        engine.texture.load(this.kProp);
        engine.texture.load(this.kChar);
        engine.texture.load(this.sunshine);
        engine.texture.load(this.cloudOne);
        engine.texture.load(this.cloudTwo);
        engine.texture.load(this.rain);
    }

    unload() {
        engine.texture.unload(this.kBg);
        engine.texture.unload(this.kProp);
        engine.texture.unload(this.kChar);
        engine.texture.unload(this.sunshine);
        engine.texture.unload(this.cloudOne);
        engine.texture.unload(this.cloudTwo);
        engine.texture.unload(this.rain);
    }

    init() {
        // Step A: set up the camera
        this.mCamera = new engine.Camera(
            vec2.fromValues(100, 75), // position of the camera
            200,                       // width of camera
            [0, 0, 800, 600]           // viewport (orgX, orgY, width, height)
        );
        this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
        // sets the background to gray

        // light
        this.mLight = this._createALight([100, 75, 0], [0.9, 0.9, 0.6, 1.0], 20, 50, 0.0);

        // the background
        let bgR = new engine.LightRenderable(this.kBg);
        bgR.getXform().setSize(200, 150);
        bgR.getXform().setPosition(100, 75);
        bgR.setColor([1, 1, 1, 0]);
        bgR.setElementPixelPositions(0, 128, 128, 256);
        bgR.addLight(this.mLight);
        this.mBg = new engine.GameObject(bgR);

        // the props
        let statue = new engine.LightRenderable(this.kProp);
        statue.getXform().setSize(30, 40);
        statue.getXform().setPosition(100, 100);
        statue.setColor([1, 1, 1, 0]);
        statue.setElementPixelPositions(415, 512, 412, 512);
        statue.addLight(this.mLight);
        this.mStatue = new engine.GameObject(statue);

        let shrine = new engine.LightRenderable(this.kProp);
        shrine.getXform().setSize(40, 30);
        shrine.getXform().setPosition(100, 70);
        shrine.setColor([1, 1, 1, 0]);
        shrine.setElementPixelPositions(346, 458, 163, 252);
        shrine.addLight(this.mLight);
        this.mShrine = new engine.GameObject(shrine);

        // the main character
        this.mChar = new Hero(this.kChar);
        this.mChar.getRenderable().addLight(this.mLight);

        // the weather
        this.mSunny = new engine.Sunny(this.sunshine, [100, 75, 200, 150]);

        this.mRainy = new engine.Rainy(this.rain, [this.cloudOne, this.cloudTwo], [100, 75, 600, 450]);
        this.mRainy.setCloudSpeed(-30.0);
        this.mRainy.setCloudInterval(20);
        this.mRainy.setMaxTransparency(0.3);

        this.mCloudy = new engine.Cloudy([this.cloudOne, this.cloudTwo], [100, 75, 600, 450]);
        this.mCloudy.setCloudSpeed(30.0);
        this.mCloudy.setCloudInterval(20);
        this.mCloudy.getTime().setInGameHour(5);
        this.mCloudy.setMaxTransparency(0.3);

        this.mCurrentWeather = this.mCloudy;
        this.mCurrentWeather.getTime().setCurrentTime(6);
        engine.defaultResources.setGlobalAmbientIntensity(this.mCurrentWeather.getMinBrightness());

        this.displayControlInformation();
    }

    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        // Clear the canvas
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

        // Set up the camera and draw
        this.mCamera.setViewAndCameraMatrix();

        // Step B: Now draws each primitive
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                this.mBg.getXform().setPosition(-100 + i * 200, -75 + j * 150);
                this.mBg.draw(this.mCamera);
            }
        }
       
        this.mStatue.draw(this.mCamera);
        this.mShrine.draw(this.mCamera);
        this.mChar.draw(this.mCamera);

        // Display the weather
        this.mCurrentWeather.draw(this.mCamera);
    }

    // The Update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {
        this.mCamera.panWith(this.mChar.getXform(), 0.8)
        this.mCamera.update();  // to ensure proper interpolated movement effects
        this.mChar.update();
        this.mCurrentWeather.update();

        // Weather transition
        if (engine.input.isKeyClicked(engine.input.keys.C)) {
            if (this.mCloudy.performTransitionFrom(this.mCurrentWeather))
                this.mCurrentWeather = this.mCloudy;
        }
        if (engine.input.isKeyClicked(engine.input.keys.S)) {
            if (this.mSunny.performTransitionFrom(this.mCurrentWeather))
                this.mCurrentWeather = this.mSunny;
        }
        if (engine.input.isKeyClicked(engine.input.keys.R)) {
            if (this.mRainy.performTransitionFrom(this.mCurrentWeather))
                this.mCurrentWeather = this.mRainy;
        }

        // Scene transition
        if (engine.input.isKeyClicked(engine.input.keys.N)) {
            this.next();
        }
    }

    next() {
        super.next();

        // next scene to run
        let nextLevel = new MyGame2();  // next level to be loaded
        nextLevel.start();
    }

    displayControlInformation() {
        let elm = document.getElementById("ControlInformation");
        elm.innerHTML = 
            "<b>Change to Cloudy Day: </b> C <br>" +
            "<b>Change to Sunny Day: </b> S <br>" +
            "<b>Change to Rainy Day: </b> R <br>" +
            "<b>Next Scene: </b> N <br>" +
            "<b>Character Movements: </b> Arrow Keys <br>";
    }
}

export default MyGame1;
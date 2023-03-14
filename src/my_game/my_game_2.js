"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";

// user stuff
import Dye from "./objects/dye.js";
import DyePackSet from "./objects/dyepackSet.js";
import PatrolSet from "./objects/patrolSet.js";
import MyGame1 from "./my_game_1_main.js";

class MyGame2 extends engine.Scene {
    constructor() {
        super();
        this.kMinionSprite = "assets/minion_sprite.png";
        this.kBuildingBG = "assets/buildingsBG.png";
        this.kSkyBG = "assets/blueBG.jpg";
        this.sunshine = "assets/sunshineTwo.png";
        this.cloudOne = "assets/cloudOne.png";
        this.cloudTwo = "assets/cloudTwo.png";
        this.rain = "assets/rainOne.png";

        // The camera to view the scene
        this.mCamera = null;

        // The background
        this.mBuildingBG = null;
        this.mSkyBG = null;

        // The status message
        this.mMsg = null;

        // the hero and the support objects
        this.mDye = null;
        this.mDyePacks = null;
        this.mPatrols = null;
        this.mPatrol = null;

        // The weather
        this.mSunny = null;
        this.mCloudy = null;
        this.mRainy = null;
        this.mCurrentWeather = null;
    }

    load() {
        engine.texture.load(this.kMinionSprite);
        engine.texture.load(this.kBuildingBG);
        engine.texture.load(this.kSkyBG);
        engine.texture.load(this.sunshine);
        engine.texture.load(this.cloudOne);
        engine.texture.load(this.cloudTwo);
        engine.texture.load(this.rain);
    }

    unload() {
        engine.texture.unload(this.kMinionSprite);
        engine.texture.unload(this.kBuildingBG);
        engine.texture.unload(this.kSkyBG);
        engine.texture.unload(this.sunshine);
        engine.texture.unload(this.cloudOne);
        engine.texture.unload(this.cloudTwo);
        engine.texture.unload(this.rain);
    }

    init() {
        // Set up the main camera
        this.mCamera = new engine.Camera(
            vec2.fromValues(100, 75), // position of the camera
            200,                       // width of camera
            [0, 0, 800, 600]           // viewport (orgX, orgY, width, height)
        );
        this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
        // sets the background to gray

        // Large background image
        let bgS = new engine.LightRenderable(this.kSkyBG);
        bgS.getXform().setSize(200, 150);
        bgS.getXform().setPosition(100, 75);
        this.mSkyBG = new engine.GameObject(bgS);

        let bgB = new engine.LightRenderable(this.kBuildingBG);
        bgB.getXform().setSize(200, 150);
        bgB.getXform().setPosition(100, 75);
        this.mBuildingBG = new engine.GameObject(bgB);

        // Set up the status message
        this.mMsg = new engine.FontRenderable("Status Message");
        this.mMsg.setColor([1, 1, 1, 1]);
        this.mMsg.getXform().setPosition(1, 14);
        this.mMsg.setTextHeight(3);

        // Objects in the scene
        this.mWorldBound = new engine.BoundingBox([100, 75], 200, 150);
        this.mDye = new Dye(this.kMinionSprite);

        // Create game object sets that contain dyepacks and patrols.
        this.mDyePacks = new DyePackSet(this.mDye, this.kMinionSprite, this.mWorldBound);
        this.mPatrols = new PatrolSet(this.kMinionSprite, this.mWorldBound);

        this.mPatrols.createPatrol();

        // Create the weather
        this.mSunny = new engine.Sunny(this.sunshine, [100, 75, 200, 150]);

        this.mRainy = new engine.Rainy(this.rain, [this.cloudOne, this.cloudTwo], [100, 75, 200, 150]);
        this.mRainy.setCloudSpeed(-10.0);
        this.mRainy.setCloudInterval(10);
        this.mRainy.setCloudScale(80);
        this.mRainy.setCloudSpawn([0.15, 0.0]);
        this.mRainy.setMaxTransparency(0.3);

        this.mCloudy = new engine.Cloudy([this.cloudOne, this.cloudTwo], [100, 75, 200, 150]);
        this.mCloudy.setCloudSpeed(10.0);
        this.mCloudy.setCloudInterval(10);
        this.mCloudy.setCloudScale(80);
        this.mCloudy.setCloudSpawn([0.15, 0.0]);
        this.mCloudy.getTime().setInGameHour(5);
        this.mCloudy.setMaxTransparency(0.3);

        this.mCurrentWeather = this.mCloudy;
        this.mCurrentWeather.getTime().setCurrentTime(6);
        engine.defaultResources.setGlobalAmbientIntensity(this.mCurrentWeather.getMinBrightness());

        this.displayControlInformation();
    }

    _drawCamera(camera) {
        camera.setViewAndCameraMatrix();
        this.mSkyBG.draw(camera);
        this.mBuildingBG.draw(camera);
        this.mDye.draw(camera);
        this.mDyePacks.draw(camera);
        this.mPatrols.draw(camera);
        this.mCurrentWeather.draw(camera);
    }

    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        // Step A: clear the canvas
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

        // Step  B: Draw with all three cameras
        this._drawCamera(this.mCamera);
        this.mMsg.draw(this.mCamera);   // only draw status in the main camera
    }

    // The update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {
        // Update hte status message
        let msg = "L/R: Left or Right Minion; H: Dye; P: Portal]: ";
        msg = "";
        msg += " X=" + engine.input.getMousePosX() + " Y=" + engine.input.getMousePosY() + 
            " Number of Patrols: " + this.mPatrols.size() + " Number of DyePacks: " + 
            this.mDyePacks.size() + " AutoSpawning: " + this.mPatrols.getAutoSpawn();
        this.mMsg.setText(msg);


        this.mCamera.update();  // for smoother camera movements

        // Check whether the mouse position is inside the main viewport.
        if (this.mCamera.isMouseInViewport()) {
            this.mDye.moveTo([this.mCamera.mouseWCX(), this.mCamera.mouseWCY()]);
        }

        this.mDye.update();

        this.mPatrols.update();

        this.mDyePacks.update();

        // Traverse through each of the dyepacks and patrols.
        let dSize = this.mDyePacks.size();
        let pSize = this.mPatrols.size();
        let i = 0;

        for (i = 0; i < dSize; i++) {
            let current = this.mDyePacks.getObjectAt(i);
            let j = 0;

            // Check whether a dyepack collides with any of the patrols.
            while (j < pSize && !current.isHit()) {
                let hitPos = [];
                if (current.pixelTouches(this.mPatrols.getObjectAt(j), hitPos)) {
                    current.setHit();
                    this.mPatrols.getObjectAt(j).setHit(true);
                } else if(current.pixelTouches(this.mPatrols.getObjectAt(j).getWing(0), hitPos)) {
                    current.setHit();
                    this.mPatrols.getObjectAt(j).getWing(0).setHit();
                } else if(current.pixelTouches(this.mPatrols.getObjectAt(j).getWing(1), hitPos)) {
                    current.setHit();
                    this.mPatrols.getObjectAt(j).getWing(1).setHit();
                }

                j++;
            }
        }

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
        let nextLevel = new MyGame1();  // next level to be loaded
        nextLevel.start();
    }

    displayControlInformation() {
        let elm = document.getElementById("ControlInformation");
        elm.innerHTML = 
            "<b>Change to Cloudy Day: </b> C <br>" +
            "<b>Change to Sunny Day: </b> S <br>" +
            "<b>Change to Rainy Day: </b> R <br>" +
            "<b>Next Scene: </b> N <br>" +
            "<b>Character Movements: </b> Cursor Position <br>" +
            "<b>Shoot: </b> Spacebar <br>" +
            "<b>Enemy Generation: </b> P <br>";
    }
}

export default MyGame2;
"use strict";

import Weather from "./weather.js";
import TextureRenderable from "../renderables/texture_renderable_main.js";

class Sunny extends Weather {
    /**
     * Create an instance of the Sunny class. The Sunny class
     * represents the sunny day for the game.
     * 
     * @param {String} imagePath the path to a sunshine texture 
     * @param {Array} world an array that is of the format
     * [worldCenterX, worldCenterY, worldWidth, worldHeight]
     */
    constructor(imagePath, world) {
        super(world);

        this.kSunshine = imagePath;
        this.mSunshine = new TextureRenderable(this.kSunshine);
        this.mEffectTransparency = 0.0;

        this.setColor([1, 1, 0.7, 0.5]);
        this.setMaxBrightness(4);
    }

    /**
     * Update the sunshine effect.
     */
    updateWeatherEffect() {
        let deltaTransparency = this.mMaxEffectTransparency / (this.mTime.getInGameHour() * 120);
        let currentTime = this.mTime.getCurrentTime();

        if (this.mEffectLerp.isDone()) {
            if (currentTime >= 6 && currentTime < 18 && this.mEffectTransparency < this.mMaxEffectTransparency) {
                this.setCurrentTransparency(this.mEffectTransparency + deltaTransparency);
            } else if ((currentTime < 6 || currentTime >= 18) && this.mEffectTransparency > 0.0) {
                if (this.mEffectTransparency - deltaTransparency <= 0.0) {
                    this.setCurrentTransparency(0.0);
                } else {
                    this.setCurrentTransparency(this.mEffectTransparency - deltaTransparency);
                }
            }
        } 
    }

    /**
     * Drawn the sunshine effect.
     * 
     * @param {Camera} camera the camera with which the sunshine
     * effect should be drawn
     */
    draw(camera) {
        super.draw(camera);
        this.mSunshine.setTransparency(this.mEffectTransparency);
        let center = camera.getWCCenter();
        this.mSunshine.getXform().setPosition(center[0], center[1]);
        this.mSunshine.getXform().setSize(camera.getWCWidth(), camera.getWCHeight());
        this.mSunshine.draw(camera);
    }

    /**
     * Update the sunny day. This method calls the
     * updateWeatherEffect() method automatically.
     */
    update() {
        super.update();
        this.updateWeatherEffect();
    }
}

export default Sunny;
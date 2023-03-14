"use strict";

import Cloudy from "./cloudy.js";
import TextureRenderable from "../renderables/texture_renderable_main.js";

class Rainy extends Cloudy {
    /**
     * Create an instance of the Rainy class. The Rainy class
     * represents the rainy day for the game.
     * 
     * @param {String} rain the path to a rain texture
     * @param {Array} clouds an array of the paths to cloud
     * textures
     * @param {Array} world an array that is of the format
     * [worldCenterX, worldCenterY, worldWidth, worldHeight]
     * The rain effects will be applied to the dimension that
     * is specified by this array.
     */
    constructor(rain, clouds, world) {
        super(clouds, world);

        this.rainDensity = 4;

        this.rainScale = 200;

        this.rainDirection = [Math.cos(Math.PI * 1.3), Math.sin(Math.PI * 1.3)];

        this.rainSpeed = 100;

        this.mPositions = [];

        this.kRain = rain;
        this.mRain = new TextureRenderable(this.kRain);
        this.mRain.getXform().setSize(this.rainScale, this.rainScale);
    }

    /**
     * Get the current rain density. The rain density refers
     * to how many "columns" of rain effects will be drawn
     * at a time.
     * 
     * @returns the current rain density
     */
    getRainDensity() {
        return this.rainDensity;
    }

    /**
     * Set the current rain density.
     * 
     * @param {int} input an integer that is at least 2
     */
    setRainDensity(input) {
        this.rainDensity = input;
    }

    /**
     * @returns the scale of the rain effects in world
     * coordinate
     */
    getRainScale() {
        return this.rainScale;
    }

    /**
     * Set the scale of the rain effects. The width and height
     * of the rain effects will both adhere to this scale.
     * 
     * @param {float} input a float in world coordinate
     */
    setRainScale(input) {
        this.rainScale = input;
    }

    /**
     * @returns the direction to which the rain effects move
     */
    getRainDirection() {
        return this.rainDirection;
    }

    /**
     * Set the direction to which the rain effects move.
     * 
     * @param {Array} input an array of two floats that specifies
     * a direction and has a magnitude of 1
     */
    setRainDirection(input) {
        this.rainDirection = input;
    }

    /**
     * @returns the speed, in world coordinate units per second,
     * with which the rain effects move
     */
    getRainSpeed() {
        return this.rainSpeed;
    }

    /**
     * Set the speed with which the rain effects move.
     * 
     * @param {float} input a float in world coordinate units
     * per second
     */
    setRainSpeed(input) {
        this.rainSpeed = input;
    }

    /**
     * Update the rain effects (and the cloud effects).
     */
    updateWeatherEffect() {
        if (this.getCloudyActive()) {
            super.updateWeatherEffect();
        }

        // Rain effect creation
        let top = this.mWorldCenter[1] + this.mWorldHeight / 2.0;
        if (this.mPositions.length === 0 || 
            this.mPositions[this.mPositions.length - 1][1] < top - this.mRain.getXform().getHeight() / 2.0) {
            let deltaDistance = this.mWorldWidth / (this.rainDensity - 1);
            for (let i = 0; i < this.rainDensity; i++) {
                this.mPositions.push([i * deltaDistance, top]);
            }
        }

        // Rain effect movement
        for (let i = 0; i < this.mPositions.length; i++) {
            this.mPositions[i][0] += this.rainDirection[0] * this.rainSpeed / 60.0;
            this.mPositions[i][1] += this.rainDirection[1] * this.rainSpeed / 60.0;
        }
    }


    /**
     * Draw the rain effects (and the cloud effects).
     * 
     * @param {Camera} camera the camera with which the effects
     * should be drawn
     */
    draw(camera) {
        this.mRain.setTransparency(this.mEffectTransparency);
        for (let i = 0; i < this.mPositions.length; i++) {
            this.mRain.getXform().setPosition(this.mPositions[i][0], this.mPositions[i][1]);
            this.mRain.draw(camera);
        }

        super.draw(camera);
    }

    /**
     * Update the rainy day. This method calls the
     * updateWeatherEffect() method automatically.
     */
    update() {
        super.update();
        this.updateWeatherEffect();
    }
}

export default Rainy;
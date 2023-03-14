"use strict";

import * as defaultResources from "../resources/default_resources.js";
import * as time from "./time.js";
import Lerp from "../utils/lerp.js"; 

class Weather {
    /**
     * Create an instance of the Weather class. The Weather
     * class is the superclass of subclasses that represent
     * different types of weather. The Weather class define
     * common behaviors for its subclasses.
     * 
     * @param {Array} world an array that is of the format
     * [worldCenterX, worldCenterY, worldWidth, worldHeight]
     */
    constructor(world) {
        this.mTime = time.getTimeInstance();
        this.mWorldCenter = [world[0], world[1]];
        this.mWorldWidth = world[2];
        this.mWorldHeight = world[3];
        this.mAmbientColor = defaultResources.getGlobalAmbientColor();

        this.mMaxIntensity = 1.0;
        this.mMinIntensity = 1.0;
        this.mMaxEffectTransparency = 1.0;
        this.mEffectTransparency = 1.0;

        // For weather transition
        this.mAmbientLerp = new Lerp(0, 0, 0);
        this.mEffectLerp = new Lerp(0, 0, 0);
        this.mAnotherWeatherLerp = new Lerp(0, 0, 0);
        this.mAnotherWeather = null;
        this.mRate = 0.01;
        this.mDuration = this.mTime.getInGameHour() * 2 * 60;
    }

    /**
     * @returns the instance of the Time class that keeps
     * track of the time
     */
    getTime() {
        return this.mTime;
    }

    /**
     * Set the color of the ambient of the weather.
     * 
     * @param {Array} color a color array [R, G, B, A]
     */
    setColor(color) {
        this.mAmbientColor = color;
    }

    /**
     * @returns the color of the ambient of the weather
     */
    getColor() {
        return this.mAmbientColor;
    }

    /**
     * Set the current transparency factor of the effect
     * renderables of the weather.
     * 
     * @param {float} factor a float between 0 (transparent)
     * and 1 (opaque)
     */
    setCurrentTransparency(factor) {
        this.mEffectTransparency = factor;
    }

    /**
     * @returns the current transparency factor
     */
    getCurrentTransparency() {
        return this.mEffectTransparency;
    }

    /**
     * Set the maximum transparency factor of the effect
     * renderables of the weather. This method set the
     * current transparency factor at the same time.
     * 
     * @param {float} factor a float between 0 (transparent)
     * and 1 (opaque) 
     */
    setMaxTransparency(factor) {
        if (factor <= 1.0 && factor >= 0.0) {
            this.mMaxEffectTransparency = factor;
            this.setCurrentTransparency(factor);
        }
    }

    /**
     * @returns the maximum transparency factor
     */
    getMaxTransparency() {
        return this.mMaxEffectTransparency;
    }

    /**
     * Set the maximum intensity of the ambient of the
     * weather.
     * 
     * @param {float} intensity a float between 0 and 1
     */
    setMaxBrightness(intensity) {
        this.mMaxIntensity = intensity;
    }

    /**
     * @returns the maximum intensity
     */
    getMaxBrightness() {
        return this.mMaxIntensity;
    }

    /**
     * Set the minimum intensity of the ambient of the
     * weather.
     * 
     * @param {float} intensity a float between 0 and 1
     */
    setMinBrightness(intensity) {
        this.mMinIntensity = intensity;
    }

    /**
     * @returns the minimum intensity
     */
    getMinBrightness() {
        return this.mMinIntensity;
    }

    /**
     * @returns whether it is in the process of
     * changing to another type of weather
     */
    transitionDone() {
        return this.mAmbientLerp.isDone();
    }

    /**
     * Perform the transition from another weather to this
     * weather. Note that the update method of the weather
     * to change from should not be called after this method
     * is called.
     * 
     * @param {Weather} anotherWeather the weather to change
     * from
     * @returns whether the transition is successful
     */
    performTransitionFrom(anotherWeather) {
        if (!anotherWeather.transitionDone() || anotherWeather === this) {
            return false;
        }

        this.mDuration = this.mTime.getInGameHour() * 2 * 60;
        let currentTime = this.mTime.getCurrentTime();
        if (currentTime >= 6 && currentTime < 18) {
            this.mAmbientLerp = new Lerp(defaultResources.getGlobalAmbientIntensity(), this.mDuration, this.mRate);
            this.mAmbientLerp.setFinal(this.mMaxIntensity);
            this.mEffectLerp = new Lerp(this.mEffectTransparency, this.mDuration, this.mRate);
            this.mEffectLerp.setFinal(this.mMaxEffectTransparency);
        } else {
            this.mAmbientLerp = new Lerp(defaultResources.getGlobalAmbientIntensity(), this.mDuration, this.mRate);
            this.mAmbientLerp.setFinal(this.mMinIntensity);
            this.mEffectLerp = new Lerp(this.mEffectTransparency, this.mDuration, this.mRate);
            this.mEffectLerp.setFinal(this.mMaxEffectTransparency);
        }

        this.mAnotherWeather = anotherWeather;
        this.mAnotherWeatherLerp = new Lerp(anotherWeather.getCurrentTransparency(), this.mDuration, this.mRate);
        this.mAnotherWeatherLerp.setFinal(0.0);

        return true;
    }

    /**
     * Update the weather.
     */
    update() {
        this.mTime.update();
        let currentTime = this.mTime.getCurrentTime();
        
        // Change the intensity of the ambient and the transparency of effects
        // during a 2-hour interval for weather transitions.
        if (!this.mAmbientLerp.isDone()) {
            this.mAmbientLerp.update();
            defaultResources.setGlobalAmbientIntensity(this.mAmbientLerp.get());
        }
        if (!this.mEffectLerp.isDone()) {
            this.mEffectLerp.update();
            this.setCurrentTransparency(this.mEffectLerp.get());
        }
        if (!this.mAnotherWeatherLerp.isDone()) {
            this.mAnotherWeatherLerp.update();
            this.mAnotherWeather.setCurrentTransparency(this.mAnotherWeatherLerp.get());
            this.mAnotherWeather.updateWeatherEffect();
        }

        if (this.mAmbientLerp.isDone()) {
            // Change the intensity of the ambient during a 2-hour interval for day and night transitions.
            let currentIntensity = defaultResources.getGlobalAmbientIntensity();
            let deltaAmbient = (this.mMaxIntensity - this.mMinIntensity) / (this.mTime.getInGameHour() * 120);

            // Transition from night to day.
            if (currentTime >= 6 && currentIntensity < this.mMaxIntensity) {
                defaultResources.setGlobalAmbientIntensity(currentIntensity + deltaAmbient);
            }
            // Transition from day to night.
            if (currentTime >= 18 && currentIntensity > this.mMinIntensity) {
                defaultResources.setGlobalAmbientIntensity(currentIntensity - deltaAmbient);
            }
        }
    }

    /**
     * Draw the effect renderables of the weather.
     * 
     * @param {Camera} camera the camera with which the
     * weather effects should be drawn
     */
    draw(camera) {
        if (!this.mAnotherWeatherLerp.isDone()) {
            this.mAnotherWeather.draw(camera);
        }
    }

    /**
     * Update the effect renderables of the weather.
     */
    updateWeatherEffect() {

    }
}

export default Weather;
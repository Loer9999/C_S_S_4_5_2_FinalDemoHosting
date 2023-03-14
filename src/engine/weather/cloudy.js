"use strict";

import Weather from "./weather.js";
import TextureRenderable from "../renderables/texture_renderable_main.js";

class Cloudy extends Weather {
    /**
     * Create an instance of the Cloudy class. The Cloudy class
     * represents the cloudy day for the game.
     * 
     * @param {Array} clouds an array of image file paths to
     * cloud textures
     * @param {Array} world  an array that is of the format
     * [worldCenterX, worldCenterY, worldWidth, worldHeight]
     * The cloud effects will be applied to the dimension that
     * is specified by this array.
     */
    constructor(clouds, world) {
        super(world);

        //Darkens the screen slightly
        this.setColor([0, 0.25, 0.8, 1]);
        this.setMaxBrightness(2);

        //File Paths for clouds in an Array
        this.cloudArray = clouds;

        //Renderables
        this.mClouds = [];

        //Speed of clouds in units/second
        this.cloudSpeed = 5.0;

        //Number of clouds per spawning event
        this.cloudDensity = 6;

        //Time between each cloud event in seconds
        this.cloudInterval = 1.5 * this.mWorldWidth / this.cloudSpeed;

        //Internal duration tracker. The unit is in frames.
        this.cloudTime = 0;

        //Cloud scale size in WC
        this.cloudScale = 200;

        //Percent of WC height that the spawn area should be displaced by
        //Starts from the top
        this.cloudSpawnDelta = 0; 

        //Percent of WC height that should spawn clouds
        //Also starts from the top
        this.cloudSpawnRange = 1.0;

        //Whether the clouds should be drawn or not
        this.isActive = true;
    }

    /**
     * Setter for the cloud density. The cloud density refers
     * to how many cloud effects will be generated at a time.
     * 
     * @param {int} input an integer that defines the number
     *  of clouds spawned per each spawning event. Should be
     *  greater than 0.
     */
    setCloudDensity(input) {
        if(input > 0) {
            this.cloudDensity = input;
        }
    }

    /**
     * Getter for the cloud density.
     * @returns {int} the current cloud density
     */
    getCloudDensity() {
        return this.cloudDensity;
    }

    /**
     * Setter for the cloud speed, the speed with which the
     * cloud effects move.
     * 
     * @param {float} input an integer defining the speed of
     * clouds in world coordinate units per second
     */
    setCloudSpeed(input) {
        this.cloudSpeed = input;
    }


    /**
     * Getter for the cloud speed.
     * 
     * @returns {float} the current cloud speed
     */
    getCloudSpeed() {
        return this.cloudSpeed;
    }


    /**
     * Setter for the cloud interval. The cloud interval defines
     * the interval between two cloud spawning events.
     * 
     * @param {float} input float, in seconds, representing the
     * time between spawning events. Should be greater than 0.
     */
    setCloudInterval(input) {
        if(input > 0) {
            this.cloudInterval = input;
        }   
    }

    /**
     * Getter for the cloud interval.
     * 
     * @returns {float} the current cloud interval
     */
    getCloudInterval() {
        return this.cloudInterval;
    }

    /**
     * Getter for the cloud scale.
     * 
     * @returns {float} the current cloud scale
     */
    getCloudScale() {
        return this.cloudScale;
    }

    /**
     * Setter for the cloud scale.
     * 
     * @param {float} input an input that sets the scaling for 
     * the cloud effect renderables. It must be greater than 0
     * and in world coordinate units.
     */
    setCloudScale(input) {
        if(input > 0) {
            this.cloudScale = input;
        }
    }

    /**
     * Getter for cloud spawning parameters.
     * 
     * @returns {Array} an array of size 2
     * [0] is a float that specifies the range within which
     * the clouds can be spawned.
     * [1] is a float that specifies the displacement of the
     * spawning area.
     * The reference point is the top of the world, and these
     * two floats specifies a percentage of the height of the
     *  world.
     */
    getCloudSpawn() {
        return [this.cloudSpawnRange, this.cloudSpawnDelta];
    }

    /**
     * Setter for cloud spawning parameters.
     * 
     * @param {Array} input an array of size 2 where [0] is
     * the new cloud range value, and [1] is the new cloud
     * displacement value
     */
    setCloudSpawn(input) {
        this.cloudSpawnRange = input[0];
        this.cloudSpawnDelta = input[1];
    }

    /**
     * Setter for whether the clouds are active.
     * 
     * @param {boolean} input if this clouds are active 
     */
    setCloudyActive(input) {
        this.isActive = input;
    }

    /**
     * Getter for whether the clouds are active.
     * 
     * @returns {boolean} whether the coulds are active.
     */
    getCloudyActive() {
        return this.isActive;
    }

    /**
     * Updates the cloud effects, including spawning new
     * clouds and updating existing clouds
     */
    updateWeatherEffect() {
        //Cloud Spawning

        if (this.cloudTime == 0) {
            for(let i = 0; i < this.cloudDensity; i++) {
                //Picks a random cloud out of the ones available
                let index = Math.floor(Math.random() * this.cloudArray.length);
                if (index == this.cloudArray.length) {
                    index -= 1;
                }

                //Create textures for clouds
                this.mClouds.push(new TextureRenderable(this.cloudArray[index]));

                //Set scale
                this.mClouds[this.mClouds.length - 1].getXform().setSize((Math.random() + 0.5) * this.cloudScale,
                    (Math.random() + 0.5) * this.cloudScale);

                //Set position
                let widthChange = (Math.random() / 2 + 1) * this.mWorldWidth;
                let heightChange = this.mWorldCenter[1] + (this.mWorldHeight / 2) - 
                (Math.random() * this.mWorldHeight * this.cloudSpawnRange) - (this.mWorldHeight * this.cloudSpawnDelta);

                if (this.cloudSpeed >= 0) {
                    //If speed is positive, create them on the left side
                    this.mClouds[this.mClouds.length - 1].getXform().setPosition(this.mWorldCenter[0] - widthChange, heightChange);
    
                } else {
                    //If speed is negative, create them on the right
                    this.mClouds[this.mClouds.length - 1].getXform().setPosition(this.mWorldCenter[0] + widthChange, heightChange);
                }

                //Set transparency
                this.mClouds[this.mClouds.length - 1].setTransparency(this.mEffectTransparency);
            }
            
            this.cloudTime++;

        } else if(this.cloudTime >= this.cloudInterval * 60) {
            this.cloudTime = 0;

        } else {
            // Cloud movement and deletion
            for (let l = 0; l < this.mClouds.length; l++) {
                let xform = this.mClouds[l].getXform();
                xform.incXPosBy(this.cloudSpeed / 60.0);
                
                if (this.cloudSpeed >= 0 && (xform.getXPos() > this.mWorldCenter[0] + this.mWorldWidth)) {
                    this.mClouds.splice(l, 1);
                    l--;
                } else if (this.cloudSpeed < 0 && (xform.getXPos() < this.mWorldCenter[0] - this.mWorldWidth)) {
                    this.mClouds.splice(l, 1);
                    l--;
                }
            }
            this.cloudTime++;
        }
    }

    /**
     * Draws all the clouds to the given camera if the
     * clouds are active.
     * 
     * @param {Camera} camera the camera the clouds should
     * be drawn to
     */
    draw(camera) {
        if(!this.isActive) {
            return;
        }

        super.draw(camera);
        for(let i = 0; i < this.mClouds.length; i++) {
            this.mClouds[i].setTransparency(this.mEffectTransparency);
            this.mClouds[i].draw(camera);
        }
    }

    /**
     * Updates the cloudy day and its superclass if the
     * clouds are active. This method automatically
     * calls the updateWeatherEffect() method.
     */
    update() {
        if(!this.isActive) {
            return;
        }

        super.update();
        this.updateWeatherEffect();
    }
}

export default Cloudy;
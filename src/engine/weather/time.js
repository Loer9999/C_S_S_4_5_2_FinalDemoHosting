"use strict";

class Time {
    /**
     * Create an instance of the Time class that keeps track of 
     * time for the weather.
     */
    constructor() {
        // The current time is initially 6 a.m.
        this.mCurrentTime = 6;

        // The length of 1 hour in game (in seconds).
        this.mOneHourInGame = 60;

        // 1 second is 60 frames.
        this.mFramesCounter = this.mOneHourInGame * 60;

        this.mPaused = false;
    }

    /**
     * Set the current time.
     * 
     * @param {int} time an integer that specifies the current
     * time using the 24-hour format 
     */
    setCurrentTime(time) {
        this.mCurrentTime = time;
        this.mFramesCounter = this.mOneHourInGame * 60;
    }

    /**
     * @returns the current time
     */
    getCurrentTime() {
        return this.mCurrentTime;
    }

    /**
     * Specify how many seconds in real life equal to one hour
     * in the game.
     * 
     * @param {int} seconds seconds in real life
     */
    setInGameHour(seconds) {
        this.mOneHourInGame = seconds;
        this.mFramesCounter = this.mOneHourInGame * 60;
    }

    /**
     * @returns the number of seconds corresponds to one in-game
     * hour
     */
    getInGameHour() {
        return this.mOneHourInGame;
    }

    /**
     * Specify whether to pause the time.
     * 
     * @param {boolean} bool a boolean value that pauses the
     * time if it is true
     */
    setIfTimePaused(bool) {
        this.mPaused = bool;
    }

    /**
     * @returns whether the time is paused
     */
    getIsTimePaused() {
        return this.mPaused;
    }

    /**
     * Update this instance of the Time class to keep track
     * of the time.
     */
    update() {
        if (!this.mPaused) {
            this.mFramesCounter -= 1;

            if (this.mFramesCounter <= 0) {
                this.mFramesCounter = this.mOneHourInGame * 60;
                this.mCurrentTime += 1;
            }
            if (this.mCurrentTime >= 24) {
                this.mCurrentTime = 0;
            }
        }
    }
}

let mTime = new Time();

/**
 * Return the only instance of the Time class. There should
 * only be one instance throughout the game.
 * 
 * @returns an instance of the Time class.
 */
function getTimeInstance() {
    return mTime;
}

export {getTimeInstance};
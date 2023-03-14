"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";

class DyePack extends engine.GameObject {
    constructor(spriteTexture, spawnPosition, worldBound) {
        super(null);
        this.kWidth = 2;
        this.kHeight = 3.25;

        this.mSpeed = 2;
        this.mWorldBound = worldBound;
        this.mHit = false;
        this.mDelete = false;
        this.mXBounce = new engine.Oscillate(4, 20, 300); // delta, freq, duration
        this.mYBounce = new engine.Oscillate(0.2, 20, 300); // delta, freq, duration
        this.mLifeTime = 300;
        this.mCurrentPosition = spawnPosition;

        this.mRenderComponent = new engine.LightRenderable(spriteTexture);
        this.mRenderComponent.setColor([1, 1, 1, 0]);
        this.mRenderComponent.getXform().setPosition(spawnPosition[0], spawnPosition[1]);
        this.mRenderComponent.getXform().setSize(this.kWidth, this.kHeight);
        this.mRenderComponent.getXform().setRotationInDegree(90);
        this.mRenderComponent.setElementPixelPositions(510, 595, 23, 153);
    }

    isHit() {
        return this.mHit;
    }

    setHit() {
        this.mHit = true;
    }

    shouldDelete() {
        return this.mDelete;
    }

    update() {
        let xform = this.mRenderComponent.getXform();
        let afterHit = false;
        this.mLifeTime -= 1;

        if (!this.mHit) {
            this.mCurrentPosition[0] += this.mSpeed;
            xform.setXPos(this.mCurrentPosition[0]);

            if (engine.input.isKeyPressed(engine.input.keys.D)) {
                this.mSpeed -= 0.1;
            }
            if (engine.input.isKeyPressed(engine.input.keys.S)) {
                this.setHit();
            }
        } else {
            if (!this.mXBounce.done()) {
                let d = this.mXBounce.getNext();
                xform.setXPos(this.mCurrentPosition[0] + d);
            }
            if (!this.mYBounce.done()) {
                let d = this.mYBounce.getNext();
                xform.setYPos(this.mCurrentPosition[1] + d)
            }

            if (this.mXBounce.done() && this.mYBounce.done) {
                afterHit = true;
            }
        }

        if (this.mLifeTime <= 0 || !this.mWorldBound.containsPoint(xform.getXPos(), xform.getYPos())
         || this.mSpeed <= 0 || afterHit) {
            this.mDelete = true;
        }
    }
}

export default DyePack;
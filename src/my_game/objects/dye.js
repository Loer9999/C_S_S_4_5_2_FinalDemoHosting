"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";

class Dye extends engine.GameObject {
    constructor(spriteTexture) {
        super(null);

        this.mInitialPosition = [50, 75];
        this.mCurrentPosition = this.mInitialPosition;
        this.mInitialSize = [9, 12];

        // Create a lerp object for Dye to move.
        this.mLerp = new engine.LerpVec2(this.mInitialPosition, 120, 0.05);

        this.mXBounce = new engine.Oscillate(4.5, 4, 60); // delta, freq, duration
        this.mYBounce = new engine.Oscillate(6, 4, 60); // delta, freq, duration

        this.mRenderComponent = new engine.LightRenderable(spriteTexture);
        this.mRenderComponent.setColor([1, 1, 1, 0]);
        this.mRenderComponent.getXform().setPosition(this.mInitialPosition[0], this.mInitialPosition[1]);
        this.mRenderComponent.getXform().setSize(this.mInitialSize[0], this.mInitialSize[1]);
        this.mRenderComponent.setElementPixelPositions(0, 120, 0, 180);
    }

    getXPos() {
        return this.mCurrentPosition[0];
    }

    getYPos() {
        return this.mCurrentPosition[1];
    }

    moveTo(position) {
        this.mLerp.setFinal(position);
    }

    update() {
        let xform = this.mRenderComponent.getXform();
        this.mLerp.update();
        this.mCurrentPosition = this.mLerp.get();
        xform.setPosition(this.mCurrentPosition[0], this.mCurrentPosition[1]);

        if (engine.input.isKeyClicked(engine.input.keys.Q)) {
            this.mXBounce.reStart();
            this.mYBounce.reStart();
            xform.setSize(this.mInitialSize[0], this.mInitialSize[1]);
        }
        if (!this.mXBounce.done()) {
            let d = this.mXBounce.getNext();
            xform.setWidth(this.mInitialSize[0] + d);
        }
        if (!this.mYBounce.done()) {
            let d = this.mYBounce.getNext();
            xform.setHeight(this.mInitialSize[1] + d);
        }
    }
}

export default Dye;
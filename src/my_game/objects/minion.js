"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";
import LerpVec2 from "../../engine/utils/lerp_vec2.js";

class Minion extends engine.GameObject {
    constructor(spriteTexture, atX, atY) {
        super(null);
        this.kDelta = 0.2;
        this.mRenderComponent = new engine.LightRenderable(spriteTexture);
        this.mRenderComponent.setColor([1, 1, 1, 0]);
        this.mRenderComponent.getXform().setPosition(atX, atY);
        this.mRenderComponent.getXform().setSize(10, 8);
        this.mRenderComponent.setElementPixelPositions(0, 206, 360, 512);

        //Lerp
        this.mLerp = new LerpVec2(this.getXform().getPosition(), 120, 0.05);

        //Hit
        this.isHit = false;
    }

    setHit() {
        this.isHit = true;
    }

    update() {
        this.mLerp.update();

        if(this.isHit) {
            let colors = this.mRenderComponent.getColor();
            colors[3] = colors[3] + 0.2;
            this.mRenderComponent.setColor(colors);
            this.isHit = false;
        }
    }
}

export default Minion;
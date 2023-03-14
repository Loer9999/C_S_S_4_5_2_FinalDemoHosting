/* File: hero.js 
 *
 * Creates and initializes the Hero
 * overrides the update function of GameObject to define
 * simple behavior
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";

class Hero extends engine.GameObject {
    constructor(spriteTexture) {
        super(null);
        this.kDelta = 1.0;
        this.mRenderComponent = new engine.LightRenderable(spriteTexture);
        this.mRenderComponent.setColor([1, 1, 1, 0]);
        this.mRenderComponent.getXform().setPosition(100, 75);
        this.mRenderComponent.getXform().setSize(18, 20);
        this.mRenderComponent.setElementPixelPositions(0, 34, 254, 288);
    }

    update() {
        // control by arrow keys
        let xform = this.getXform();
        if (engine.input.isKeyPressed(engine.input.keys.Up)) {
            xform.incYPosBy(this.kDelta);
        }
        if (engine.input.isKeyPressed(engine.input.keys.Down)) {
            xform.incYPosBy(-this.kDelta);
        }
        if (engine.input.isKeyPressed(engine.input.keys.Left)) {
            xform.incXPosBy(-this.kDelta);
        }
        if (engine.input.isKeyPressed(engine.input.keys.Right)) {
            xform.incXPosBy(this.kDelta);
        }
    }
}

export default Hero;
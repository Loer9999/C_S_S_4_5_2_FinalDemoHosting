"use strict"
import engine from "../../engine/index.js";
import Minion from "../objects/minion.js";

class Patrol extends engine.GameObject {
    constructor(spriteTexture, worldBound, xPos, yPos) {
        super(null);

        //Size of sprite
        this.headWidth = 7.5;

        this.worldBound = worldBound;

        //Speed and direction
        this.mSpeed = (Math.random() * 5 + 5) / 60;
        this.direct = [Math.random() * 2 - 1, Math.random() * 2 - 1];
        this.setCurrentFrontDir(this.direct);

        //Bool values
        this.headHit = false;

        this.mDelete = false;

        //Head sprite settings
        this.mRenderComponent = new engine.LightRenderable(spriteTexture);
        this.mRenderComponent.setColor([1, 1, 1, 0]);
        this.mRenderComponent.getXform().setPosition(xPos, yPos);
        this.mRenderComponent.getXform().setSize(this.headWidth, this.headWidth);
        this.mRenderComponent.setElementPixelPositions(120, 300, 0, 180);

        //Wings
        this.leftWing = new Minion(spriteTexture, xPos + 10, yPos + 6);
        this.rightWing = new Minion(spriteTexture, xPos + 10, yPos - 6);
    }

    draw(camera) {
        super.draw(camera);
        this.leftWing.draw(camera);
        this.rightWing.draw(camera);
    }

    isHit() {
        return this.headHit;
    }

    setHit(input) {
        this.headHit = input;
    }

    getWing(input) {
        if(input == 0) {
            return this.leftWing;
        } else if(input == 1) {
            return this.rightWing;
        }
    }

    getDelete() {
        return this.mDelete;
    }

    deleteCheck() {
        let mXform = this.getXform();
        let box = new engine.BoundingBox([mXform.getXPos() + 5, mXform.getYPos()], 17.5, 23.5);

        if(this.worldBound.boundCollideStatus(box) == 0 || 
            this.leftWing.mRenderComponent.getColor()[3] >= 1.0 ||
            this.rightWing.mRenderComponent.getColor()[3] >= 1.0) {
            this.mDelete = true;
        }
    }

    update() {
        super.update();

        let mXform = this.getXform();
        //BBox
        let box = new engine.BoundingBox([mXform.getXPos() + 5, mXform.getYPos()], 17.5, 23.5);


        if(this.isHit()) {
            //Head hit

            mXform.incXPosBy(5.0);
            this.setHit(false);

        } else {
            //As normal
            //World Boundary Collision Detection
            let boundStatus = this.worldBound.boundCollideStatus(box);
            if(boundStatus > 0) {
                let currDir = this.getCurrentFrontDir();
                //console.log(boundStatus);
                if(boundStatus == 1 || boundStatus == 2) {
                    //Left and Right
                    currDir[0] = currDir[0] * -1;
                    this.setCurrentFrontDir(currDir);
                    console.log("Changed Direction");

                } else if(boundStatus == 4 || boundStatus == 8) {
                    //Top and Bottom
                    currDir[1] = currDir[1] * -1;
                    this.setCurrentFrontDir(currDir);
                    console.log("Changed Direction");
                } 
            }
            
            let leftPos = [mXform.getXPos() + 10, mXform.getYPos() + 6];
            let rightPos = [mXform.getXPos() + 10, mXform.getYPos() - 6];
            this.leftWing.mLerp.setFinal(leftPos);
            this.rightWing.mLerp.setFinal(rightPos);
            
        }

        this.leftWing.update();
        this.rightWing.update();

        this.deleteCheck();
    }

}

export default Patrol;






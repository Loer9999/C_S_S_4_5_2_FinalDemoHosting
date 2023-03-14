"use strict";

import engine from "../../engine/index.js";
import GameObjectSet from "../../engine/game_objects/game_object_set.js";
import DyePack from "./dye_pack.js";

class DyePackSet extends GameObjectSet {
    constructor(hero, minionSprite, worldBound) {
        super();
        this.mHero = hero;
        this.kMinionSprite = minionSprite;
        this.mWorldBound = worldBound;
    }

    update() {
        // Check whether the dyepack should be deleted.
        for(let j = 0; j < this.mSet.length; j++) {
            if(this.mSet[j].shouldDelete()) {
                this.removeOneAtIndex(j);
                //console.log("Removed");
            }
        }

        super.update();

        // Create new dyepacks when the space bar is clicked.
        if (engine.input.isKeyClicked(engine.input.keys.Space)) {
            let position = [this.mHero.getXPos() + 1, this.mHero.getYPos() + 3];
            this.addToSet(new DyePack(this.kMinionSprite, position, this.mWorldBound));
        }
    }
}

export default DyePackSet;
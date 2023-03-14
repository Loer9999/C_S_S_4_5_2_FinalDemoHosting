"use strict";

import engine from "../../engine/index.js";
import Patrol from "./patrol.js";
import GameObjectSet from "../../engine/game_objects/game_object_set.js";

class PatrolSet extends GameObjectSet{
    constructor(spriteTexture, worldBound) {
        super();

        this.sprite = spriteTexture;
        this.worldBound = worldBound;

        this.autoSpawn = false;
        this.timer = Math.random() * 60 + 120;
    }

    getAutoSpawn() {
        return this.autoSpawn;
    }

    createPatrol() {
        //Creates a patrol within the defined bounds
        let x = Math.random() * 84 + 100;
        let y = Math.random() * 75 + 32.5;
        this.addToSet(new Patrol(this.sprite, this.worldBound, x, y));
    }

    autoSpawnPatrols() {
        if (this.getAutoSpawn()) {
            this.timer -= 1;
            
            if (this.timer <= 0) {
                this.createPatrol();
                this.timer = Math.random() * 60 + 120;
            }
        }
    }

    update() {
        //Updates all patrols in list
        super.update();

        //If the patrol should be deleted, remove it
        for(let j = 0; j < this.mSet.length; j++) {
            if(this.mSet[j].getDelete()) {
                this.removeOneAtIndex(j);
                //console.log("Removed");
            }
        }

        //All patrols knocked back with J
        if(engine.input.isKeyClicked(engine.input.keys.J)) {
            for(let i = 0; i < this.mSet.length; i++) {
                this.mSet[i].setHit(true);
            }
        }

        //New patrol created with C
        if(engine.input.isKeyClicked(engine.input.keys.C)) {
            this.createPatrol();
        }

        //Toggle autospawning with P
        if(engine.input.isKeyClicked(engine.input.keys.P)) {
            this.autoSpawn = !this.autoSpawn;

            if (this.getAutoSpawn()) {
                this.timer = Math.random() * 60 + 120;
            }
        }
        this.autoSpawnPatrols();
    }
}

export default PatrolSet;
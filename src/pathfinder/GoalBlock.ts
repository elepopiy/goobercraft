import { Vec3 } from "vec3";
import { Goal } from "./types";

export class GoalBlock implements Goal {

    public readonly position: Vec3;

    constructor(position: Vec3) {

        this.position = position.floored();

    }

    isEnd(position: Vec3): boolean {

        return position.equals(this.position);

    }

    heuristic(position: Vec3): number {

        return position.distanceTo(this.position);

    }

}
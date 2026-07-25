import { Vec3 } from "vec3";

export interface Goal {
    isEnd(position:Vec3):boolean;
    heuristic(position:Vec3):number;
}


export interface PathfinderAPI {

    goto(goal:Goal):Promise<void>;

    setGoal(goal:Goal):void;

    stop():void;

    isMoving():boolean;

}
import { Vec3 } from "vec3";

import { EventBus } from "../core/EventBus";

import { Pathfinder } from "../pathfinder/Pathfinder";

import { GoalBlock } from "../pathfinder/GoalBlock";

import { WorldManager } from "./WorldManager";

import { MovementManager } from "./MovementManager";

import { TeleportManager } from "./TeleportManager";



export class PathfinderManager {

    private readonly pathfinder: Pathfinder;



    constructor(

        private readonly bus: EventBus,

        private readonly world: WorldManager,

        private readonly movement: MovementManager,

        private readonly teleport: TeleportManager

    ) {

        this.pathfinder = new Pathfinder(

            {

                get position() {

                    return teleport.position;

                },



                look(yaw: number, pitch: number) {

                    movement.look(

                        yaw,

                        pitch

                    );

                },



                move(control: any, state: boolean) {

                    movement.setControlState(

                        control,

                        state

                    );

                },



                setControlState(control: any, state: boolean) {

                    movement.setControlState(

                        control,

                        state

                    );

                },



                jump() {

                    movement.jump();

                },



                stop() {

                    movement.stop();

                }

            } as any,

            world

        );



        this.registerEvents();

    }





    private registerEvents(): void {

        this.bus.on(

            "end",

            () => {

                this.stop();

            }

        );

    }





    /**
     * Hedefe git
     */
    goto(

        position: Vec3

    ): Promise<void> {

        return this.pathfinder.goto(

            new GoalBlock(position)

        );

    }





    /**
     * Pathfinder durdur
     */
    stop(): void {

        this.pathfinder.stop();

    }





    /**
     * Hareket ediyor mu?
     */
    get isMoving(): boolean {

        return this.pathfinder.isMoving();

    }





    /**
     * Aktif path
     */
    getPath() {

        return this.pathfinder.getPath();

    }

}
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PathfinderManager = void 0;
const Pathfinder_1 = require("../pathfinder/Pathfinder");
const GoalBlock_1 = require("../pathfinder/GoalBlock");
class PathfinderManager {
    bus;
    world;
    movement;
    teleport;
    pathfinder;
    constructor(bus, world, movement, teleport) {
        this.bus = bus;
        this.world = world;
        this.movement = movement;
        this.teleport = teleport;
        this.pathfinder = new Pathfinder_1.Pathfinder({
            get position() {
                return teleport.position;
            },
            look(yaw, pitch) {
                movement.look(yaw, pitch);
            },
            move(control, state) {
                movement.setControlState(control, state);
            },
            setControlState(control, state) {
                movement.setControlState(control, state);
            },
            jump() {
                movement.jump();
            },
            stop() {
                movement.stop();
            }
        }, world);
        this.registerEvents();
    }
    registerEvents() {
        this.bus.on("end", () => {
            this.stop();
        });
    }
    /**
     * Hedefe git
     */
    goto(position) {
        return this.pathfinder.goto(new GoalBlock_1.GoalBlock(position));
    }
    /**
     * Pathfinder durdur
     */
    stop() {
        this.pathfinder.stop();
    }
    /**
     * Hareket ediyor mu?
     */
    get isMoving() {
        return this.pathfinder.isMoving();
    }
    /**
     * Aktif path
     */
    getPath() {
        return this.pathfinder.getPath();
    }
}
exports.PathfinderManager = PathfinderManager;
//# sourceMappingURL=PathfinderManager.js.map
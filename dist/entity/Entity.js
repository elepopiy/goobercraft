"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
const vec3_1 = require("vec3");
class Entity {
    id;
    uuid;
    type;
    kind;
    name;
    position;
    velocity;
    yaw = 0;
    pitch = 0;
    headYaw = 0;
    onGround = true;
    metadata = {};
    isPlayer = false;
    health;
    username;
    constructor(id, type, position) {
        this.id = id;
        this.type = type;
        this.position = position;
        this.velocity = new vec3_1.Vec3(0, 0, 0);
    }
    distanceTo(point) {
        return this.position.distanceTo(point);
    }
}
exports.Entity = Entity;
//# sourceMappingURL=Entity.js.map
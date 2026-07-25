"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerEntity = void 0;
const Entity_1 = require("./Entity");
class PlayerEntity extends Entity_1.Entity {
    isPlayer = true;
    uuid;
    ping = 0;
    gamemode = 0;
    displayName;
    constructor(id, uuid, position, username) {
        super(id, -1, position);
        this.uuid = uuid;
        this.username = username;
    }
}
exports.PlayerEntity = PlayerEntity;
//# sourceMappingURL=PlayerEntity.js.map
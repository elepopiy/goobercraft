"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalBlock = void 0;
class GoalBlock {
    position;
    constructor(position) {
        this.position = position.floored();
    }
    isEnd(position) {
        return position.equals(this.position);
    }
    heuristic(position) {
        return position.distanceTo(this.position);
    }
}
exports.GoalBlock = GoalBlock;
//# sourceMappingURL=GoalBlock.js.map
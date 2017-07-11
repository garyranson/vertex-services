"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var VertexActions = (function () {
    function VertexActions(actions) {
        this.actions = actions;
    }
    VertexActions.prototype.getActionSet = function (nodeKey) {
        return this.actions[parseInt(nodeKey, 10)];
    };
    return VertexActions;
}());
exports.VertexActions = VertexActions;
//# sourceMappingURL=vertex-actions.js.map
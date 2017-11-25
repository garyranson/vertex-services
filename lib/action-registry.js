"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var action_compilers_1 = require("./action-compilers");
var ActionRegistry = (function () {
    function ActionRegistry(f1, dummyAction) {
        this.dummyAction = dummyAction;
        this.registry = new Map();
        this.registry.set(f1.getActionName(), f1);
    }
    ActionRegistry.prototype.register = function (compiler) {
        this.registry.set(compiler.getActionName(), compiler);
    };
    ActionRegistry.prototype.get = function (actionName) {
        return this.registry.get(actionName) || this.dummyAction;
    };
    ActionRegistry._inject = [action_compilers_1.ActionBind, action_compilers_1.DummyActionCompiler];
    return ActionRegistry;
}());
exports.ActionRegistry = ActionRegistry;
//# sourceMappingURL=action-registry.js.map
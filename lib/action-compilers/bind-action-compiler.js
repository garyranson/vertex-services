"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var expression_compiler_1 = require("expression-compiler");
var bind_action_default_1 = require("./bind-action-default");
var bind_action_size_1 = require("./bind-action-size");
var bind_action_position_1 = require("./bind-action-position");
var bind_action_transform_1 = require("./bind-action-transform");
var ActionBind = (function () {
    function ActionBind(compiler, actionDefault, sizeActionFactory, position, transform) {
        this.compiler = compiler;
        this.actionDefault = actionDefault;
        this.cache = {
            "size": sizeActionFactory,
            "position": position,
            "transform": transform
        };
    }
    ActionBind.prototype.getActionName = function () {
        return "bind";
    };
    ActionBind.prototype.compile = function (attributeName, expr) {
        return (this.cache[attributeName] || this.actionDefault).create(this.compiler.compileMulti(expr), attributeName);
    };
    ActionBind._inject = [expression_compiler_1.Compiler, bind_action_default_1.DefaultActionFactory, bind_action_size_1.SizeActionFactory, bind_action_position_1.PositionActionFactory, bind_action_transform_1.TransformActionFactory];
    return ActionBind;
}());
exports.ActionBind = ActionBind;
//# sourceMappingURL=bind-action-compiler.js.map
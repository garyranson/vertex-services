"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var expression_compiler_1 = require("expression-compiler");
var definitions_1 = require("./definitions");
var action_bind_default_1 = require("./action-bind-default");
var action_bind_size_1 = require("./action-bind-size");
var action_bind_position_1 = require("./action-bind-position");
var action_bind_transform_1 = require("./action-bind-transform");
var ActionBind = (function (_super) {
    __extends(ActionBind, _super);
    function ActionBind(compiler, actionDefault, sizeActionFactory, position, transform) {
        var _this = _super.call(this) || this;
        _this.compiler = compiler;
        _this.actionDefault = actionDefault;
        _this.cache = {
            "size": sizeActionFactory,
            "position": position,
            "transform": transform
        };
        return _this;
    }
    ActionBind.prototype.compile = function (attributeName, expr) {
        return (this.cache[attributeName] || this.actionDefault).create(this.compiler.compileMulti(expr), attributeName);
    };
    ActionBind._inject = [expression_compiler_1.Compiler, action_bind_default_1.DefaultActionFactory, action_bind_size_1.SizeActionFactory, action_bind_position_1.PositionActionFactory, action_bind_transform_1.TransformActionFactory];
    return ActionBind;
}(definitions_1.ActionCompiler));
exports.ActionBind = ActionBind;
//# sourceMappingURL=action-bind.js.map
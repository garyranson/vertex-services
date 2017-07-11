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
var action_bind_1 = require("./action-bind");
var definitions_1 = require("./definitions");
var DummyCompiler = (function (_super) {
    __extends(DummyCompiler, _super);
    function DummyCompiler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DummyCompiler.prototype.compile = function (attributeName, expr) {
        console.log("invalid attributeAction " + attributeName);
        return new NullInstruction();
    };
    return DummyCompiler;
}(definitions_1.ActionCompiler));
exports.DummyCompiler = DummyCompiler;
var NullInstruction = (function () {
    function NullInstruction() {
    }
    NullInstruction.prototype.execute = function (element, scope) {
    };
    return NullInstruction;
}());
var Actions = (function () {
    function Actions(f1, dummy) {
        this.dummy = dummy;
        this.registry = new Map();
        this.registry.set("bind", f1);
    }
    Actions.prototype.get = function (actionName) {
        return this.registry.get(actionName) || this.dummy;
    };
    return Actions;
}());
Actions._inject = [action_bind_1.ActionBind, DummyCompiler];
exports.Actions = Actions;
//# sourceMappingURL=actions.js.map
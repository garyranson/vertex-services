"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DummyActionCompiler = (function () {
    function DummyActionCompiler() {
    }
    DummyActionCompiler.prototype.compile = function (attributeName, expr) {
        console.log("invalid attributeAction " + attributeName);
        return new NullInstruction();
    };
    DummyActionCompiler.prototype.getActionName = function () {
        return "_dummy_";
    };
    return DummyActionCompiler;
}());
exports.DummyActionCompiler = DummyActionCompiler;
var NullInstruction = (function () {
    function NullInstruction() {
    }
    NullInstruction.prototype.execute = function (element, scope) {
    };
    return NullInstruction;
}());
//# sourceMappingURL=dummy-action-compiler.js.map
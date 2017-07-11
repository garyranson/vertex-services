"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var string_intern_1 = require("./string-intern");
var DefaultActionFactory = (function () {
    function DefaultActionFactory(intern) {
        this.intern = intern;
    }
    DefaultActionFactory.prototype.create = function (instr, attributeName) {
        return new DefaultAction1(this.intern.get(attributeName), instr[0]);
    };
    return DefaultActionFactory;
}());
DefaultActionFactory._inject = [string_intern_1.Intern];
exports.DefaultActionFactory = DefaultActionFactory;
var DefaultAction1 = (function () {
    function DefaultAction1(attributeName, offset) {
        this.attributeName = attributeName;
        this.offset = offset;
    }
    DefaultAction1.prototype.execute = function (element, scope) {
        element.setAttribute(this.attributeName, this.offset.eval(scope));
    };
    return DefaultAction1;
}());
//# sourceMappingURL=action-bind-default.js.map
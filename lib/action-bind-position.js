"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PositionActionFactory = (function () {
    function PositionActionFactory() {
    }
    PositionActionFactory.prototype.create = function (instr) {
        return (!instr || instr.length === 0)
            ? new PositionAction1F(0)
            : createPositionInstruction(instr[0], instr[1]);
    };
    return PositionActionFactory;
}());
exports.PositionActionFactory = PositionActionFactory;
function createPositionInstruction(a1, a2) {
    return ((a1 === a2) || !a2)
        ? a1.isConstant()
            ? new PositionAction1F(a1.eval())
            : new PositionAction1(a1)
        : a1.isConstant() && a2.isConstant()
            ? new PositionAction2F(a1.eval(), a2.eval())
            : new PositionAction2(a1, a2);
}
var PositionAction1F = (function () {
    function PositionAction1F(offset) {
        this.offset = offset;
    }
    PositionAction1F.prototype.execute = function (element, scope) {
        setElementPosition(element, scope, this.offset, this.offset);
    };
    return PositionAction1F;
}());
var PositionAction1 = (function () {
    function PositionAction1(offset) {
        this.offset = offset;
    }
    PositionAction1.prototype.execute = function (element, scope) {
        var offset = this.offset.eval(scope);
        setElementPosition(element, scope, offset, offset);
    };
    return PositionAction1;
}());
var PositionAction2F = (function () {
    function PositionAction2F(offsetX, offsetY) {
        this.offsetX = offsetX;
        this.offsetY = offsetY;
    }
    PositionAction2F.prototype.execute = function (element, scope) {
        setElementPosition(element, scope, this.offsetX, this.offsetY);
    };
    return PositionAction2F;
}());
var PositionAction2 = (function () {
    function PositionAction2(x, y) {
        this.x = x;
        this.y = y;
    }
    PositionAction2.prototype.execute = function (element, scope) {
        setElementPosition(element, scope, this.x.eval(scope), this.y.eval(scope));
    };
    return PositionAction2;
}());
function setElementPosition(element, scope, offsetX, offsetY) {
    element.setAttribute("x", scope.x + offsetX);
    element.setAttribute("y", scope.y + offsetY);
}
//# sourceMappingURL=action-bind-position.js.map
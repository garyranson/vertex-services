"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SizeActionFactory = (function () {
    function SizeActionFactory() {
    }
    SizeActionFactory.prototype.create = function (instr) {
        return (!instr || instr.length === 0)
            ? new SizeAction1F(0)
            : createSizeInstruction(instr[0], instr[1]);
    };
    return SizeActionFactory;
}());
exports.SizeActionFactory = SizeActionFactory;
function createSizeInstruction(a1, a2) {
    return ((a1 === a2) || !a2)
        ? a1.isConstant()
            ? new SizeAction1F(a1.eval())
            : new SizeAction1(a1)
        : a1.isConstant() && a2.isConstant()
            ? new SizeAction2F(a1.eval(), a2.eval())
            : new SizeAction2(a1, a2);
}
var SizeAction1F = (function () {
    function SizeAction1F(offset) {
        this.offset = offset;
    }
    SizeAction1F.prototype.execute = function (element, scope) {
        setSize(element, scope, this.offset, this.offset);
    };
    return SizeAction1F;
}());
var SizeAction1 = (function () {
    function SizeAction1(offset) {
        this.offset = offset;
    }
    SizeAction1.prototype.execute = function (element, scope) {
        var offset = this.offset.eval(scope);
        setSize(element, scope, offset, offset);
    };
    return SizeAction1;
}());
var SizeAction2F = (function () {
    function SizeAction2F(offsetX, offsetY) {
        this.offsetX = offsetX;
        this.offsetY = offsetY;
    }
    SizeAction2F.prototype.execute = function (element, scope) {
        setSize(element, scope, this.offsetX, this.offsetY);
    };
    return SizeAction2F;
}());
var SizeAction2 = (function () {
    function SizeAction2(x, y) {
        this.x = x;
        this.y = y;
    }
    SizeAction2.prototype.execute = function (element, scope) {
        setSize(element, scope, this.x.eval(scope), this.y.eval(scope));
    };
    return SizeAction2;
}());
function setSize(element, scope, width, height) {
    element.setAttribute("width", scope.width + width);
    element.setAttribute("height", scope.height + height);
}
//# sourceMappingURL=action-bind-size.js.map
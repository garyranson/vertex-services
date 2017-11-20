"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
var TransformActionFactory = (function () {
    function TransformActionFactory() {
    }
    TransformActionFactory.prototype.create = function (instr) {
        return new TransformAction(instr);
    };
    return TransformActionFactory;
}());
exports.TransformActionFactory = TransformActionFactory;
var TransformAction = (function () {
    function TransformAction(instr) {
        this.instr = instr;
    }
    TransformAction.prototype.execute = function (element, scope) {
        scope.scale = scale;
        scope.translate = translate;
        var transformList = element["transform"].baseVal;
        transformList.clear();
        for (var _i = 0, _a = this.instr; _i < _a.length; _i++) {
            var f = _a[_i];
            transformList.appendItem(f.eval(scope));
        }
        console.log("here");
    };
    return TransformAction;
}());
function scale(val1) {
    var tfm = _svg.createSVGTransform();
    tfm.setScale(val1, val1);
    return tfm;
}
function translate(x, y) {
    var tfm = _svg.createSVGTransform();
    tfm.setTranslate(x, y);
    return tfm;
}
//# sourceMappingURL=action-bind-transform.js.map
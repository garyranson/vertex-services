"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
var TransformActionFactory = (function () {
    function TransformActionFactory() {
    }
    TransformActionFactory.prototype.create = function (instructions) {
        return new TransformAction(instructions);
    };
    return TransformActionFactory;
}());
exports.TransformActionFactory = TransformActionFactory;
var TransformAction = (function () {
    function TransformAction(instructions) {
        this.instructions = instructions;
    }
    TransformAction.prototype.execute = function (element, scope) {
        scope.scale = scale;
        scope.translate = translate;
        var transformList = element["transform"].baseVal;
        transformList.clear();
        for (var _i = 0, _a = this.instructions; _i < _a.length; _i++) {
            var f = _a[_i];
            transformList.appendItem(f.eval(scope));
        }
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
//# sourceMappingURL=bind-action-transform.js.map
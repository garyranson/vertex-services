"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Vertex = (function () {
    function Vertex(root, actions) {
        this.root = root;
        this.actions = actions;
    }
    Vertex.prototype.update = function (scope) {
        var a1 = this.root.getAttribute("px");
        if (a1) {
            this.actions.getActionSet(a1).execute(this.root, scope);
        }
        var els = this.root.querySelectorAll("[px]");
        for (var i = els.length - 1; i >= 0; i--) {
            var el = els[i];
            this.actions.getActionSet(el.getAttribute("px")).execute(el, scope);
        }
        return this;
    };
    return Vertex;
}());
exports.Vertex = Vertex;
//# sourceMappingURL=vertex.js.map
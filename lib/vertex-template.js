"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vertex_1 = require("./vertex");
function Freeze(obj) {
    return Object.freeze(obj);
}
var VertexTemplateImpl = (function () {
    function VertexTemplateImpl(root, vertexController, actions, definitions) {
        this.root = root;
        this.vertexController = vertexController;
        this.actions = actions;
        this.definitions = definitions;
    }
    VertexTemplateImpl.prototype.createVertex = function () {
        return new vertex_1.Vertex(this.root.cloneNode(true), this.actions);
    };
    VertexTemplateImpl.prototype.getDefinitions = function () {
        return this.definitions;
    };
    return VertexTemplateImpl;
}());
var VertexTemplateFactory = (function () {
    function VertexTemplateFactory() {
    }
    VertexTemplateFactory.prototype.createInstance = function (root, viewController, actions, definitions) {
        return Freeze(new VertexTemplateImpl(root, viewController, actions, definitions));
    };
    return VertexTemplateFactory;
}());
exports.VertexTemplateFactory = VertexTemplateFactory;
//# sourceMappingURL=vertex-template.js.map
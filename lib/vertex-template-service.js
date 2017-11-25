"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vertex_template_1 = require("./vertex-template");
var svg_helper_1 = require("./svg-helper");
var vertex_actions_1 = require("./vertex-actions");
var action_registry_1 = require("./action-registry");
// noinspection JSUnusedGlobalSymbols
var VertexTemplateService = (function () {
    function VertexTemplateService(svgHelper, actions, templateFactory) {
        this.svgHelper = svgHelper;
        this.actions = actions;
        this.templateFactory = templateFactory;
    }
    VertexTemplateService.prototype.createTemplate = function (markup, viewController) {
        /* dom is mutated - do not inline anything here ! */
        var dom = this.svgHelper.parseSvgMarkup(markup);
        var definitions = this._extractDefinitions(dom);
        var actions = this._createTemplateActions(dom);
        var domEntryPoint = dom.querySelector("[px-node]");
        return this.templateFactory.createInstance(domEntryPoint.cloneNode(true), viewController, actions, definitions);
    };
    VertexTemplateService.prototype._createTemplateActions = function (root) {
        var _this = this;
        var walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT), elementActions = [], el;
        while (el = walker.nextNode()) {
            var attrs = this._getActionAttributes(el.attributes);
            if (!attrs)
                continue;
            var actions = attrs.map(function (attr) {
                return _this.actions.get(attr.actionName).compile(attr.attributeName, attr.value);
            });
            el.setAttributeNS(null, "px", elementActions.length);
            elementActions.push((actions.length === 1) ? actions[0] : new BindActionMulti(actions));
            for (var _i = 0, attrs_1 = attrs; _i < attrs_1.length; _i++) {
                var attr = attrs_1[_i];
                el.attributes.removeNamedItem(attr.name);
            }
        }
        return new vertex_actions_1.VertexActions(elementActions);
    };
    VertexTemplateService.prototype._getActionAttributes = function (attributes) {
        var attrs;
        for (var i = attributes.length - 1; i >= 0; i--) {
            var attr = attributes[i];
            var dot = attr.name.indexOf(".");
            if (dot >= 0) {
                if (!attrs)
                    attrs = [];
                attrs.push({
                    name: attr.name,
                    value: attr.value.trim(),
                    actionName: attr.name.substr(dot + 1).trim(),
                    attributeName: attr.name.substr(0, dot).trim()
                });
            }
        }
        return attrs;
    };
    VertexTemplateService.prototype.getXLinkHRefs = function (root) {
        var rc = [];
        var hRefNodes = root.querySelectorAll("[*|href]:not([href])");
        for (var i = hRefNodes.length - 1; i >= 0; i--) {
            var el = hRefNodes[i];
            var hrefAttr = el.getAttributeNS("http://www.w3.org/1999/xlink", "href");
            if (hrefAttr && hrefAttr.startsWith("#")) {
                rc.push({
                    element: el,
                    value: hrefAttr
                });
            }
        }
        return rc;
    };
    VertexTemplateService.prototype._extractDefinitions = function (root) {
        var cache = new Map(), def = [], i = 0;
        for (var _i = 0, _a = this.getXLinkHRefs(root); _i < _a.length; _i++) {
            var href = _a[_i];
            var id = cache.get(href.value);
            if (!id) {
                var el = root.getElementById(href.value.substr(1));
                if (el) {
                    id = "@px@" + (++i).toString(36);
                    cache.set(href.value, id);
                    el.setAttribute("id", id);
                    def.push(el);
                }
            }
            if (id) {
                href.element.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#" + id);
            }
        }
        return def;
    };
    VertexTemplateService._inject = [svg_helper_1.SvgHelper, action_registry_1.ActionRegistry, vertex_template_1.VertexTemplateFactory];
    return VertexTemplateService;
}());
exports.VertexTemplateService = VertexTemplateService;
var BindActionMulti = (function () {
    function BindActionMulti(actions) {
        this.actions = actions;
    }
    BindActionMulti.prototype.execute = function (el, scope) {
        for (var _i = 0, _a = this.actions; _i < _a.length; _i++) {
            var action = _a[_i];
            action.execute(el, scope);
        }
    };
    return BindActionMulti;
}());
//# sourceMappingURL=vertex-template-service.js.map
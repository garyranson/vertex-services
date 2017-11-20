"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dom_helper_1 = require("./dom-helper");
var svgNS = "http://www.w3.org/2000/svg";
var SvgHelper = (function () {
    function SvgHelper(dom) {
        this.dom = dom;
        this._svg = document.createElementNS(svgNS, "svg");
    }
    SvgHelper.prototype.parseSvgMarkup = function (svgMarkup) {
        var el = document.createElementNS(svgNS, "svg");
        el.innerHTML = svgMarkup;
        return this.dom.normalise(el);
    };
    SvgHelper.prototype.createDefElement = function () {
        return document.createElementNS(svgNS, "def");
    };
    SvgHelper.prototype.getSVG = function () {
        return this._svg;
    };
    SvgHelper._inject = [dom_helper_1.DomHelper];
    return SvgHelper;
}());
exports.SvgHelper = SvgHelper;
//# sourceMappingURL=svg-helper.js.map
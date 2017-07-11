"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DomHelper = (function () {
    function DomHelper() {
    }
    DomHelper.prototype.normalise = function (dom) {
        getCommentsAndEmptyTextNodes(dom).forEach(function (node) {
            node.parentElement.removeChild(node);
        });
        return dom;
    };
    return DomHelper;
}());
exports.DomHelper = DomHelper;
function getCommentsAndEmptyTextNodes(node) {
    var tw = document.createTreeWalker(node, NodeFilter.SHOW_COMMENT + NodeFilter.SHOW_TEXT);
    var remove = [];
    while (tw.nextNode()) {
        if (tw.currentNode.nodeType !== 3 || /^\s*$/.test(tw.currentNode.nodeValue) === true) {
            remove.push(tw.currentNode);
        }
    }
    return remove;
}
//# sourceMappingURL=dom-helper.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Intern = (function () {
    function Intern() {
        this.cache = {};
    }
    Intern.prototype.get = function (str) {
        return this.cache[str] || (this.cache[str] = str);
    };
    Intern.prototype.has = function (str) {
        return !!this.cache[str];
    };
    return Intern;
}());
exports.Intern = Intern;
//# sourceMappingURL=string-intern.js.map
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

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


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var vertex_1 = __webpack_require__(0);
function Freeze(obj) {
    return Object.freeze(obj);
}
var VertexTemplateImpl = (function () {
    // noinspection JSUnusedLocalSymbols
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


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Instructions = __webpack_require__(3);
class CompileVisitor {
    visitConcatenate(expr) {
        let instructions = this.resolveArgs(expr);
        return instructions.length === 1
            ? instructions[0]
            : new Instructions.ConcatenateInstruction(instructions);
    }
    visitBinary(operator, left, right) {
        const instruction = new (getBinaryInstruction(operator))(left.visit(this), right.visit(this));
        return instruction.isConstant()
            ? new Instructions.LiteralInstruction(instruction.eval())
            : instruction;
    }
    visitLogicalOr(left, right) {
        const leftIns = left.visit(this);
        return leftIns.isConstant()
            ? leftIns.eval()
                ? leftIns
                : right.visit(this)
            : new Instructions.LogicalOrInstruction(leftIns, right.visit(this));
    }
    visitLogicalAnd(left, right) {
        const ins = new Instructions.LogicalAndInstruction(left.visit(this), right.visit(this));
        return ins.isConstant()
            ? new Instructions.LiteralInstruction(ins.eval(null))
            : ins;
    }
    visitLogical(operator, left, right) {
        switch (operator) {
            case "||":
                return this.visitLogicalOr(left, right);
            case "&&":
                return this.visitLogicalAnd(left, right);
        }
    }
    visitLiteral(value, raw) {
        return new Instructions.LiteralInstruction(value);
    }
    visitScopedAccessor(name) {
        return new Instructions.ScopedAccessorInstruction(name);
    }
    visitMember(object, property, computed) {
        const p = property.visit(this);
        return p.isConstant()
            ? new Instructions.MemberAccessorInstruction(object.visit(this), property.visit(this))
            : new Instructions.DirectMemberAccessorInstruction(object.visit(this), p.eval());
    }
    visitMemberCall(object, expression, args) {
        return new (getMemberCallInstruction(args.length))(object.visit(this), expression.visit(this), this.resolveArgs(args));
    }
    visitCall(callee, args) {
        return new (getCallInstruction(args.length))(callee.visit(this), this.resolveArgs(args));
    }
    visitConditional(test, consequent, alternate) {
        const testIns = test.visit(this);
        return testIns.isConstant()
            ? testIns.eval()
                ? consequent.visit(this)
                : alternate.visit(this)
            : new Instructions.ConditionalInstruction(testIns, consequent.visit(this), alternate.visit(this));
    }
    visitUnary(operator, argument) {
        const ctor = getUnaryInstruction(operator);
        const instruction = new ctor(argument.visit(this));
        return instruction.isConstant() ? new Instructions.LiteralInstruction(instruction.eval()) : instruction;
    }
    visitArray(elements) {
        return new Instructions.ArrayInstruction(this.resolveArgs(elements));
    }
    visitObject(propertyNames, expressions) {
        const inst = new Instructions.ObjectInstruction(propertyNames, this.resolveArgs(expressions));
        return inst.isConstant()
            ? new Instructions.LiteralInstruction(inst.eval(null))
            : inst;
    }
    resolveArgs(args) {
        return args.map((arg) => arg.visit(this));
    }
}
exports.CompileVisitor = CompileVisitor;
function getUnaryInstruction(operator) {
    switch (operator) {
        case "+":
            return Instructions.UnaryPlusInstruction;
        case "-":
            return Instructions.UnaryMinusInstruction;
        case "!":
            return Instructions.UnaryNotInstruction;
    }
}
function getCallInstruction(length) {
    switch (length) {
        case 0:
            return Instructions.ScopeCall0Instruction;
        case 1:
            return Instructions.ScopeCall1Instruction;
        case 2:
            return Instructions.ScopeCall2Instruction;
        case 3:
            return Instructions.ScopeCall3Instruction;
        default:
            return Instructions.ScopeCallInstruction;
    }
}
function getMemberCallInstruction(length) {
    switch (length) {
        case 0:
            return Instructions.MemberCall0Instruction;
        case 1:
            return Instructions.MemberCall1Instruction;
        case 2:
            return Instructions.MemberCall2Instruction;
        case 3:
            return Instructions.MemberCall3Instruction;
        default:
            return Instructions.MemberCallInstruction;
    }
}
function getBinaryInstruction(operator) {
    switch (operator) {
        case "==":
            return Instructions.BinaryEqualInstruction;
        case "!=":
            return Instructions.BinaryNotEqualInstruction;
        case "===":
            return Instructions.BinaryAbsEqualInstruction;
        case "!==":
            return Instructions.BinaryAbsNotEqualInstruction;
        case "<":
            return Instructions.BinaryLessThanInstruction;
        case ">":
            return Instructions.BinaryGreaterThanInstruction;
        case "<=":
            return Instructions.BinaryLessEqualThanInstruction;
        case ">=":
            return Instructions.BinaryGreaterEqualThanInstruction;
        case "+":
            return Instructions.BinaryAddInstruction;
        case "-":
            return Instructions.BinarySubtractInstruction;
        case "*":
            return Instructions.BinaryMultiplyInstruction;
        case "/":
            return Instructions.BinaryDivideInstruction;
        case "%":
            return Instructions.BinaryModulusInstruction;
    }
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const emptyScope = Object.freeze({});
function evaluateAll(scope, args) {
    const rc = [];
    for (let i = 0; i < args.length; i++) {
        rc[i] = args[i].eval(scope);
    }
    return rc;
}
function isConstant(args) {
    for (let i = 0; i < args.length; i++) {
        if (!args[i].isConstant()) {
            return false;
        }
    }
    return true;
}
function failSafe() {
    throw "cannot call";
}
function safeCall(fn, method) {
    return (fn && fn[method]) || failSafe;
}
class BinaryBase {
    constructor(left, right) {
        this.left = left;
        this.right = right;
    }
    isConstant() {
        return this.left.isConstant() && this.right.isConstant();
    }
}
exports.BinaryBase = BinaryBase;
class LiteralInstruction {
    constructor(value) {
        this.value = value;
    }
    eval(scope) {
        return this.value;
    }
    isConstant() {
        return true;
    }
}
exports.LiteralInstruction = LiteralInstruction;
class ScopedAccessorInstruction {
    constructor(name) {
        this.name = name;
    }
    eval(scope) {
        return scope[this.name];
    }
    isConstant() {
        return false;
    }
}
exports.ScopedAccessorInstruction = ScopedAccessorInstruction;
class MemberAccessorInstruction {
    constructor(object, property) {
        this.object = object;
        this.property = property;
    }
    eval(scope) {
        return this.object.eval(scope)[this.property.eval(scope)];
    }
    isConstant() {
        return false;
    }
}
exports.MemberAccessorInstruction = MemberAccessorInstruction;
class DirectMemberAccessorInstruction {
    constructor(object, propertyName) {
        this.object = object;
        this.propertyName = propertyName;
    }
    eval(scope) {
        return this.object.eval(scope)[this.propertyName];
    }
    isConstant() {
        return false;
    }
}
exports.DirectMemberAccessorInstruction = DirectMemberAccessorInstruction;
class ConditionalInstruction {
    constructor(test, consequent, alternate) {
        this.test = test;
        this.consequent = consequent;
        this.alternate = alternate;
    }
    eval(scope) {
        return this.test.eval(scope) ? this.consequent.eval(scope) : this.alternate.eval(scope);
    }
    isConstant() {
        return this.test.isConstant();
    }
}
exports.ConditionalInstruction = ConditionalInstruction;
class UnaryPlusInstruction {
    constructor(argument) {
        this.argument = argument;
    }
    eval(scope) {
        return +this.argument.eval(scope);
    }
    isConstant() {
        return this.argument.isConstant();
    }
}
exports.UnaryPlusInstruction = UnaryPlusInstruction;
class UnaryMinusInstruction {
    constructor(argument) {
        this.argument = argument;
    }
    eval(scope) {
        return -this.argument.eval(scope);
    }
    isConstant() {
        return this.argument.isConstant();
    }
}
exports.UnaryMinusInstruction = UnaryMinusInstruction;
class UnaryNotInstruction {
    constructor(argument) {
        this.argument = argument;
    }
    eval(scope) {
        return !this.argument.eval(scope);
    }
    isConstant() {
        return this.argument.isConstant();
    }
}
exports.UnaryNotInstruction = UnaryNotInstruction;
class MemberCallInstruction {
    constructor(callee, member, args) {
        this.callee = callee;
        this.member = member;
        this.args = args;
    }
    eval(scope) {
        const result = this.callee.eval(scope);
        return safeCall(result, this.member.eval(scope)).apply(result, evaluateAll(scope, this.args));
    }
    isConstant() {
        return isConstant(this.args);
    }
}
exports.MemberCallInstruction = MemberCallInstruction;
class MemberCall0Instruction {
    constructor(callee, member) {
        this.callee = callee;
        this.member = member;
    }
    eval(scope) {
        const result = this.callee.eval(scope);
        return safeCall(result, this.member.eval(scope)).call(result);
    }
    isConstant() {
        return true;
    }
}
exports.MemberCall0Instruction = MemberCall0Instruction;
class MemberCall1Instruction {
    constructor(callee, member, args) {
        this.callee = callee;
        this.member = member;
        this.a1 = args[0];
    }
    eval(scope) {
        const result = this.callee.eval(scope);
        return safeCall(result, this.member.eval(scope)).call(result, this.a1.eval(scope));
    }
    isConstant() {
        return this.a1.isConstant();
    }
}
exports.MemberCall1Instruction = MemberCall1Instruction;
class MemberCall2Instruction {
    constructor(callee, member, args) {
        this.callee = callee;
        this.member = member;
        this.a1 = args[0];
        this.a2 = args[1];
    }
    eval(scope) {
        const result = this.callee.eval(scope);
        return safeCall(result, this.member.eval(scope)).call(result, this.a1.eval(scope), this.a2.eval(scope));
    }
    isConstant() {
        return isConstant([this.a1, this.a2]);
    }
}
exports.MemberCall2Instruction = MemberCall2Instruction;
class MemberCall3Instruction {
    constructor(callee, member, args) {
        this.callee = callee;
        this.member = member;
        this.a1 = args[0];
        this.a2 = args[1];
        this.a3 = args[2];
    }
    eval(scope) {
        const result = this.callee.eval(scope);
        return safeCall(result, this.member.eval(scope)).call(result, this.a1.eval(scope), this.a2.eval(scope), this.a3.eval(scope));
    }
    isConstant() {
        return isConstant([this.a1, this.a2, this.a3]);
    }
}
exports.MemberCall3Instruction = MemberCall3Instruction;
class ScopeCallInstruction {
    constructor(callee, args) {
        this.callee = callee;
        this.args = args;
    }
    eval(scope) {
        return this.callee.eval(scope).apply(emptyScope, evaluateAll(scope, this.args));
    }
    isConstant() {
        return isConstant(this.args);
    }
}
exports.ScopeCallInstruction = ScopeCallInstruction;
class ScopeCall0Instruction {
    constructor(callee) {
        this.callee = callee;
    }
    eval(scope) {
        return this.callee.eval(scope).call(emptyScope);
    }
    isConstant() {
        return true;
    }
}
exports.ScopeCall0Instruction = ScopeCall0Instruction;
class ScopeCall1Instruction {
    constructor(callee, args) {
        this.callee = callee;
        this.a1 = args[0];
    }
    eval(scope) {
        return this.callee.eval(scope).call(emptyScope, this.a1.eval(scope));
    }
    isConstant() {
        return this.a1.isConstant();
    }
}
exports.ScopeCall1Instruction = ScopeCall1Instruction;
class ScopeCall2Instruction {
    constructor(callee, args) {
        this.callee = callee;
        this.a1 = args[0];
        this.a2 = args[1];
    }
    eval(scope) {
        return this.callee.eval(scope).call(emptyScope, this.a1.eval(scope), this.a2.eval(scope));
    }
    isConstant() {
        return isConstant([this.a1, this.a2]);
    }
}
exports.ScopeCall2Instruction = ScopeCall2Instruction;
class ScopeCall3Instruction {
    constructor(callee, args) {
        this.callee = callee;
        this.a1 = args[0];
        this.a2 = args[1];
        this.a3 = args[2];
    }
    eval(scope) {
        return this.callee.eval(scope).call(emptyScope, this.a1.eval(scope), this.a2.eval(scope), this.a3.eval(scope));
    }
    isConstant() {
        return isConstant([this.a1, this.a2, this.a3]);
    }
}
exports.ScopeCall3Instruction = ScopeCall3Instruction;
class ObjectInstruction {
    constructor(propertyNames, instructions) {
        this.propertyNames = propertyNames;
        this.instructions = instructions;
    }
    eval(scope) {
        let obj = {};
        for (let i = 0; i < this.propertyNames.length; i++) {
            obj[this.propertyNames[i]] = this.instructions[i].eval(scope);
        }
        return obj;
    }
    isConstant() {
        return isConstant(this.instructions);
    }
}
exports.ObjectInstruction = ObjectInstruction;
class ArrayInstruction {
    constructor(elements) {
        this.elements = elements;
    }
    eval(scope) {
        return evaluateAll(scope, this.elements);
    }
    isConstant() {
        return true;
    }
}
exports.ArrayInstruction = ArrayInstruction;
class LogicalOrInstruction extends BinaryBase {
    eval(scope) {
        return this.left.eval(scope) || this.right.eval(scope);
    }
}
exports.LogicalOrInstruction = LogicalOrInstruction;
class LogicalAndInstruction extends BinaryBase {
    eval(scope) {
        return this.left.eval(scope) && this.right.eval(scope);
    }
}
exports.LogicalAndInstruction = LogicalAndInstruction;
class BinaryEqualInstruction extends BinaryBase {
    eval(scope) {
        // tslint:disable-next-line
        return this.left.eval(scope) == this.right.eval(scope);
    }
}
exports.BinaryEqualInstruction = BinaryEqualInstruction;
class BinaryNotEqualInstruction extends BinaryBase {
    eval(scope) {
        // tslint:disable-next-line
        return this.left.eval(scope) != this.right.eval(scope);
    }
}
exports.BinaryNotEqualInstruction = BinaryNotEqualInstruction;
class BinaryAbsNotEqualInstruction extends BinaryBase {
    eval(scope) {
        return this.left.eval(scope) !== this.right.eval(scope);
    }
}
exports.BinaryAbsNotEqualInstruction = BinaryAbsNotEqualInstruction;
class BinaryAbsEqualInstruction extends BinaryBase {
    eval(scope) {
        return this.left.eval(scope) === this.right.eval(scope);
    }
}
exports.BinaryAbsEqualInstruction = BinaryAbsEqualInstruction;
class BinaryGreaterThanInstruction extends BinaryBase {
    eval(scope) {
        return this.left.eval(scope) > this.right.eval(scope);
    }
}
exports.BinaryGreaterThanInstruction = BinaryGreaterThanInstruction;
class BinaryLessThanInstruction extends BinaryBase {
    eval(scope) {
        return this.left.eval(scope) < this.right.eval(scope);
    }
}
exports.BinaryLessThanInstruction = BinaryLessThanInstruction;
class BinaryGreaterEqualThanInstruction extends BinaryBase {
    eval(scope) {
        return this.left.eval(scope) >= this.right.eval(scope);
    }
}
exports.BinaryGreaterEqualThanInstruction = BinaryGreaterEqualThanInstruction;
class BinaryLessEqualThanInstruction extends BinaryBase {
    eval(scope) {
        return this.left.eval(scope) <= this.right.eval(scope);
    }
}
exports.BinaryLessEqualThanInstruction = BinaryLessEqualThanInstruction;
class BinaryAddInstruction extends BinaryBase {
    eval(scope) {
        return this.left.eval(scope) + this.right.eval(scope);
    }
}
exports.BinaryAddInstruction = BinaryAddInstruction;
class BinarySubtractInstruction extends BinaryBase {
    eval(scope) {
        return this.left.eval(scope) - this.right.eval(scope);
    }
}
exports.BinarySubtractInstruction = BinarySubtractInstruction;
class BinaryMultiplyInstruction extends BinaryBase {
    eval(scope) {
        return this.left.eval(scope) * this.right.eval(scope);
    }
}
exports.BinaryMultiplyInstruction = BinaryMultiplyInstruction;
class BinaryDivideInstruction extends BinaryBase {
    eval(scope) {
        return this.left.eval(scope) / this.right.eval(scope);
    }
}
exports.BinaryDivideInstruction = BinaryDivideInstruction;
class BinaryModulusInstruction extends BinaryBase {
    eval(scope) {
        return this.left.eval(scope) % this.right.eval(scope);
    }
}
exports.BinaryModulusInstruction = BinaryModulusInstruction;
class ConcatenateInstruction {
    constructor(instructions) {
        this.instructions = instructions;
    }
    eval(scope) {
        let s = "";
        for (let e of this.instructions) {
            s += e[scope].toString();
        }
        return s;
    }
    isConstant() {
        return isConstant(this.instructions);
    }
}
exports.ConcatenateInstruction = ConcatenateInstruction;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(0));
__export(__webpack_require__(1));
__export(__webpack_require__(5));


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var vertex_template_1 = __webpack_require__(1);
var svg_helper_1 = __webpack_require__(6);
var vertex_actions_1 = __webpack_require__(8);
var action_registry_1 = __webpack_require__(9);
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


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var dom_helper_1 = __webpack_require__(7);
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


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

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


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var VertexActions = (function () {
    function VertexActions(actions) {
        this.actions = actions;
    }
    VertexActions.prototype.getActionSet = function (nodeKey) {
        return this.actions[parseInt(nodeKey, 10)];
    };
    return VertexActions;
}());
exports.VertexActions = VertexActions;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var action_compilers_1 = __webpack_require__(10);
var ActionRegistry = (function () {
    function ActionRegistry(f1, dummyAction) {
        this.dummyAction = dummyAction;
        this.registry = new Map();
        this.registry.set(f1.getActionName(), f1);
    }
    ActionRegistry.prototype.register = function (compiler) {
        this.registry.set(compiler.getActionName(), compiler);
    };
    ActionRegistry.prototype.get = function (actionName) {
        return this.registry.get(actionName) || this.dummyAction;
    };
    ActionRegistry._inject = [action_compilers_1.ActionBind, action_compilers_1.DummyActionCompiler];
    return ActionRegistry;
}());
exports.ActionRegistry = ActionRegistry;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(11));
__export(__webpack_require__(12));


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var DummyActionCompiler = (function () {
    function DummyActionCompiler() {
    }
    DummyActionCompiler.prototype.compile = function (attributeName, expr) {
        console.log("invalid attributeAction " + attributeName);
        return new NullInstruction();
    };
    DummyActionCompiler.prototype.getActionName = function () {
        return "_dummy_";
    };
    return DummyActionCompiler;
}());
exports.DummyActionCompiler = DummyActionCompiler;
var NullInstruction = (function () {
    function NullInstruction() {
    }
    NullInstruction.prototype.execute = function (element, scope) {
    };
    return NullInstruction;
}());


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var expression_compiler_1 = __webpack_require__(13);
var bind_action_default_1 = __webpack_require__(21);
var bind_action_size_1 = __webpack_require__(23);
var bind_action_position_1 = __webpack_require__(24);
var bind_action_transform_1 = __webpack_require__(25);
var ActionBind = (function () {
    function ActionBind(compiler, actionDefault, sizeActionFactory, position, transform) {
        this.compiler = compiler;
        this.actionDefault = actionDefault;
        this.cache = {
            "size": sizeActionFactory,
            "position": position,
            "transform": transform
        };
    }
    ActionBind.prototype.getActionName = function () {
        return "bind";
    };
    ActionBind.prototype.compile = function (attributeName, expr) {
        return (this.cache[attributeName] || this.actionDefault).create(this.compiler.compileMulti(expr), attributeName);
    };
    ActionBind._inject = [expression_compiler_1.Compiler, bind_action_default_1.DefaultActionFactory, bind_action_size_1.SizeActionFactory, bind_action_position_1.PositionActionFactory, bind_action_transform_1.TransformActionFactory];
    return ActionBind;
}());
exports.ActionBind = ActionBind;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(14));
__export(__webpack_require__(2));
__export(__webpack_require__(3));


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const compiler_visitor_1 = __webpack_require__(2);
const expression_parser_1 = __webpack_require__(15);
class Compiler {
    constructor() {
        this.visitor = new compiler_visitor_1.CompileVisitor();
        this.parser = new expression_parser_1.Parser();
    }
    compile(code) {
        let expr = this.parser.parseExpression(code || "");
        console.log(expr.constructor);
        return expr.visit(this.visitor);
    }
    // noinspection JSUnusedGlobalSymbols
    compileMulti(code) {
        return this.parser.parseExpressions(code || "").map((c) => c.visit(this.visitor));
    }
    // noinspection JSUnusedGlobalSymbols
    compileContent(code) {
        return this.parser.parseContent(code || "").visit(this.visitor);
    }
    eval(code, scope) {
        return this.compile(code).eval(scope);
    }
}
exports.Compiler = Compiler;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", {value: true});
var parser_1 = __webpack_require__(16);
exports.Parser = parser_1.Parser;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", {value: true});
var lexer_1 = __webpack_require__(17);
var parser_creators_1 = __webpack_require__(19);
var emptyExpressionList = [];
var Parser = /** @class */ (function () {
    function Parser() {
    }
    Parser.prototype.parseExpression = function (input) {
        var parser = new ParserImpl(input || "");
        if (parser.eof()) {
            return parser_creators_1.Constants.literalUndefined;
        }
        var expr = parser.parseExpression();
        if (parser.eof()) {
            return expr;
        }
        parser.raiseError("Unconsumed token");
    };
    Parser.prototype.parseExpressions = function (input) {
        var parser = new ParserImpl(input || "");
        var expressions = [];
        while (!parser.eof()) {
            if (parser.expect(",")) {
                expressions.push(parser_creators_1.Constants.literalUndefined);
                // Trailing comma?
                if (parser.eof()) {
                    expressions.push(parser_creators_1.Constants.literalUndefined);
                }
            }
            else {
                expressions.push(parser.parseExpression());
                if (parser.eof()) {
                    break;
                }
                if (parser.expect(",")) {
                    // Trailing comma?
                    if (parser.eof()) {
                        expressions.push(parser_creators_1.Constants.literalUndefined);
                    }
                }
                else {
                    parser.raiseError("Unexpected token. Expected comma or eof");
                }
            }
        }
        return expressions;
    };
    Parser.prototype.parseContent = function (input) {
        if (!input) {
            input = "";
        }
        var parser = new ParserImpl(input || "");
        var pos = input.indexOf("${");
        if (pos === -1) {
            return parser_creators_1.Creators.createLiteralString(input);
        }
        var concat = [];
        var lastPos = 0;
        while (pos !== -1) {
            if (lastPos !== pos) {
                concat.push(parser_creators_1.Creators.createLiteralString(input.substr(lastPos, pos - lastPos)));
            }
            parser.reset(pos + 2);
            concat.push(parser.parseExpression());
            lastPos = parser.cur.end + 1;
            if (!parser.expect("}")) {
                parser.raiseError("Malformed Content Expression");
            }
            pos = input.indexOf("${", lastPos);
            if (pos === -1 && lastPos < input.length) {
                concat.push(parser_creators_1.Creators.createLiteralString(input.substr(lastPos)));
            }
        }
        return concat.length === 1
            ? concat[0]
            : parser_creators_1.Creators.createConcatenate(concat);
    };
    return Parser;
}());
exports.Parser = Parser;
var ParserImpl = /** @class */ (function () {
    function ParserImpl(input) {
        this.iterator = new lexer_1.default(input);
        this.consume();
    }
    ParserImpl.prototype.consume = function () {
        this.cur = this.iterator.next();
    };
    ParserImpl.prototype.reset = function (pos) {
        this.iterator.setPos(pos);
        this.cur = this.iterator.next();
    };
    ParserImpl.prototype.expect = function (str) {
        if (this.cur.value === str) {
            this.consume();
            return true;
        }
        return false;
    };
    ParserImpl.prototype.eof = function () {
        return this.cur.type === "eof";
    };
    ParserImpl.prototype.parseExpression = function () {
        var result = this.parseIt();
        return this.cur.value === "?"
            ? this.parseConditionalExpression(result)
            : result;
    };
    ParserImpl.prototype.parseConditionalExpression = function (expr) {
        this.consume();
        var trueCondition = this.parseExpression();
        if (this.expect(":")) {
            return parser_creators_1.Creators.createConditionalExpression(expr, trueCondition, this.parseExpression());
        }
        this.raiseError("Conditional expression invalid");
    };
    ParserImpl.prototype.parseIt = function () {
        var expr = this.parsePrefix();
        var operator = parser_creators_1.Creators.getOperatorFactory(this.cur.value);
        if (operator) {
            this.consume();
            var e = 1, o = 0;
            var expressions = [/*left*/ expr, /*right*/ this.parsePrefix()];
            var operators = [operator];
            while (operator = parser_creators_1.Creators.getOperatorFactory(this.cur.value)) {
                this.consume();
                // If operator on top of stack has greater precedence then pop/push expression
                while (o >= 0 && operator.precedence <= operators[o].precedence) {
                    e--;
                    expressions[e] = operators[o--].create(/*left*/ expressions[e], /*right*/ expressions[e + 1]);
                }
                operators[++o] = operator;
                expressions[++e] = this.parsePrefix();
            }
            expr = expressions[e];
            for (var i = e - 1; i >= 0; i--) {
                expr = operators[o--].create(expressions[i], expr);
            }
        }
        return expr;
    };
    /**
     *
     * @returns {any}
     */
    ParserImpl.prototype.parsePrefix = function () {
        switch (this.cur.value) {
            case "+":
            case "-":
            case "!":
                return this.parseUnary(this.cur.value);
        }
        var expr = this.parsePrimary();
        while (true) {
            switch (this.cur.value) {
                case ".":
                    expr = this.parseNamedMember(expr);
                    break;
                case "[":
                    expr = this.parseComputedMember(expr);
                    break;
                case "(":
                    expr = this.parseCallExpression(expr);
                    break;
                default:
                    return expr;
            }
        }
    };
    ParserImpl.prototype.parseCallExpression = function (lhs) {
        this.consume();
        var expr = this.cur.value === ")" ? emptyExpressionList : this.getExpressionList();
        if (this.expect(")")) {
            return parser_creators_1.Creators.createCallExpression(lhs, expr);
        }
        this.raiseError("Expected close bracket");
    };
    ParserImpl.prototype.parseComputedMember = function (lhs) {
        this.consume();
        if (this.expect("]")) {
            this.raiseError("Expected expression");
        }
        var expr = this.parseExpression();
        if (this.expect("]")) {
            return parser_creators_1.Creators.createMemberAccessorExpression(lhs, expr, true);
        }
        this.raiseError("Expected closing ]");
    };
    ParserImpl.prototype.parseNamedMember = function (lhs) {
        this.consume();
        if (this.cur.type === "token") {
            var expr = parser_creators_1.Creators.createLiteralString(this.cur.value);
            this.consume();
            return this.cur.value === "("
                ? parser_creators_1.Creators.createMemberCallExpression(lhs, expr, this.parseArgs())
                : parser_creators_1.Creators.createMemberAccessorExpression(lhs, expr, false);
        }
        this.raiseError("Expected identifier");
    };
    ParserImpl.prototype.parseUnary = function (unary) {
        this.consume();
        return parser_creators_1.Creators.createUnaryExpression(unary, this.parsePrefix());
    };
    ParserImpl.prototype.parsePrimary = function () {
        switch (this.cur.value) {
            case "(":
                return this.parseBrackets();
            case "[":
                return this.parseArray();
            case "{":
                return this.parseObject();
            case "true":
            case "false":
            case "null":
            case "undefined":
                return this.parseKeyword(this.cur.value);
        }
        switch (this.cur.type) {
            case "string":
            case "number":
                return this.parseLiteral(this.cur.type, this.cur.value);
            case "token":
                return this.parseIdentifier(this.cur.value);
        }
        this.raiseError("Unexpected token");
    };
    ParserImpl.prototype.parseIdentifier = function (name) {
        this.consume();
        return parser_creators_1.Creators.createScopedAccessorExpression(name);
    };
    ParserImpl.prototype.parseLiteral = function (type, value) {
        this.consume();
        return type === "number"
            ? parser_creators_1.Creators.createLiteralNumber(value)
            : parser_creators_1.Creators.createLiteralString(value);
    };
    ParserImpl.prototype.parseKeyword = function (keyword) {
        this.consume();
        return parser_creators_1.Creators.createConstExpression(keyword);
    };
    ParserImpl.prototype.parseArray = function () {
        this.consume();
        var expressions = this.cur.value === "]" ? [] : this.getExpressionList();
        if (this.expect("]")) {
            return parser_creators_1.Creators.createArrayExpression(expressions);
        }
        this.raiseError("Unexpected token");
    };
    ParserImpl.prototype.parseBrackets = function () {
        this.consume();
        var expr = this.parseExpression();
        if (this.expect(")")) {
            return expr;
        }
        this.raiseError("Expected )");
    };
    ParserImpl.prototype.parseObject = function () {
        this.consume();
        var properties = this.parseObjectProperties();
        if (this.expect("}")) {
            return parser_creators_1.Creators.createObjectExpression(properties);
        }
        this.raiseError("Unexpected End");
    };
    ParserImpl.prototype.parseObjectProperties = function () {
        var propertyNames = [];
        var expressions = [];
        if (this.cur.value !== "}") {
            do {
                if (this.cur.type !== "token") {
                    this.raiseError("Expected a name token");
                }
                propertyNames.push(this.cur.value);
                this.consume();
                if (!this.expect(":")) {
                    this.raiseError("Expected a colon");
                }
                expressions.push(this.parseExpression());
            } while (this.expect(","));
        }
        return {
            names: propertyNames,
            expressions: expressions
        };
    };
    ParserImpl.prototype.parseArgs = function () {
        this.consume();
        if (this.expect(")")) {
            return emptyExpressionList;
        }
        var args = this.getExpressionList();
        if (this.expect(")")) {
            return args;
        }
        this.raiseError("missing )");
    };
    ParserImpl.prototype.getExpressionList = function () {
        var args = [];
        do {
            args.push(this.parseExpression());
        } while (this.expect(","));
        return args;
    };
    ParserImpl.prototype.raiseError = function (msg) {
        throw new Error(msg + " " + this.cur.value);
    };
    return ParserImpl;
}());


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", {value: true});
var scanner_1 = __webpack_require__(18);
var LexerReader = /** @class */ (function () {
    function LexerReader(value) {
        this.reader = new scanner_1.Scanner(value);
    }
    LexerReader.prototype.setPos = function (pos) {
        this.reader.setPos(pos);
    };
    LexerReader.prototype.next = function () {
        return this.reader.next();
    };
    return LexerReader;
}());
exports.default = LexerReader;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", {value: true});
var Scanner = /** @class */ (function () {
    function Scanner(str) {
        this.str = str || "";
        this.idx = 0;
        this.mark = 0;
        this.eof = !str;
    }
    Scanner.prototype.setPos = function (pos) {
        this.idx = pos;
    };
    Scanner.prototype.next = function () {
        var ch = this.readPastWhitespace();
        return ((ch >= 65 && ch <= 90) || (ch >= 97 && ch <= 122) || ch === 95 || ch === 36) /*A-Z$_*/
            ? this.readIdentifier()
            : ((ch >= 48 && ch <= 57) || (ch === 46 && this.peek1() >= 48 && this.peek1() <= 57)) /* [0-9] */
                ? this.readNumber()
                : ((ch === 34 /*"*/ || ch === 39 /*' */))
                    ? this.readString(ch === 34 ? "\"" : "'")
                    : ch
                        ? this.readSymbol(ch)
                        : this.createEofToken();
    };
    Scanner.prototype.readPastWhitespace = function () {
        var ch = this.eof ? 0 : this.str.charCodeAt(this.idx);
        while (ch === 32 || ch === 9 || ch === 10 || ch === 13 || ch === 160) {
            ch = this.str.charCodeAt(++this.idx);
        }
        this.mark = this.idx;
        return ch;
    };
    Scanner.prototype.readString = function (quoteChar) {
        this.consume(); // eat quote character
        var slash = this.str.indexOf("\\", this.idx);
        var quote = this.str.indexOf(quoteChar, this.idx);
        return slash === -1 && quote !== -1
            ? this.createStringToken(quote)
            : this.readComplexString(quoteChar, quote, slash);
    };
    Scanner.prototype.readComplexString = function (q, quote, slash) {
        var str = this.str;
        var sb = "";
        var i = this.idx;
        while (quote !== -1) {
            // no slash or quote before slash
            if (slash === -1 || quote < slash) {
                return this.createStringToken(quote, sb + str.substring(i, quote));
            }
            sb += (str.substring(i, slash) + unescape(str.charCodeAt(slash + 1)));
            i = slash + 2;
            if (quote < i) {
                quote = str.indexOf(q, i);
            }
            slash = str.indexOf("\\", i);
        }
        this.raiseError("Unterminated quote");
    };
    Scanner.prototype.readNumber = function () {
        var ch = this.consume();
        while (ch >= 48 && ch <= 57) {
            ch = this.consume();
        }
        if (ch === 46) {
            ch = this.consume();
            while (ch >= 48 && ch <= 57) {
                ch = this.consume();
            }
        }
        return this.createToken("number", 0);
    };
    Scanner.prototype.readIdentifier = function () {
        var ch = this.consume();
        while (ch === 36 || ch === 95 || (ch >= 65 && ch <= 90) || (ch >= 97 && ch <= 122) || (ch >= 48 && ch <= 57)) {
            ch = this.consume();
        }
        return this.createToken("token", 0);
    };
    Scanner.prototype.readSymbol = function (ch) {
        return this.createToken("symbol", (ch === 60 /*<*/ || ch === 62 /*>*/)
            ? ((this.peek1() === 61 /*=*/) ? 2 : 1)
            : (ch === 38 /*&*/ || ch === 124 /*|*/)
                ? ((this.peek1() === ch /*=*/) ? 2 : 1)
                : ((ch === 61 /*=*/ || ch === 33 /*!*/) && this.peek1() === 61 /*=*/)
                    ? ((this.peek2() === 61) ? 3 : 2)
                    : 1);
    };
    Scanner.prototype.createToken = function (type, skip) {
        this.idx += skip;
        return new LexerToken(type, this.str.substring(this.mark, this.idx), this.mark, this.idx - 1);
    };
    Scanner.prototype.createEofToken = function () {
        this.idx = this.str.length;
        this.eof = true;
        return new LexerToken("eof", "", this.str.length, this.str.length);
    };
    Scanner.prototype.createStringToken = function (endPos, str) {
        this.idx = endPos + 1;
        return new LexerToken("string", str || this.str.substring(this.mark + 1, endPos), this.mark, endPos);
    };
    Scanner.prototype.raiseError = function (msg) {
        this.idx = this.str.length;
        this.eof = true;
        throw new Error(msg);
    };
    Scanner.prototype.peek1 = function () {
        return this.str.charCodeAt(this.idx + 1);
    };
    Scanner.prototype.peek2 = function () {
        return this.str.charCodeAt(this.idx + 2);
    };
    Scanner.prototype.consume = function () {
        return this.str.charCodeAt(++this.idx);
    };
    return Scanner;
}());
exports.Scanner = Scanner;
function unescape(ch) {
    switch (ch) {
        case 114:
            return "\r";
        case 102:
            return "\f";
        case 110:
            return "\n";
        case 116:
            return "\t";
        case 118:
            return "\v";
        case 92:
            return "\\";
        case 39:
            return "'";
        case 34:
            return "\"";
        default:
            return String.fromCharCode(ch);
    }
}
var LexerToken = /** @class */ (function () {
    // noinspection JSUnusedGlobalSymbols
    function LexerToken(type, value, start, end) {
        this.type = type;
        this.value = value;
        this.start = start;
        this.end = end;
    }
    return LexerToken;
}());
exports.LexerToken = LexerToken;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", {value: true});
var expressions_1 = __webpack_require__(20);
exports.Constants = {
    literalNull: new expressions_1.Literal("null", null),
    literalTrue: new expressions_1.Literal("true", true),
    literalFalse: new expressions_1.Literal("false", false),
    literalUndefined: new expressions_1.Literal("undefined", undefined)
};
exports.Creators = {
    createConcatenate: function (set) {
        return new expressions_1.LiteralConcatenate(set);
    },
    createLiteralString: function (value) {
        return new expressions_1.LiteralString(value);
    },
    createLiteralNumber: function (value) {
        return new expressions_1.LiteralNumber(parseFloat(value));
    },
    createMemberCallExpression: function (lhs, expr, args) {
        return new expressions_1.MemberCallExpression(lhs, expr, args);
    },
    createMemberAccessorExpression: function (lhs, rhs, computed) {
        return new expressions_1.MemberAccessorExpression(lhs, rhs, computed);
    },
    createCallExpression: function (lhs, args) {
        return new expressions_1.CallExpression(lhs, args);
    },
    createConstExpression: function (keyword) {
        switch (keyword) {
            case "true":
                return exports.Constants.literalTrue;
            case "false":
                return exports.Constants.literalFalse;
            case "null":
                return exports.Constants.literalNull;
            case "undefined":
                return exports.Constants.literalUndefined;
        }
    },
    createUnaryExpression: function (op, expr) {
        return new expressions_1.UnaryExpression(op, expr);
    },
    createObjectExpression: function (properties) {
        return new expressions_1.ObjectExpression(properties.names, properties.expressions);
    },
    createArrayExpression: function (rc) {
        return new expressions_1.ArrayExpression(rc);
    },
    createConditionalExpression: function (test, trueCondition, falseCondition) {
        return new expressions_1.ConditionalExpression(test, trueCondition, falseCondition);
    },
    createScopedAccessorExpression: function (name) {
        return new expressions_1.ScopedAccessorExpression(name);
    },
    getOperatorFactory: function (name) {
        switch (name) {
            case "||":
                return BinaryFactories.or;
            case "&&":
                return BinaryFactories.and;
            case "==":
                return BinaryFactories.equal;
            case "!=":
                return BinaryFactories.notEqual;
            case "===":
                return BinaryFactories.absEqual;
            case "!==":
                return BinaryFactories.absNotEqual;
            case "<":
                return BinaryFactories.lessThan;
            case ">":
                return BinaryFactories.greaterThan;
            case "<=":
                return BinaryFactories.lessEqualThan;
            case ">=":
                return BinaryFactories.greaterEqualThan;
            case "+":
                return BinaryFactories.add;
            case "-":
                return BinaryFactories.subtract;
            case "*":
                return BinaryFactories.multiply;
            case "/":
                return BinaryFactories.divide;
            case "%":
                return BinaryFactories.modulus;
        }
    }
};
var BinaryExpressionFactory = /** @class */ (function () {
    function BinaryExpressionFactory(operator, precedence) {
        this.operator = operator;
        this.precedence = precedence;
    }
    BinaryExpressionFactory.prototype.create = function (left, right) {
        return new expressions_1.BinaryExpression(this.operator, left, right);
    };
    return BinaryExpressionFactory;
}());
var LogicalExpressionFactory = /** @class */ (function () {
    function LogicalExpressionFactory(operator, precedence) {
        this.operator = operator;
        this.precedence = precedence;
    }
    LogicalExpressionFactory.prototype.create = function (left, right) {
        return new expressions_1.LogicalExpression(this.operator, left, right);
    };
    return LogicalExpressionFactory;
}());
var BinaryFactories = {
    or: new LogicalExpressionFactory("||", 10),
    and: new LogicalExpressionFactory("&&", 20),
    equal: new BinaryExpressionFactory("==", 30),
    notEqual: new BinaryExpressionFactory("!=", 30),
    absEqual: new BinaryExpressionFactory("===", 30),
    absNotEqual: new BinaryExpressionFactory("!==", 30),
    greaterThan: new BinaryExpressionFactory(">", 40),
    lessThan: new BinaryExpressionFactory("<", 40),
    greaterEqualThan: new BinaryExpressionFactory(">=", 40),
    lessEqualThan: new BinaryExpressionFactory("<=", 40),
    add: new BinaryExpressionFactory("+", 50),
    subtract: new BinaryExpressionFactory("-", 50),
    multiply: new BinaryExpressionFactory("*", 60),
    divide: new BinaryExpressionFactory("/", 60),
    modulus: new BinaryExpressionFactory("%", 60)
};


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", {value: true});
var Literal = /** @class */ (function () {
    function Literal(raw, value) {
        this.raw = raw;
        this.value = value;
    }
    Literal.prototype.visit = function (visitor) {
        return visitor.visitLiteral(this.value, this.raw);
    };
    return Literal;
}());
exports.Literal = Literal;
var LiteralConcatenate = /** @class */ (function () {
    function LiteralConcatenate(expressions) {
        this.expressions = expressions;
    }
    LiteralConcatenate.prototype.visit = function (visitor) {
        return visitor.visitConcatenate(this.expressions);
    };
    return LiteralConcatenate;
}());
exports.LiteralConcatenate = LiteralConcatenate;
var LiteralString = /** @class */ (function () {
    function LiteralString(raw) {
        this.raw = raw;
    }
    LiteralString.prototype.visit = function (visitor) {
        return visitor.visitLiteral(this.raw, this.raw);
    };
    return LiteralString;
}());
exports.LiteralString = LiteralString;
var LiteralNumber = /** @class */ (function () {
    function LiteralNumber(value) {
        this.value = value;
    }
    LiteralNumber.prototype.visit = function (visitor) {
        return visitor.visitLiteral(this.value, undefined);
    };
    return LiteralNumber;
}());
exports.LiteralNumber = LiteralNumber;
var ScopedAccessorExpression = /** @class */ (function () {
    function ScopedAccessorExpression(name) {
        this.name = name;
    }
    ScopedAccessorExpression.prototype.visit = function (visitor) {
        return visitor.visitScopedAccessor(this.name);
    };
    return ScopedAccessorExpression;
}());
exports.ScopedAccessorExpression = ScopedAccessorExpression;
var MemberAccessorExpression = /** @class */ (function () {
    function MemberAccessorExpression(object, property, computed) {
        this.object = object;
        this.property = property;
        this.computed = computed;
    }
    MemberAccessorExpression.prototype.visit = function (visitor) {
        return visitor.visitMember(this.object, this.property, this.computed);
    };
    return MemberAccessorExpression;
}());
exports.MemberAccessorExpression = MemberAccessorExpression;
var MemberCallExpression = /** @class */ (function () {
    function MemberCallExpression(object, member, args) {
        this.object = object;
        this.member = member;
        this.args = args;
    }
    MemberCallExpression.prototype.visit = function (visitor) {
        return visitor.visitMemberCall(this.object, this.member, this.args);
    };
    return MemberCallExpression;
}());
exports.MemberCallExpression = MemberCallExpression;
var ConditionalExpression = /** @class */ (function () {
    function ConditionalExpression(test, consequent, alternate) {
        this.test = test;
        this.consequent = consequent;
        this.alternate = alternate;
    }
    ConditionalExpression.prototype.visit = function (visitor) {
        return visitor.visitConditional(this.test, this.consequent, this.alternate);
    };
    return ConditionalExpression;
}());
exports.ConditionalExpression = ConditionalExpression;
var UnaryExpression = /** @class */ (function () {
    function UnaryExpression(unaryType, argument) {
        this.unaryType = unaryType;
        this.argument = argument;
    }
    UnaryExpression.prototype.visit = function (visitor) {
        return visitor.visitUnary(this.unaryType, this.argument);
    };
    return UnaryExpression;
}());
exports.UnaryExpression = UnaryExpression;
var CallExpression = /** @class */ (function () {
    function CallExpression(callee, args) {
        this.callee = callee;
        this.args = args;
    }
    CallExpression.prototype.visit = function (visitor) {
        return visitor.visitCall(this.callee, this.args);
    };
    return CallExpression;
}());
exports.CallExpression = CallExpression;
var ArrayExpression = /** @class */ (function () {
    function ArrayExpression(elements) {
        this.elements = elements;
    }
    ArrayExpression.prototype.visit = function (visitor) {
        return visitor.visitArray(this.elements);
    };
    return ArrayExpression;
}());
exports.ArrayExpression = ArrayExpression;
var ObjectExpression = /** @class */ (function () {
    function ObjectExpression(propertyNames, expressions) {
        this.propertyNames = propertyNames;
        this.expressions = expressions;
    }
    ObjectExpression.prototype.visit = function (visitor) {
        return visitor.visitObject(this.propertyNames, this.expressions);
    };
    return ObjectExpression;
}());
exports.ObjectExpression = ObjectExpression;
var BinaryExpression = /** @class */ (function () {
    function BinaryExpression(operator, left, right) {
        this.operator = operator;
        this.left = left;
        this.right = right;
    }
    BinaryExpression.prototype.visit = function (visitor) {
        return visitor.visitBinary(this.operator, this.left, this.right);
    };
    return BinaryExpression;
}());
exports.BinaryExpression = BinaryExpression;
var LogicalExpression = /** @class */ (function () {
    function LogicalExpression(operator, left, right) {
        this.operator = operator;
        this.left = left;
        this.right = right;
    }
    LogicalExpression.prototype.visit = function (visitor) {
        return visitor.visitLogical(this.operator, this.left, this.right);
    };
    return LogicalExpression;
}());
exports.LogicalExpression = LogicalExpression;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var string_intern_1 = __webpack_require__(22);
var DefaultActionFactory = (function () {
    function DefaultActionFactory(intern) {
        this.intern = intern;
    }
    DefaultActionFactory.prototype.create = function (instr, attributeName) {
        return new DefaultAction1(this.intern.get(attributeName), instr[0]);
    };
    DefaultActionFactory._inject = [string_intern_1.Intern];
    return DefaultActionFactory;
}());
exports.DefaultActionFactory = DefaultActionFactory;
var DefaultAction1 = (function () {
    function DefaultAction1(attributeName, offset) {
        this.attributeName = attributeName;
        this.offset = offset;
    }
    DefaultAction1.prototype.execute = function (element, scope) {
        element.setAttribute(this.attributeName, this.offset.eval(scope));
    };
    return DefaultAction1;
}());


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

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


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

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


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

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


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

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


/***/ })
/******/ ]);
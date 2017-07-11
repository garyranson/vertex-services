import { ActionBind } from "./action-bind";
import { ActionCompiler, ElementInstruction } from "./definitions";
export declare class DummyCompiler extends ActionCompiler {
    compile(attributeName: string, expr: string): ElementInstruction;
}
export declare class Actions {
    private dummy;
    static _inject: (typeof ActionBind | typeof DummyCompiler)[];
    private registry;
    constructor(f1: ActionBind, dummy: DummyCompiler);
    get(actionName: string): ActionCompiler;
}

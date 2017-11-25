import { ActionCompiler, ActionBind, DummyActionCompiler } from "./action-compilers";
export declare class ActionRegistry {
    private dummyAction;
    static _inject: (typeof ActionBind | typeof DummyActionCompiler)[];
    private registry;
    constructor(f1: ActionBind, dummyAction: DummyActionCompiler);
    register(compiler: ActionCompiler): void;
    get(actionName: string): ActionCompiler;
}

import { Compiler } from "expression-compiler";
import { ActionCompiler, ElementInstruction } from "./definitions";
import { DefaultActionFactory } from "./action-bind-default";
import { SizeActionFactory } from "./action-bind-size";
import { PositionActionFactory } from "./action-bind-position";
import { TransformActionFactory } from "./action-bind-transform";
export declare class ActionBind extends ActionCompiler {
    private compiler;
    private actionDefault;
    static _inject: (typeof Compiler | typeof DefaultActionFactory | typeof PositionActionFactory)[];
    private cache;
    constructor(compiler: Compiler, actionDefault: DefaultActionFactory, sizeActionFactory: SizeActionFactory, position: PositionActionFactory, transform: TransformActionFactory);
    compile(attributeName: string, expr: string): ElementInstruction;
}

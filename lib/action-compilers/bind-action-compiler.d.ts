import { Compiler } from "expression-compiler";
import { ActionCompiler, ElementInstruction } from "./definitions";
import { DefaultActionFactory } from "./bind-action-default";
import { SizeActionFactory } from "./bind-action-size";
import { PositionActionFactory } from "./bind-action-position";
import { TransformActionFactory } from "./bind-action-transform";
export declare class ActionBind implements ActionCompiler {
    private compiler;
    private actionDefault;
    static _inject: (typeof Compiler | typeof DefaultActionFactory | typeof SizeActionFactory)[];
    private cache;
    constructor(compiler: Compiler, actionDefault: DefaultActionFactory, sizeActionFactory: SizeActionFactory, position: PositionActionFactory, transform: TransformActionFactory);
    getActionName(): string;
    compile(attributeName: string, expr: string): ElementInstruction;
}

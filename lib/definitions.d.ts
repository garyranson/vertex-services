import { Instruction } from "expression-compiler";
export interface ActionFactory {
    create(instr: Instruction[], attributeName?: string): ElementInstruction;
}
export interface ElementInstruction {
    execute(element: Element, scope: any): void;
}
export declare abstract class ActionCompiler {
    abstract compile(attributeName: string, expr: string): ElementInstruction;
}

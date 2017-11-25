import { Instruction } from "expression-compiler";
export interface ActionFactory {
    create(instr: Instruction[], attributeName?: string): ElementInstruction;
}
export interface ElementInstruction {
    execute(element: Element, scope: any): void;
}
export interface ActionCompiler {
    compile(attributeName: string, expr: string): ElementInstruction;
    getActionName(): string;
}

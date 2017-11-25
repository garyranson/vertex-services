import { ActionCompiler, ElementInstruction } from "./definitions";
export declare class DummyActionCompiler implements ActionCompiler {
    compile(attributeName: string, expr: string): ElementInstruction;
    getActionName(): string;
}

import { ActionFactory, ElementInstruction } from "./definitions";
import { Instruction } from "expression-compiler";
export declare class TransformActionFactory implements ActionFactory {
    create(instr: Instruction[]): ElementInstruction;
}

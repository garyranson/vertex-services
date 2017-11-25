import { ActionFactory, ElementInstruction } from "./definitions";
import { Instruction } from "expression-compiler";
export declare class SizeActionFactory implements ActionFactory {
    create(instr: Instruction[]): ElementInstruction;
}

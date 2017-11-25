import { ActionFactory, ElementInstruction } from "./definitions";
import { Instruction } from "expression-compiler";
export declare class PositionActionFactory implements ActionFactory {
    create(instr: Instruction[]): ElementInstruction;
}

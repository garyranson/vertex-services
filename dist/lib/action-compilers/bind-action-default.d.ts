import { ActionFactory, ElementInstruction } from "./definitions";
import { Intern } from "../string-intern";
import { Instruction } from "expression-compiler";
export declare class DefaultActionFactory implements ActionFactory {
    private intern;
    static _inject: typeof Intern[];
    constructor(intern: Intern);
    create(instr: Instruction[], attributeName: string): ElementInstruction;
}

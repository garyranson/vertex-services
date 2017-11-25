import { ElementInstruction } from "./action-compilers";
export declare class VertexActions {
    private actions;
    constructor(actions: ElementInstruction[]);
    getActionSet(nodeKey: string): ElementInstruction;
}

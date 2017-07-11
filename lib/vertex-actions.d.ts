import { ElementInstruction } from "./definitions";
export declare class VertexActions {
    private actions;
    constructor(actions: ElementInstruction[]);
    getActionSet(nodeKey: string): ElementInstruction;
}

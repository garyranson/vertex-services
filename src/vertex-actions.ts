import {ElementInstruction} from "./definitions";
export class VertexActions {
  constructor(private actions: ElementInstruction[]) {
  }

  getActionSet(nodeKey: string): ElementInstruction {
    return this.actions[parseInt(nodeKey, 10)];
  }
}
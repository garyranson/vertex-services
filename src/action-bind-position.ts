import {ActionFactory, ElementInstruction} from "./definitions";
import {Instruction} from "expression-compiler";

export class PositionActionFactory implements ActionFactory {
  create(instr: Instruction[]): ElementInstruction {
    return (!instr || instr.length === 0)
      ? new PositionAction1F(0)
      : createPositionInstruction(instr[0], instr[1]);
  }
}

function createPositionInstruction(a1: Instruction, a2: Instruction): ElementInstruction {
  return ((a1 === a2) || !a2)
    ? a1.isConstant()
      ? new PositionAction1F(a1.eval())
      : new PositionAction1(a1)
    : a1.isConstant() && a2.isConstant()
      ? new PositionAction2F(a1.eval(), a2.eval())
      : new PositionAction2(a1, a2);
}
class PositionAction1F implements ElementInstruction {
  constructor(private offset: number) {
  }

  execute(element: Element, scope: any): void {
    setElementPosition(element, scope, this.offset, this.offset);
  }
}
class PositionAction1 implements ElementInstruction {
  constructor(private offset: Instruction) {
  }

  execute(element: Element, scope: any): void {
    let offset = this.offset.eval(scope);
    setElementPosition(element, scope, offset, offset);
  }
}
class PositionAction2F implements ElementInstruction {
  constructor(private offsetX: number, private offsetY: number) {
  }

  execute(element: Element, scope: any): void {
    setElementPosition(element, scope, this.offsetX, this.offsetY);
  }
}
class PositionAction2 implements ElementInstruction {
  constructor(private x: Instruction, private y: Instruction) {
  }

  execute(element: Element, scope: any): void {
    setElementPosition(element, scope, this.x.eval(scope), this.y.eval(scope));
  }
}
function setElementPosition(element: Element, scope: any, offsetX: number, offsetY: number): void {
  element.setAttribute("x", scope.x + offsetX);
  element.setAttribute("y", scope.y + offsetY);
}
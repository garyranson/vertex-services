import {ActionFactory, ElementInstruction} from "./definitions";
import {Instruction} from "expression-compiler";

export class SizeActionFactory implements ActionFactory {
  create(instr: Instruction[]): ElementInstruction {
    return (!instr || instr.length === 0)
      ? new SizeAction1F(0)
      : createSizeInstruction(instr[0], instr[1]);
  }
}

function createSizeInstruction(a1: Instruction, a2: Instruction): ElementInstruction {
  return ((a1 === a2) || !a2)
    ? a1.isConstant()
      ? new SizeAction1F(a1.eval())
      : new SizeAction1(a1)
    : a1.isConstant() && a2.isConstant()
      ? new SizeAction2F(a1.eval(), a2.eval())
      : new SizeAction2(a1, a2);
}

class SizeAction1F implements ElementInstruction {
  constructor(private offset: number) {
  }

  execute(element: Element, scope: any): void {
    setSize(element, scope, this.offset, this.offset);
  }
}
class SizeAction1 implements ElementInstruction {
  constructor(private offset: Instruction) {
  }

  execute(element: Element, scope: any): void {
    let offset = this.offset.eval(scope);
    setSize(element, scope, offset, offset);
  }
}
class SizeAction2F implements ElementInstruction {
  constructor(private offsetX: number, private offsetY: number) {
  }

  execute(element: Element, scope: any): void {
    setSize(element, scope, this.offsetX, this.offsetY);
  }
}

class SizeAction2 implements ElementInstruction {
  constructor(private x: Instruction, private y: Instruction) {
  }

  execute(element: Element, scope: any): void {
    setSize(element, scope, this.x.eval(scope), this.y.eval(scope));
  }
}

function setSize(element: Element, scope: any, width: number, height: number): void {
  element.setAttribute("width", scope.width + width);
  element.setAttribute("height", scope.height + height);
}
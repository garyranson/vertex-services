import {ActionFactory, ElementInstruction} from "./definitions";
import {Intern} from "../string-intern";
import {Instruction} from "expression-compiler";

export class DefaultActionFactory implements ActionFactory {
  static _inject = [Intern];

  constructor(private intern: Intern) {
  }

  create(instr: Instruction[], attributeName: string): ElementInstruction {
    return new DefaultAction1(this.intern.get(attributeName), instr[0]);
  }
}

class DefaultAction1 implements ElementInstruction {
  constructor(private attributeName, private offset: Instruction) {
  }

  execute(element: Element, scope: any): void {
    element.setAttribute(this.attributeName, this.offset.eval(scope));
  }
}
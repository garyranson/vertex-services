import {ActionCompiler, ElementInstruction} from "./definitions";

export class DummyActionCompiler implements ActionCompiler {
  compile(attributeName: string, expr: string): ElementInstruction {
    console.log(`invalid attributeAction ${attributeName}`);
    return new NullInstruction();
  }

  getActionName(): string {
    return "_dummy_";
  }
}
class NullInstruction implements ElementInstruction {
  execute(element: Element, scope: any): void {
  }
}
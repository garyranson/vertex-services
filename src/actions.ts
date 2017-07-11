import {ActionBind} from "./action-bind";
import {ActionCompiler, ElementInstruction} from "./definitions";


export class DummyCompiler extends ActionCompiler {
  compile(attributeName: string, expr: string): ElementInstruction {
    console.log(`invalid attributeAction ${attributeName}`);
    return new NullInstruction();
  }
}
class NullInstruction implements ElementInstruction {
  execute(element: Element, scope: any): void {
  }
}

export class Actions {
  static _inject = [ActionBind, DummyCompiler];

  private registry = new Map<string, ActionCompiler>();

  constructor(f1: ActionBind, private dummy: DummyCompiler) {
    this.registry.set("bind", f1);
  }

  get(actionName: string): ActionCompiler {
    return this.registry.get(actionName) || this.dummy;
  }
}


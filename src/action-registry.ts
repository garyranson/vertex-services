import {ActionCompiler, ActionBind, DummyActionCompiler} from "./action-compilers";

export class ActionRegistry {
  static _inject = [ActionBind, DummyActionCompiler];

  private registry = new Map<string, ActionCompiler>();

  constructor(f1: ActionBind, private dummyAction: DummyActionCompiler) {
    this.registry.set(f1.getActionName(), f1);
  }

  register(compiler: ActionCompiler): void {
    this.registry.set(compiler.getActionName(), compiler);
    console.log('ete');
  }

  get(actionName: string): ActionCompiler {
    return this.registry.get(actionName) || this.dummyAction;
  }
}
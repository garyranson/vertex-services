import {Compiler} from "expression-compiler";
import {ActionCompiler, ActionFactory, ElementInstruction} from "./definitions";
import {DefaultActionFactory} from "./bind-action-default";
import {SizeActionFactory} from "./bind-action-size";
import {PositionActionFactory} from "./bind-action-position";
import {TransformActionFactory} from "./bind-action-transform";

export class ActionBind implements ActionCompiler {
  static _inject = [Compiler, DefaultActionFactory, SizeActionFactory, PositionActionFactory, TransformActionFactory];

  private cache: { [key: string]: ActionFactory };

  constructor(private compiler: Compiler,
              private actionDefault: DefaultActionFactory,
              sizeActionFactory: SizeActionFactory,
              position: PositionActionFactory,
              transform: TransformActionFactory) {
    this.cache = {
      "size":      sizeActionFactory,
      "position":  position,
      "transform": transform
    };
  }

  getActionName(): string {
    return "bind";
  }

  compile(attributeName: string, expr: string): ElementInstruction {
    return (this.cache[attributeName] || this.actionDefault).create(this.compiler.compileMulti(expr), attributeName);
  }
}
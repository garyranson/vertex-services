import {Compiler} from "expression-compiler";
import {ActionCompiler, ActionFactory, ElementInstruction} from "./definitions";
import {DefaultActionFactory} from "./action-bind-default";
import {SizeActionFactory} from "./action-bind-size";
import {PositionActionFactory} from "./action-bind-position";
import {TransformActionFactory} from "./action-bind-transform";

export class ActionBind extends ActionCompiler {
  static _inject = [Compiler, DefaultActionFactory, SizeActionFactory, PositionActionFactory, TransformActionFactory];
  private cache: { [key: string]: ActionFactory };

  constructor(private compiler: Compiler ,
              private actionDefault: DefaultActionFactory,
              sizeActionFactory: SizeActionFactory,
              position: PositionActionFactory,
              transform: TransformActionFactory) {
    super();
    this.cache = {
      "size":      sizeActionFactory,
      "position":  position,
      "transform": transform
    };
  }

  compile(attributeName: string, expr: string): ElementInstruction {
    return (this.cache[attributeName] || this.actionDefault).create(this.compiler.compileMulti(expr), attributeName);
  }
}
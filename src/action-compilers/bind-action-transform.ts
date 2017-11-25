import {ActionFactory, ElementInstruction} from "./definitions";
import {Instruction} from "expression-compiler";

const _svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

export class TransformActionFactory implements ActionFactory {
  create(instructions: Instruction[]): ElementInstruction {
    return new TransformAction(instructions);
  }
}

class TransformAction implements ElementInstruction {
  constructor(private instructions: Instruction[]) {
  }

  execute(element: Element, scope: any): void {
    scope.scale     = scale;
    scope.translate = translate;
    let transformList = element["transform"].baseVal as SVGTransformList;
    transformList.clear();
    for (let f of this.instructions) {
      transformList.appendItem(f.eval(scope));
    }
  }
}

function scale(val1: any): SVGTransform {
  let tfm = _svg.createSVGTransform();
  tfm.setScale(val1, val1);
  return tfm;
}

function translate(x: any, y: any) {
  let tfm = _svg.createSVGTransform();
  tfm.setTranslate(x, y);
  return tfm;
}
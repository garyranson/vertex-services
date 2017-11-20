import {ActionFactory, ElementInstruction} from "./definitions";
import {Instruction} from "expression-compiler";


const _svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

export class TransformActionFactory implements ActionFactory {
  create(instr: Instruction[]): ElementInstruction {
    return new TransformAction(instr);
  }
}

class TransformAction implements ElementInstruction {
  constructor(private instr: Instruction[]) {
  }

  execute(element: Element, scope: any): void {
    scope.scale     = scale;
    scope.translate = translate;
    let transformList = element["transform"].baseVal as SVGTransformList;
    transformList.clear();
    for (let f of this.instr) {
      transformList.appendItem(f.eval(scope));
    }
    console.log("here");
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

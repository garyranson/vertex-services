import {Vertex} from "./vertex";
import {VertexActions} from "./vertex-actions";

function Freeze<T>(obj: T): T {
  return Object.freeze(obj) as T;
}

export interface VertexTemplate {
  createVertex(): Vertex;
  getDefinitions(): Element[];
}

class VertexTemplateImpl implements VertexTemplate {
  constructor(private root: Element, private vertexController: any, private actions: VertexActions, private definitions: Element[]) {
  }

  createVertex(): Vertex {
    return new Vertex(<Element>this.root.cloneNode(true), this.actions);
  }

  getDefinitions(): Element[] {
    return this.definitions;
  }
}

export class VertexTemplateFactory {
  createInstance(root: Element, viewController: any, actions: VertexActions, definitions: Element[]): VertexTemplate {
    return Freeze(new VertexTemplateImpl(root, viewController, actions, definitions));
  }
}
import {VertexActions} from "./vertex-actions";

export class Vertex {
  constructor(public readonly root: Element, private actions: VertexActions) {
  }

  update(scope: any): Vertex {
    const a1 = this.root.getAttribute("px");
    if (a1) {
      this.actions.getActionSet(a1).execute(this.root, scope);
    }
    let els = this.root.querySelectorAll("[px]");
    for (let i = els.length - 1; i >= 0; i--) {
      let el = els[i];
      this.actions.getActionSet(el.getAttribute("px")).execute(el, scope);
    }
    return this;
  }
}
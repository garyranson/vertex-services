import {VertexTemplate, VertexTemplateFactory} from "./vertex-template";
import {SvgHelper} from "./svg-helper";
import {VertexActions} from "./vertex-actions";
import {ActionRegistry} from "./action-registry";
import {ElementInstruction} from "./action-compilers";

export interface InternalAttr {
  name: string;
  value: string;
  attributeName: string;
  actionName: string;
}

export interface InternalXLink {
  element: Element;
  value: string;
}


// noinspection JSUnusedGlobalSymbols
export class VertexTemplateService {
  static _inject = [SvgHelper, ActionRegistry, VertexTemplateFactory];

  constructor(private svgHelper: SvgHelper, private actions: ActionRegistry, private templateFactory: VertexTemplateFactory) {
  }

  public createTemplate(markup: string, viewController: any): VertexTemplate {
    /* dom is mutated - do not inline anything here ! */
    let dom           = this.svgHelper.parseSvgMarkup(markup);
    let definitions   = this._extractDefinitions(dom);
    let actions       = this._createTemplateActions(dom);
    let domEntryPoint = dom.querySelector("[px-node]");
    return this.templateFactory.createInstance(<Element> domEntryPoint.cloneNode(true), viewController, actions, definitions);
  }

  private _createTemplateActions(root: Element): VertexActions {
    let walker         = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT),
        elementActions = [],
        el: Element;

    while (el = walker.nextNode() as Element) {
      const attrs = this._getActionAttributes(el.attributes);

      if (!attrs)
        continue;

      let actions = attrs.map((attr) => {
        return this.actions.get(attr.actionName).compile(attr.attributeName, attr.value);
      });
      el.setAttributeNS(null, "px", <any>elementActions.length);
      elementActions.push((actions.length === 1) ? actions[0] : new BindActionMulti(actions));

      for (let attr of attrs) {
        el.attributes.removeNamedItem(attr.name);
      }
    }
    return new VertexActions(elementActions);
  }

  private _getActionAttributes(attributes: NamedNodeMap): InternalAttr[] {
    let attrs: InternalAttr[];

    for (let i = attributes.length - 1; i >= 0; i--) {
      const attr = attributes[i];
      const dot  = attr.name.indexOf(".");
      if (dot >= 0) {
        if (!attrs) attrs = [];
        attrs.push({
          name:          attr.name,
          value:         attr.value.trim(),
          actionName:    attr.name.substr(dot + 1).trim(),
          attributeName: attr.name.substr(0, dot).trim()
        });
      }
    }
    return attrs;
  }

  private getXLinkHRefs(root: SVGSVGElement): InternalXLink[] {

    let rc: InternalXLink[] = [];
    let hRefNodes           = root.querySelectorAll("[*|href]:not([href])");

    for (let i = hRefNodes.length - 1; i >= 0; i--) {
      let el       = hRefNodes[i];
      let hrefAttr = el.getAttributeNS("http://www.w3.org/1999/xlink", "href");
      if (hrefAttr && hrefAttr.startsWith("#")) {
        rc.push({
          element: el,
          value:   hrefAttr
        });
      }
    }
    return rc;
  }

  private _extractDefinitions(root: SVGSVGElement): Element[] {
    let cache = new Map<string, string>(),
        def   = [],
        i     = 0;

    for (let href of this.getXLinkHRefs(root)) {
      let id = cache.get(href.value);
      if (!id) {
        let el = root.getElementById(href.value.substr(1));
        if (el) {
          id = "@px@" + (++i).toString(36);
          cache.set(href.value, id);
          el.setAttribute("id", id);
          def.push(el);
        }
      }
      if (id) {
        href.element.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#" + id);
      }
    }
    return def;
  }
}
class BindActionMulti implements ElementInstruction {
  constructor(private actions: ElementInstruction[]) {
  }

  execute(el: Element, scope: any) {
    for (let action of this.actions) {
      action.execute(el, scope);
    }
  }
}
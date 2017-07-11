import {DomHelper} from "./dom-helper";

const svgNS = "http://www.w3.org/2000/svg";

export class SvgHelper {
  static _inject = [DomHelper];
  private _svg: SVGSVGElement;

  constructor(private dom: DomHelper) {
    this._svg = document.createElementNS(svgNS, "svg");
  }

  parseSvgMarkup(svgMarkup: string): SVGSVGElement {
    const el     = document.createElementNS(svgNS, "svg");
    el.innerHTML = svgMarkup;
    return this.dom.normalise(el);
  }

  createDefElement(): SVGDefsElement {
    return document.createElementNS(svgNS, "def") as SVGDefsElement;
  }

  getSVG(): SVGSVGElement {
    return this._svg;
  }
}
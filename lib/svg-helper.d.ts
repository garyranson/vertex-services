import { DomHelper } from "./dom-helper";
export declare class SvgHelper {
    private dom;
    static _inject: typeof DomHelper[];
    private _svg;
    constructor(dom: DomHelper);
    parseSvgMarkup(svgMarkup: string): SVGSVGElement;
    createDefElement(): SVGDefsElement;
    getSVG(): SVGSVGElement;
}

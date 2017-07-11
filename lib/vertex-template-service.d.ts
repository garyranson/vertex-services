import { VertexTemplate, VertexTemplateFactory } from "./vertex-template";
import { SvgHelper } from "./svg-helper";
import { Actions } from "./actions";
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
export declare class VertexTemplateService {
    private svgHelper;
    private actions;
    private templateFactory;
    static _inject: (typeof Actions | typeof SvgHelper | typeof VertexTemplateFactory)[];
    constructor(svgHelper: SvgHelper, actions: Actions, templateFactory: VertexTemplateFactory);
    createTemplate(markup: string, viewController: any): VertexTemplate;
    private _createTemplateActions(root);
    private createActions(attrs);
    private _getActionAttributes(attributes);
    private getXLinkHRefs(root);
    private _extractDefinitions(root);
}

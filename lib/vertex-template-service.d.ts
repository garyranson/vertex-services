import { VertexTemplate, VertexTemplateFactory } from "./vertex-template";
import { SvgHelper } from "./svg-helper";
import { ActionRegistry } from "./action-registry";
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
    static _inject: (typeof ActionRegistry | typeof VertexTemplateFactory | typeof SvgHelper)[];
    constructor(svgHelper: SvgHelper, actions: ActionRegistry, templateFactory: VertexTemplateFactory);
    createTemplate(markup: string, viewController: any): VertexTemplate;
    private _createTemplateActions(root);
    private _getActionAttributes(attributes);
    private getXLinkHRefs(root);
    private _extractDefinitions(root);
}

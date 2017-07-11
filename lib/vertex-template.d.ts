import { Vertex } from "./vertex";
import { VertexActions } from "./vertex-actions";
export interface VertexTemplate {
    createVertex(): Vertex;
    getDefinitions(): Element[];
}
export declare class VertexTemplateFactory {
    createInstance(root: Element, viewController: any, actions: VertexActions, definitions: Element[]): VertexTemplate;
}

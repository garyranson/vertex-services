import { VertexActions } from "./vertex-actions";
export declare class Vertex {
    readonly root: Element;
    private actions;
    constructor(root: Element, actions: VertexActions);
    update(scope: any): Vertex;
}

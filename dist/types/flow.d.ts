export interface IDrawable {
    color?: string;
    fill?: string;
    x: number;
    y: number;
}
export interface ILayoutNode extends IDrawable {
    id: string;
}
export interface ICanvasNode extends IDrawable {
    label?: string;
    name?: string;
    comment?: string;
    size?: [number, number];
    shape?: string;
    id: string;
    index: number | string;
    type: string;
    parameters?: object;
    anchorPoints?: Array<[number, number]>;
}
export interface ICanvasEdge {
    source: number | string;
    sourceAnchor: number | string;
    target: number | string;
    targetAnchor: number | string;
    index: number | string;
    id: string;
}
export interface ICanvasData {
    nodes: ICanvasNode[];
    edges: ICanvasEdge[];
}

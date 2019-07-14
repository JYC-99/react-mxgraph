import * as React from "react";
import { ICanvasEdge, ICanvasNode } from "../types/flow";
interface IFlowProps {
    nodes: ICanvasNode[];
    edges: ICanvasEdge[];
}
export declare class Flow extends React.PureComponent<IFlowProps> {
    render(): React.ReactChild;
}
export {};

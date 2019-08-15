import * as React from "react";
import { IMxActions } from "../types/action";
import { ICanvasData, ICanvasEdge, ICanvasNode } from "../types/flow";
import { ImxCell, IMxGraph } from "../types/mxGraph";
import { ICustomShape } from "../types/shapes";

export interface IMxGraphContext {
  graph?: IMxGraph;
  action?: IMxActions;
  customShape?: ICustomShape[];
  setGraph(graph: IMxGraph): void;
  readData(graph: IMxGraph, data: ICanvasData): void;
  insertEdge(parent: ImxCell, graph: IMxGraph, edge: ICanvasEdge, source: ImxCell, target: ImxCell): ImxCell;
  insertVertex(parent: ImxCell, graph: IMxGraph, node: ICanvasNode): ImxCell;
}

export const MxGraphContext = React.createContext<IMxGraphContext>({
  graph: undefined,
  // tslint:disable-next-line: no-empty
  setGraph: () => { },
  action: undefined,
  customShape: undefined,
  // tslint:disable-next-line: no-empty
  readData: () => { },
  // tslint:disable-next-line: no-empty
  insertEdge: () => null,
  // tslint:disable-next-line: no-empty
  insertVertex: () => null,
});

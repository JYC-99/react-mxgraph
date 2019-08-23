import * as React from "react";
import { IMxActions } from "../types/action";
import { ICustomCommand } from "../types/command";
import { ICanvasData, ICanvasEdge, ICanvasNode } from "../types/flow";
import { ImxCell, IMxGraph } from "../types/mxGraph";
import { ICustomShape } from "../types/shapes";

export interface IMxGraphContext {
  graph?: IMxGraph;
  actions?: IMxActions;
  customShape?: ICustomShape[];
  customCommand?: ICustomCommand[];
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
  customCommand: undefined,
  // tslint:disable-next-line: no-empty
  readData: () => { },
  // tslint:disable-next-line: no-empty
  insertEdge: () => null,
  // tslint:disable-next-line: no-empty
  insertVertex: () => null,
});

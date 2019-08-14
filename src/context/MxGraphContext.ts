import * as React from "react";
import { IMxActions } from "../types/action";
import { IMxGraph } from "../types/mxGraph";
import { ICustomShape } from "../types/shapes";

export interface IMxGraphContext {
  graph?: IMxGraph;
  action?: IMxActions;
  customShape?: ICustomShape[];
  setGraph(graph: IMxGraph): void;
}

export const MxGraphContext = React.createContext<IMxGraphContext>({
  graph: undefined,
  // tslint:disable-next-line: no-empty
  setGraph: () => { },
  action: undefined,
  customShape: undefined,
});

import * as React from "react";
import { IMxGraph } from "../types/mxGraph";
import { IMxActions } from "../types/action";

export interface IMxGraphContext {
  graph?: IMxGraph;
  action?: IMxActions;
  setGraph(graph: IMxGraph): void;
}

export const MxGraphContext = React.createContext<IMxGraphContext>({
  graph: undefined,
  // tslint:disable-next-line: no-empty
  setGraph: () => {},
  action: undefined,
});

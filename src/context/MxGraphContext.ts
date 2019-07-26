import * as React from "react";
import { IMxGraph } from "../types/mxGraph";

export interface IMxGraphContext {
  graph?: IMxGraph;
  setGraph(graph: IMxGraph): void;
}

export const MxGraphContext = React.createContext<IMxGraphContext>({
  graph: undefined,
  // tslint:disable-next-line: no-empty
  setGraph: () => {},
});

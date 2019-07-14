import * as React from "react";
import {
  ICanvasEdge,
  ICanvasNode,
} from "../types/flow";

import {
  MxGraphContext
} from "../context/MxGraphContext";

interface IFlowProps {
  nodes: ICanvasNode[];
  edges: ICanvasEdge[];
}

export class Flow extends React.PureComponent<IFlowProps> {
  public render(): React.ReactChild {
    return (
      <MxGraphContext.Consumer>{(mxGraph) => {
        console.log(mxGraph.graph);

        return (
          <>
            Flow
          </>
        );
      }}
      </MxGraphContext.Consumer>
    );
  }
}

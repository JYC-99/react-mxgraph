import * as React from "react";
import {
  ICanvasEdge,
  ICanvasNode,
} from "../types/flow";

interface IFlowProps {
  nodes: ICanvasNode[];
  edges: ICanvasEdge[];
}

export class Flow extends React.PureComponent<IFlowProps> {
  public render(): React.ReactChild {
    return (
      <>
        This is flow
      </>
    );
  }
}

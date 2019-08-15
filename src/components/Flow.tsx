import * as React from "react";
import {
  ICanvasData,
} from "../types/flow";

// @ts-ignore
import * as mxGraphJs from "mxgraph-js";

import {
  IMxGraphContext,
  MxGraphContext
} from "../context/MxGraphContext";
import { IMxGraph } from "../types/mxGraph";

import { BuiltInShapes, setStyle } from "../types/shapes";

interface IFlowProps {
  data: ICanvasData;
}

interface IFlowState {
  graph?: IMxGraph;
}

const {
  mxGraph,
} = mxGraphJs;

export class Flow extends React.PureComponent<IFlowProps, IFlowState> {
  private readonly _containerRef = React.createRef<HTMLDivElement>();
  private _setGraph?: (graph: IMxGraph) => void;

  public render(): React.ReactNode {
    return (
      <MxGraphContext.Consumer>{(value: IMxGraphContext) => {
        const {
          graph,
          setGraph,
          readData,
        } = value;

        this._setGraph = setGraph;

        if (graph) {
          readData(graph, this.props.data);
        }
        return (
          <div className="flow-container" ref={this._containerRef} />
        );
      }}
      </MxGraphContext.Consumer>
    );
  }

  public readonly componentDidMount = (): void => {
    if (!this._setGraph) {
      throw new Error("_setGraph does not initialized!");
    }

    this._initMxGraph(this._setGraph);
  }

  private readonly _initMxGraph = (setGraph: (graph: IMxGraph) => void): void => {
    if (this._containerRef.current === null) {
      throw new Error("empty flow container!");
    }

    const graph = new mxGraph(this._containerRef.current);

    setGraph(graph);

  }
}

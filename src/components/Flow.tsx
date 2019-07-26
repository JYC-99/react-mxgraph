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
          setGraph,
        } = value;

        this._setGraph = setGraph;

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

    graph
      .getModel()
      .beginUpdate();

    try {
      const parent = graph.getDefaultParent();

      const vertexes = this.props.data.nodes.map((node) => {
        const width = node.size ? node.size[0] : 200;
        const height = node.size ? node.size[1] : 200;

        return {
          vertex: graph.insertVertex(parent, null, node.label, node.x, node.y, width, height),
          id: node.id
        };
      });

      this.props.data.edges.forEach((edge) => {
        const source = vertexes.find((v) => v.id === edge.source);
        const target = vertexes.find((v) => v.id === edge.target);

        if (source && target) {
          graph.insertEdge(parent, null, "", source.vertex, target.vertex);
        }
      });
    } finally {
      graph
        .getModel()
        .endUpdate();
    }
  }
}

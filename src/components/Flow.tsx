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
import { customShortcutDictionary } from "../types/command";
import { IMxGraph } from "../types/mxGraph";

interface IFlowProps {
  data: ICanvasData;
  shortcut?: object;
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
  constructor(props: IFlowProps) {
    super(props);
    if (this.props.shortcut) {
      Object.assign(customShortcutDictionary, this.props.shortcut);
    }
  }

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
        // const Background = require("../../images/grid.gif");
        return (
          <div style={{width: "100%", height: "100%", overflow: "scroll"}} className="flow-container" ref={this._containerRef} />
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

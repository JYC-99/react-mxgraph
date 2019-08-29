import * as React from "react";

// @ts-ignore
// import * as mxGraphJs from "mxgraph-js";

// const {
//     mxUtils,
//   } = mxGraphJs;

import {
  mxUtils
} from "../mxgraph";

import {
  IMxGraphContext,
  MxGraphContext,
} from "../context/MxGraphContext";

import {
  IMxCell,
  IMxGraph,
} from "../types/mxGraph";

import {
  ICanvasNode
} from "../types/flow";

export interface IItemProps {
  shape: string;
  size?: string;
  model?: {
    color: string;
    label: string;
  };
}

export class Item extends React.PureComponent<IItemProps>{
  public _insertVertex?: (parent: IMxCell, graph: IMxGraph, node: ICanvasNode) => IMxCell;
  private readonly _containerRef = React.createRef<HTMLDivElement>();
  private _graph?: IMxGraph;
  constructor(props: IItemProps) {
    super(props);
  }

  public render(): React.ReactNode {

    return (
      <div ref={this._containerRef} style={{height: "100%"}}>
        {this.props.children}
        <MxGraphContext.Consumer>{(context: IMxGraphContext) => {
          const { graph, insertVertex } = context;
          const container = this._containerRef.current;
          if (graph && insertVertex) {
            this._graph = graph;
            this._insertVertex = insertVertex;
          } else {
            return null;
          }
          if (container) {
            this.addToolbarItem(graph, container);
          }
          return null;
        }}</MxGraphContext.Consumer>
      </div>
    );
  }

  public componentDidMount = () => {

    if (this._graph && this._containerRef.current) {
      this.addToolbarItem(this._graph, this._containerRef.current);
    }
  }

  public componentDidUpdate = () => {
    // console.log("item did update");
  }

  private readonly insertNode = (graph: IMxGraph, _evt: PointerEvent, target: IMxCell, x: number, y: number): void => {
    const label = this.props.model && this.props.model.label ? this.props.model.label : "none";

    const shape = this.props.shape;
    const tmp = this.props.size ? this.props.size.split("*")
       .map((s) => parseInt(s, 10)) : [100, 70];
    const size: [number, number] = [tmp[0], tmp[1]];
    const nodeData: ICanvasNode = { label, size, x, y, shape, };

    if (!this._insertVertex) {
      throw new Error("no insert vertex");
    }
    this._insertVertex(target, graph, nodeData);

  }

  private readonly addToolbarItem = (graph: IMxGraph, elt: HTMLDivElement | HTMLSpanElement): void => {
    const size = this.props.size ? this.props.size.split("*") : [100, 70];
    const dragElt = document.createElement("div");
    dragElt.style.border = "dashed black 1px";
    dragElt.style.width =  `${size[0]}px`;
    dragElt.style.height = `${size[1]}px`;
    // cspell: disable-next-line
    mxUtils.makeDraggable(elt, graph, this.insertNode, dragElt, null, null, graph.autoscroll, true);
  }
}

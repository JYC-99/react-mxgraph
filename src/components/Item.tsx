import * as React from "react";

// @ts-ignore
import * as mxGraphJs from "mxgraph-js";

const {
    mxCell,
    mxUtils,
    mxGeometry,
    mxConnectionConstraint,
    mxPoint,
    mxRectangleShape,
    mxConstants,
  } = mxGraphJs;

import {
  IMxGraphContext,
  MxGraphContext,
} from "../context/MxGraphContext";

import { ICanvasNode } from "../types/flow";
import {
  ImxCell,
  IMxGraph,
} from "../types/mxGraph";

export interface IItemProps {
  shape: string;
  size?: string;
  model?: {
    color: string;
    label: string;
  };
}

export class Item extends React.PureComponent<IItemProps>{
  public _insertVertex?: (parent: ImxCell, graph: IMxGraph, node: ICanvasNode) => ImxCell;
  private readonly _containerRef = React.createRef<HTMLDivElement>();
  private _graph?: IMxGraph;
  constructor(props: IItemProps) {
    super(props);
  }

  public render(): React.ReactNode {

    return (
      <div ref={this._containerRef}>
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
    console.log("item did update");
  }

  private readonly addVertex = (text: string, width: string, height: string, style: string): ImxCell => {
    const vertex = new mxCell(text, new mxGeometry(0, 0, width, height), style);
    vertex.setVertex(true);
    return vertex;
  }

  private readonly insertNode = (graph: IMxGraph, _evt: PointerEvent, target: ImxCell, x: number, y: number): void => {
    const label = this.props.model && this.props.model.label ? this.props.model.label : "none";
    // tslint:disable-next-line: newline-per-chained-call
    const shape = this.props.shape;
    const size = this.props.size ? (this.props.size.split("*")
      // tslint:disable-next-line
      .map((x) => parseInt(x))) : [100, 70];
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

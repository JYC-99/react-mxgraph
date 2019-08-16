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

import {
  BuiltInShapes,
} from "../types/shapes";

import {
  ImxCell,
  IMxGraph,
} from "../types/mxGraph";

interface IItem {
  shape: string;
  size?: string;
  model?: {
    color: string;
    label: string;
  };
}

export class Item extends React.PureComponent<IItem>{
  private readonly _containerRef = React.createRef<HTMLDivElement>();

  constructor(props: IItem) {
    super(props);
  }

  public render(): React.ReactNode {
    return (
      <div ref={this._containerRef} >
        <MxGraphContext.Consumer>{(context: IMxGraphContext) => {
          const { graph, } = context;
          const container = this._containerRef.current;

          if (!graph || !container) {
            return null;
          }
          this.addToolbarItem(graph, container);
          return null;
        }}</MxGraphContext.Consumer>
        {this.props.children}
      </div>
    );
  }

  private readonly addVertex = (text: string, width: string, height: string, style: string): ImxCell => {
    const vertex = new mxCell(text, new mxGeometry(0, 0, width, height), style);
    vertex.setVertex(true);
    return vertex;
  }

  private readonly setStyle = (config) => {
    let style = "";
    for (const key of Object.keys(config)) {
      // tslint:disable-next-line: prefer-switch
      if (key === "width" || key === "height" || key === "anchorPoints" || key === "text") { continue; }
      if (key === "points") {
        style += `;${key}=${JSON.stringify(config[key])}`;
      } else {
        style += `;${key}=${config[key]}`;
      }
    }
    return style;
  }

  private readonly addToolbarItem = (graph: IMxGraph, elt: HTMLDivElement): void => {
    const size = this.props.size ? this.props.size.split("*") : [100, 70];
    const width = size[0];
    const height = size[1];
    const func = (graphF: IMxGraph, _evt: PointerEvent, target: ImxCell, x: number, y: number) => {
      const style = BuiltInShapes.hasOwnProperty(this.props.shape)
        ? BuiltInShapes[this.props.shape].style
        : this.setStyle(graph.getStylesheet()
                             .getCellStyle(this.props.shape));
      const text = this.props.model && this.props.model.label ? this.props.model.label : "none";
      const cell = this.addVertex(text, width, height, style);
      const cells = graphF.importCells([cell], x, y, target);
      if (cells !== null && cells.length > 0) {
        graphF.scrollCellToVisible(cells[0]);
        // disable select item of tool bar ( will produce a new drag-source )
        graphF.setSelectionCells(cells);
      }
    };

    const dragElt = document.createElement("div");
    dragElt.style.border = "dashed black 1px";
    dragElt.style.width =  `${width}px`;
    dragElt.style.height = `${height}px`;
    // cspell: disable-next-line
    mxUtils.makeDraggable(elt, graph, func, dragElt, null, null, graph.autoscroll, true);
  }
}

import * as React from "react";

// @ts-ignore
import * as mxGraphJs from "mxgraph-js";

const {
    mxCell,
    mxUtils,
    mxGeometry,
  } = mxGraphJs;

import {
  IMxGraphContext,
  MxGraphContext,
} from "../context/MxGraphContext";

import {
  ImxCell,
  IMxGraph,
} from "../types/mxGraph";

interface IItemProps {
  text?: string;
  shape?: string;
}

export class Item extends React.PureComponent<IItemProps> {
  private readonly _containerRef = React.createRef<HTMLDivElement>();
  private readonly item = {
    text: "", width: 100, height: 70, style: "shape=rectangle",
  };

  constructor(props: IItemProps) {
    super(props);

    this.item.text = this.props.text ? this.props.text : "";
    this.item.style = this.props.shape ? this.setStyle(this.props.shape) : "shape=rectangle";
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

  private readonly setStyle = (shape: string) => {
    // cspell: disable-next-line
    if (["swimlane", "rectangle", "ellipse", "rhombus", "triangle", "cylinder", "actor", ""].indexOf(shape) === -1) {
      throw new Error("Item Type Error");
    }
    switch (shape) {
      case "":
      case null:
        return "shape=rectangle";
      default:
        return `shape=${shape}`;
    }
  }

  private readonly addVertex = (text: string, width: number, height: number, style: string): ImxCell => {
    const vertex = new mxCell(text, new mxGeometry(0, 0, width, height), style);
    vertex.setVertex(true);
    return vertex;
  }

  private readonly addToolbarItem = (graph: IMxGraph, elt: HTMLDivElement): void => {

    const { text, width, height, style } = this.item;
    const func = (graphF: IMxGraph, _evt: PointerEvent, target: ImxCell, x: number, y: number) => {

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

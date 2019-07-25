import * as React from "react";

// @ts-ignore
import * as mxGraphJs from "mxgraph-js";

const {
    mxCell,
    mxUtils,
    mxGeometry,
    mxDragSource,
    mxGraphHandler,
  } = mxGraphJs;

import {
  ImxCell,
  IMxGraph,
  IMxGraphContext,
  MxGraphContext,
} from "../context/MxGraphContext";

interface IItemProps {
  text?: string;
  shape?: string;
}

interface IItemStatus {
  container: HTMLDivElement | undefined;
  text: string;
  image: string;
  width: number;
  height: number;
  style: string;
}

export class Item extends React.PureComponent<IItemProps, IItemStatus> {

  constructor(props: IItemProps) {
    super(props);
    this.state = {
      container: undefined,
      text: this.props.text ? this.props.text : "",
      image: this.props.shape ? this.setImage(this.props.shape) : "images/rectangle.gif",
      width: 100,
      height: 70,
      style: this.props.shape ? this.setStyle(this.props.shape) : "shape=rectangle",
    };
  }

  public render(): React.ReactNode {
    return (
      <div ref={this.setContainer} >
        <MxGraphContext.Consumer>{(context: IMxGraphContext) => {
          const { graph, } = context;
          const { container, } = this.state;
          if (!graph || !container) {
            // tslint:disable-next-line: no-console
            console.log("test Item not init toolbar container");
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

  private readonly setImage = (shape: string | null) => {
    switch (shape) {
      case "":
      case null:
        return "/images/rectangle.gif";
      default:
        return `/images/${shape}.gif`;
    }
  }

  private readonly addVertex = (text: string, width: number, height: number, style: string): ImxCell => {
    const vertex = new mxCell(text, new mxGeometry(0, 0, width, height), style);
    vertex.setVertex(true);
    return vertex;
  }

  private readonly addToolbarItem = (graph: IMxGraph, elt: HTMLDivElement): void => {
    // mxGraphHandler.prototype.guidesEnabled = true;

    const { text, width, height, style } = this.state;
    const func = (graphF: IMxGraph, _evt: PointerEvent, target: ImxCell, x: number, y: number) => {

      const cell = this.addVertex(text, width, height, style);
      // console.log("offset", _evt.offsetX, _evt.offsetY);
      const cells = graphF.importCells([cell], x, y, target);
      // console.log(cells);
      // console.log("1", graph);
      // console.log("2", graphF);
      // console.log("....");
      // console.log(x, y);
      // console.log(_evt);
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
    /*
    ds.isGuidesEnabled = () => {
      return graph.graphHandler.guidesEnabled;
    };

    ds.createDragElement = mxDragSource.prototype.createDragElement;
    */
  }
  private readonly setContainer = (container: HTMLDivElement | null): void => {
    if (container !== null) {
      // console.log("init item container", container);
      this.setState({
        container,
      });
    }
  }
}

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
  } = mxGraphJs;

import {
  IMxGraphContext,
  MxGraphContext,
} from "../context/MxGraphContext";

import {
  ImxCell,
  IMxGraph,
} from "../types/mxGraph";

interface IConfig {
  width?: number;
  height?: number;
  rounded?: 0 | 1;
  fillColor?: string;
  shadow?: 0 | 1;
  strokeWidth?: number; // boarder
  strokeColor?: string;
  anchorPoints?: number[][];
  label?: string;
  shape?: string;
  fontColor?: string;
  fontSize?: number;
  gradientColor?: string;
}

interface IItemProps {
  config?: IConfig;
}

import { Shapes } from "../types/shapes";

export class Item extends React.PureComponent<IItemProps>{
  private readonly _containerRef = React.createRef<HTMLDivElement>();
  private readonly item = {
    text: "", width: 100, height: 70, style: "shape=rectangle",
  };

  constructor(props: IItemProps) {
    super(props);
    const config = this.props.config;
    if (config) {
      this.item.text = config.label ? config.label : "";
      this.item.style = config.shape ? this.setStyle(config.shape) : "shape=rectangle";
      this.item.width = config.width ? config.width : 100;
      this.item.height = config.height ? config.height : 70;
    }
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
          const config = this.props.config;
          if (config && config.shape && config.shape === "rectangle") {
            this.initRecAnchorPoints();

          }
          this.addToolbarItem(graph, container);
          return null;
        }}</MxGraphContext.Consumer>
        {this.props.children}
      </div>
    );
  }

  private readonly setStyle = (shape: string) => {
    if (Shapes.hasOwnProperty(shape)) {
      if (!this.props.config) {
        return Shapes[shape].style;
      } else {
        const config = this.props.config;
        let style = "shape=rectangle"; // only for configuring rectangle
        for (const key of Object.keys(config)) {
          // tslint:disable-next-line: prefer-switch
          if (key === "width" || key === "height" || key === "anchorPoints" || key === "text") { continue; }
          style += `;${key}=${config[key]}`;
        }
        return style;
      }
    } else {
      throw new Error("error shape type");
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

  private initRecAnchorPoints(): void {
    if (this.props.config && this.props.config.anchorPoints) {
      const arr = this.props.config.anchorPoints;
      const constr = [];
      for (const pt of arr) {
        constr.push(new mxConnectionConstraint(new mxPoint(pt[0], pt[1]), true));
      }
      mxRectangleShape.prototype.constraints = constr;
    }
  }
}

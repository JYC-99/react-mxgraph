import * as React from "react";

// @ts-ignore
import * as mxGraphJs from "mxgraph-js";

const {
  mxEvent
} = mxGraphJs;

import {
  IMxGraphContext,
  MxGraphContext,
} from "../context/MxGraphContext";
import { IMxCell, IMxGraph, } from "../types/mxGraph";

import {
  PanelContext,
} from "../context/PanelContext";

export class DetailPanel extends React.PureComponent<{}, { cells?: IMxCell[] }> {
  public _first: boolean;
  constructor(props: {}) {
    super(props);
    this._first = true;
    this.state = {
      cells: undefined,
    };

  }

  public render(): React.ReactNode {
    // console.log("render");
    return (
      <MxGraphContext.Consumer>{(value: IMxGraphContext) => {
        const {
          graph,
        } = value;
        if (graph) {
          if (this._first) {
            this._setListener(graph);
            this._first = false;
          }
          const name = this._getName(graph, this.state.cells);
          return (
            <PanelContext.Provider value={{ name, cells: this.state.cells }}>
              <div>
                {this.props.children}
              </div>
            </PanelContext.Provider>
          );
        }
        return null;
      }}</MxGraphContext.Consumer>
    );
  }

  private readonly _setListener = (graph: IMxGraph) => {

    graph.getSelectionModel()
      .addListener(mxEvent.CHANGE, (_sender, _evt) => {
        // console.log(_sender, _evt);
        // console.log(graph.getSelectionCells()[0], graph.getDefaultParent());
        this.setState({ cells: graph.getSelectionCells() });
      });
  }

  private readonly _getName = (graph: IMxGraph, cells?: IMxCell[]): string => {
    if (!cells) {
      return "no selection";
    }
    if (cells.length > 1) {
      if (cells.map((cell) => +!graph.isPort(cell))
        .reduce((acc, cur) => (acc + cur)) === 1) {
        return "vertex";
      }

      return "multi";
      // tslint:disable-next-line: prefer-switch
    } else if (cells.length === 1) {
      const cell = cells[0];
      if (graph.isPort(cell)) { return "port"; }
      if (cell.vertex) { return "vertex"; }
      else if (cell.edge) { return "edge"; }
    } else if (cells.length === 0) {
      return "canvas";
    }
    return "?";
  }
}

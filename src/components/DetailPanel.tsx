import * as React from "react";

// @ts-ignore
import * as mxGraphJs from "mxgraph-js";

const {
  mxGraphSelectionModel
} = mxGraphJs;

import {
  IMxGraphContext,
  MxGraphContext,
} from "../context/MxGraphContext";
import { ImxCell, IMxGraph, } from "../types/mxGraph";

import {
  IPanelContext,
  PanelContext,
} from "../context/PanelContext";

export class DetailPanel extends React.PureComponent<{}, {cells?: ImxCell[]}> {
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
          const name = this._getName(this.state.cells);
          return (
            <PanelContext.Provider value={{name, cells: this.state.cells}}>
              <div>
                {this.props.children}
                <p>{name}</p>
              </div>
            </PanelContext.Provider>
          );
        }
        return null;
      }}</MxGraphContext.Consumer>
    );
  }

  private readonly _setListener = (graph: IMxGraph) => {
    // tslint:disable-next-line: no-this-assignment
    const that = this;
    const selectChange = mxGraphSelectionModel.prototype.changeSelection ;
    graph.getSelectionModel().changeSelection = function(): void {
      selectChange.apply(this, arguments);

      that.setState({cells: graph.getSelectionCells()});
    };

  }

  private readonly _getName = (cells?: ImxCell[]): string => {
    if (!cells) {
      return "no selection";
    }
    if (cells.length > 1) {
      return "multi";
    // tslint:disable-next-line: prefer-switch
    } else if (cells.length === 1) {
      const cell = cells[0];
      if (cell.vertex) { return "vertex"; }
      else if (cell.edge) { return "edge"; }
    } else if (cells.length === 0) {
      return "canvas";
    }
    return "?";
  }
}

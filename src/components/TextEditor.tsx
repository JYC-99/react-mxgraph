import * as React from "react";

// @ts-ignore
import * as mxGraphJs from "mxgraph-js";

const {

} = mxGraphJs;

import {
  IMxGraphContext,
  MxGraphContext,
} from "../context/MxGraphContext";
import {
  ISpecialPanelContext,
  SpecialPanelContext,
} from "../context/PanelContext";
import { ImxCell, IMxGraph } from "../types/mxGraph";

export class TextEditor extends React.PureComponent<{}, { value: string }> {
  public _graph: IMxGraph;
  private _cells: ImxCell[];
  private _first: boolean;
  private _isEditing: boolean;
  constructor(props: {}) {
    super(props);
    this.state = {
      value: "...",
    };
    this._first = true;
    this._isEditing = false;
  }
  public render(): React.ReactNode {
    return (
      <SpecialPanelContext.Consumer>{(panelValue: ISpecialPanelContext) => {
        const { enabled, cells } = panelValue;
        if (!enabled) {
          return null;
        }
        this._cells = cells;
        return (
          <MxGraphContext.Consumer>{(value: IMxGraphContext) => {
            const {
              graph,
            } = value;
            if (graph) {
              if (this._first) { // initial after first render
                this._graph = graph;
                this._first = false;
              }
              return (
                <input type="text" placeholder="placeholder" value={this._getInputValue()} onFocus={this.startEditing} onChange={this._onChange} onBlur={this.stopEditing} />
              );
            }
          }}</MxGraphContext.Consumer>
        );

      }}
      </SpecialPanelContext.Consumer>
    );
  }
  private readonly _onChange = (event) => {
    this.setState({ value: event.target.value });
  }

  private readonly _getInputValue = (): string => {
    return this._isEditing ? this.state.value : this._getCellValue();
  }

  private readonly stopEditing = () => {
    const graph = this._graph;
    const cells = this._cells;
    if (!cells) {
      throw new Error("no cells to get value");
    }
    for (const cell of cells) {
      const model = graph.getModel();
      model.beginUpdate();
      try {
        model.setValue(cell, this.state.value);
      } finally {
        model.endUpdate();
      }
    }
  }
  private readonly _getCellValue = () => {
    const cells = this._cells;
    const model = this._graph.getModel();
    if (!cells) {
      throw new Error("no cells to get value");
    }
    if (cells.length) {
      return model.getValue(cells[0]);
    } else {
      throw new Error("canvas has no value");
    }
  }

  private readonly startEditing = () => {
    const cells = this._cells;
    if (!cells) {
      throw new Error("no cells to get value");
    }
    if (cells.length) {
      const value = this._getCellValue();
      this.setState({ value, });
    } else {
      throw new Error("canvas cannot edit text");
    }
    this._isEditing = true;
  }
}

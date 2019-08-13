import * as React from "react";

// @ts-ignore
import * as mxGraphJs from "mxgraph-js";

const {

} = mxGraphJs;

import {
  IMxGraphContext,
  MxGraphContext,
} from "../context/MxGraphContext";
import { IMxGraph, ImxCell } from "../types/mxGraph";

interface ITextEditor {
  name: string;
  cell: ImxCell;
}

export class TextEditor extends React.PureComponent<ITextEditor, { value: string }> {
  public _graph: IMxGraph;
  constructor(props: ITextEditor) {
    super(props);
    this.state = {
      value: "",
    };
  }
  public render(): React.ReactNode {
    return (
      <MxGraphContext.Consumer>{(value: IMxGraphContext) => {
        const {
          graph,
        } = value;
        if (graph) {
          this._graph = graph;
          return (
            
            <input type="text" placeholder={this.props.name} value={this.state.value} onFocus={this.startEditing} onChange={this._onChange} onBlur={this.stopEditing} />
          );
        }
      }}</MxGraphContext.Consumer>
    );
  }
  private readonly _onChange = (event) => {
    console.log(event);
    console.log(this.props.cell);
    this.setState({value: event.target.value});
  }
  
  private readonly stopEditing = () => {
    const graph = this._graph;
    const cell = graph.getSelectionCell();
    if (cell) {
      const model = graph.getModel();
      model.beginUpdate();
      try {
        model.setValue(cell, this.state.value);
      } finally {
        model.endUpdate();
      }
    } else {
      console.log(cell, this.state.value);
    }
  }
  private readonly startEditing = () => {
    const graph = this._graph;
    const cell = graph.getSelectionCell();
    const model = graph.getModel();
    const value = model.getValue(cell);
    this.setState({value,});
  }
}

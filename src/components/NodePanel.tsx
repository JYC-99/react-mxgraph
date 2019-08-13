import * as React from "react";
import {
  IMxGraphContext,
  MxGraphContext,
} from "../context/MxGraphContext";
import { TextEditor } from "./TextEditor";

export class NodePanel extends React.PureComponent {
  public render(): React.ReactNode {
    return (
      <MxGraphContext.Consumer>{(value: IMxGraphContext) => {
        const {
          graph,
        } = value;
        if (graph) {
          const cell = graph.getSelectionCell();
          console.log("nodepanel", cell);
          return (
            <div className="node-panel-container" >
              <TextEditor name="cell" cell={cell}/>
              {this.props.children}
            </div>
          );
        }
        return null;
      }}</MxGraphContext.Consumer>

    );
  }
}

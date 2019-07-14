import * as React from "react";

// @ts-ignore
import * as mxGraph from "mxgraph-js";

console.log(mxGraph);

export class MxGraph extends React.PureComponent {
  public render(): React.ReactNode {
    return this.props.children;
  }
}

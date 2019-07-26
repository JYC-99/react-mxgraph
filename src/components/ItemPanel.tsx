import * as React from "react";

// @ts-ignore
import * as mxGraphJs from "mxgraph-js";

export class ItemPanel extends React.PureComponent {
  public render(): React.ReactNode {

    return (
      <div className="testPanel">
          {this.props.children}
      </div>
    );
  }

}

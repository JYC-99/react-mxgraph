import * as React from "react";

// @ts-ignore
import * as mxGraphJs from "mxgraph-js";

import {
  MxGraphContext
} from "../context/MxGraphContext";

const {
  mxClient,
  mxGraph,
  mxUtils,
} = mxGraphJs;

export class MxGraph extends React.PureComponent {
  private readonly containerRef = React.createRef<HTMLDivElement>();

  public componentWillMount(): void {
    if (!mxClient.isBrowserSupported()) {
      mxUtils.error("Browser is not supported!", 200, false);
    }
  }

  public render(): React.ReactNode {
    return (
      <div ref={this.containerRef}>
        <MxGraphContext.Provider
          value={{
            graph: new mxGraph(this.containerRef.current),
          }}
        >
            {this.props.children}
        </MxGraphContext.Provider>
      </div>
    );
  }
}

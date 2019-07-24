import * as React from "react";

// @ts-ignore
import * as mxGraphJs from "mxgraph-js";

import {
  IMxGraphContext, MxGraphContext
} from "../context/MxGraphContext";

const {
  mxClient,
  mxUtils,
} = mxGraphJs;

const {
  mxGraph,
} = mxGraphJs;

export class MxGraph extends React.PureComponent<{}, {
  graph: IMxGraphContext["graph"];
}> {
  constructor(props: {}) {
    super(props);
    this.state = {
      graph: undefined,
    };
  }

  public componentWillMount(): void {
    if (!mxClient.isBrowserSupported()) {
      mxUtils.error("Browser is not supported!", 200, false);
    }
  }

  public render(): React.ReactNode {
    return (
      <div ref={this.setContainer}>
        <MxGraphContext.Provider
          value={{
            graph: this.state.graph,
          }}
        >
            {this.props.children}
        </MxGraphContext.Provider>
      </div>
    );
  }

  private readonly setContainer = (container: HTMLDivElement | null): void => {
    // console.log("setContainer", container);
    if (container !== null) {
      // console.log("set graph", new mxGraph(container));
      this.setState({
        graph: new mxGraph(container),
      });
    }
    // console.log("setContainer", container, this.state.container);
  }
}

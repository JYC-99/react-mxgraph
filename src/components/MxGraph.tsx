import * as React from "react";

// @ts-ignore
import * as mxGraphJs from "mxgraph-js";

import {
  MxGraphContext
} from "../context/MxGraphContext";
import { IMxGraph } from "../types/mxGraph";

const {
  mxClient,
  mxUtils,
} = mxGraphJs;

interface IState {
  graph?: IMxGraph;
}

export class MxGraph extends React.PureComponent<{}, IState> {
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
      <div>
        <MxGraphContext.Provider
          value={{
            graph: this.state.graph,
            setGraph: (graph) => {
              if (this.state.graph) {
                return;
              }

              this.setState({
                graph,
              });
            }
          }}
        >
            {this.props.children}
        </MxGraphContext.Provider>
      </div>
    );
  }
}

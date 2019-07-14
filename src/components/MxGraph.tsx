import * as React from "react";

// @ts-ignore
import * as mxGraphJs from "mxgraph-js";

import {
  MxGraphContext
} from "../context/MxGraphContext";

const {
  mxClient,
  mxUtils,
} = mxGraphJs;

export class MxGraph extends React.PureComponent<{}, { container: HTMLDivElement | null }> {
  constructor(props: {}) {
    super(props);

    this.state = {
      container: null,
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
            container: this.state.container,
          }}
        >
            {this.props.children}
        </MxGraphContext.Provider>
      </div>
    );
  }

  private readonly setContainer = (container: HTMLDivElement | null): void => {
    this.setState({
      container,
    });
  }
}

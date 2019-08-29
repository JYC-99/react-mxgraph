import * as React from "react";

// @ts-ignore
import * as mxGraphJs from "mxgraph-js";

import { IMxGraphContext, MxGraphContext } from "../context/MxGraphContext";

export class ToolCommand extends React.PureComponent<{ name: string; text?: string }> {
  private readonly _containerRef = React.createRef<HTMLDivElement>();

  constructor(props: { name: string; text?: string }) {
    super(props);

  }

  public render(): React.ReactNode {
    return (
      <div ref={this._containerRef} >
        {this.props.children}
        <MxGraphContext.Consumer>{(value: IMxGraphContext) => {
          const { graph, actions } = value;
          const container = this._containerRef.current;
          if (!graph || !container || !actions) {
            return null;
          }

          const itemType = this.props.name;
          // this.addListener(container, graph, clipboard); do not know if there will be influence
          container.addEventListener("click", (_evt) => {
            actions[itemType].func();
          });
          return null;

        }}</MxGraphContext.Consumer>
      </div>
    );
  }

}

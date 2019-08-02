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
          const { graph, action } = value;
          const container = this._containerRef.current;
          if (!graph || !container || !action) {
            return null;
          }

          const itemType = this.props.name;
          const func = itemType === "paste" ?
          action["paste"].getFunc(200, 200) :
          action[itemType].func;

          // this.addListener(container, graph, clipboard); do not know if there will be influence
          container.addEventListener("click", (_evt) => { func(); });
          return null;

        }}</MxGraphContext.Consumer>
      </div>
    );
  }

  // private readonly addListener = (target: HTMLDivElement, graph: IMxGraph, clipboard: IClipboardContext): void => {
  //   mxEvent.addListener(target, "pointerdown", (evt: PointerEvent) => {
  //     // tslint:disable-next-line: deprecation
  //     console.log(evt);
  //     const source = mxEvent.getSource(evt);
  //     if (graph.isEnabled() && !graph.isEditing() && source.nodeName !== "INPUT") {
  //       // tslint:disable-next-line: deprecation
  //       clipboard.beforeUsingClipboard(graph, clipboard.copy, clipboard.textInput);
  //     }
  //   });
  //   mxEvent.addListener(target, "pointerup", (_evt: PointerEvent) => {
  //     // tslint:disable-next-line: deprecation
  //     console.log(_evt);
  //     clipboard.afterUsingClipboard(graph, clipboard.copy, clipboard.textInput);
  //   });
  // }

}

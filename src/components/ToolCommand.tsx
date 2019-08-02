import * as React from "react";

// @ts-ignore
import * as mxGraphJs from "mxgraph-js";

const {
  mxEvent,
} = mxGraphJs;

import { ClipboardContext, IClipboardContext } from "../context/ClipboardContext";
import { IMxGraphContext, MxGraphContext } from "../context/MxGraphContext";
import { IMxGraph } from '../types/mxGraph';

export class ToolCommand extends React.PureComponent<{ name: string; text?: string }> {
  private readonly _containerRef = React.createRef<HTMLButtonElement>();
  constructor(props: { name: string; text?: string }) {
    super(props);
  }

  public render(): React.ReactNode {
    return (
      <div ref={this._containerRef} >
        {this.props.children}
        <MxGraphContext.Consumer>{(value: IMxGraphContext) => {
          const { graph, } = value;
          const container = this._containerRef.current;
          if (!graph || !container) {
            return null;
          }
          return (
            <ClipboardContext.Consumer>{(clipboardContext: IClipboardContext) => {
              const clipboard = clipboardContext;
              const itemType = this.props.name;
              const func = this._getFuncFromType(itemType, graph, clipboard);
              this.addListener(container, graph, clipboard);
              container.addEventListener("click", (_evt) => { func(); });

              // const func = this._getFuncFromType(itemType, graph, clipboard);
              console.log(container);
              // container.onclick = func;
              return null;

            }}</ClipboardContext.Consumer>
          );
        }}</MxGraphContext.Consumer>
      </div>
    );
  }

  private readonly toggle = (evt, graph, clipboard) => {
    if (this.props.name === "copy") {
      console.log("toggle");
      // navigator.clipboard.readText()
      //       .then(
      //         // tslint:disable-next-line: promise-function-async
      //         (result) => {
      //           // tslint:disable-next-line: no-console
      //           console.log("Successfully retrieved text from clipboard", result);
      //           clipboard.textInput.focus(); // no listener
      //           clipboard.pasteFuncForMenu(result, graph, clipboard.copy, clipboard.textInput, 150, 150);
      //           return Promise.resolve(result);
      //         }
      //       )
      //       .catch(
      //         (err) => {
      //           throw new Error("Error! read text from clipboard");
      //         });

      clipboard.copyFuncForMenu(graph, clipboard.copy, clipboard.textInput);

      const text = clipboard.textInput.value;
      navigator.clipboard.writeText(text)
      .then(
        (result) => {
          // tslint:disable-next-line: no-console
          console.log("Successfully copied to clipboard", result)
        }
      )
      .catch(
      (err) => {
        // tslint:disable-next-line: no-console
        console.log("Error! could not copy text", err)
      });
    }
  }

  private readonly _getFuncFromType = (itemType: string, graph: IMxGraph, clipboard: IClipboardContext) => {
    // tslint:disable-next-line: no-empty
    let func = () => { };
    switch (itemType) {
      case "paste":
        func = () => {
          navigator.clipboard.readText()
            .then(
              // tslint:disable-next-line: promise-function-async
              (result) => {
                // tslint:disable-next-line: no-console
                console.log("Successfully retrieved text from clipboard", result);
                clipboard.textInput.focus(); // no listener
                // tslint:disable-next-line: deprecation
                clipboard.pasteFuncForMenu(result, graph, clipboard.copy, clipboard.textInput, 150, 150);
                return Promise.resolve(result);
              }
            )
            .catch(
              (err) => {
                throw new Error("Error! read text from clipboard");
              });
        };
        break;
      case "copy":
        func = () => {
          clipboard.copyFuncForMenu(graph, clipboard.copy, clipboard.textInput);

          const text = clipboard.textInput.value;
          navigator.clipboard.writeText(text)
          .then(
            (result) => {
              // tslint:disable-next-line: no-console
              console.log("Successfully copied to clipboard", result)
            }
          )
          .catch(
          (err) => {
            // tslint:disable-next-line: no-console
            console.log("Error! could not copy text", err)
          });
        };
        break;
      case "cut":
        func = () => {
          clipboard.cutFunc(graph, clipboard.copy, clipboard.textInput);

          const text = clipboard.textInput.value;
          navigator.clipboard.writeText(text)
          .then(
            (result) => {
              // tslint:disable-next-line: no-console
              console.log("Successfully copied to clipboard", result)
            }
          )
          .catch(
          (err) => {
            // tslint:disable-next-line: no-console
            console.log("Error! could not copy text", err)
          });
        };
        break;
      // case "undo":
      //   func = () => {
      //     this.undoManager.undo();
      //   };
      //   break;
      // case "redo":
      //   func = () => {
      //     this.undoManager.redo();
      //   };
      //   break;
      case "zoomIn":
        func = () => {
          graph.zoomIn();
        };
        break;
      case "zoomOut":
        func = () => {
          graph.zoomOut();
        };
        break;
      default:
        throw new Error("Unknown menu item type");
    }

    return func;
  }

  private readonly addListener = (target: HTMLButtonElement, graph: IMxGraph, clipboard: IClipboardContext): void => {
    mxEvent.addListener(target, "pointerdown", (evt: PointerEvent) => {
      // tslint:disable-next-line: deprecation
      console.log(evt);
      const source = mxEvent.getSource(evt);
      if (graph.isEnabled() && !graph.isEditing() && source.nodeName !== "INPUT") {
        // tslint:disable-next-line: deprecation
        clipboard.beforeUsingClipboard(graph, clipboard.copy, clipboard.textInput);
      }
    });
    mxEvent.addListener(target, "pointerup", (_evt: PointerEvent) => {
      // tslint:disable-next-line: deprecation
      console.log(_evt);
      clipboard.afterUsingClipboard(graph, clipboard.copy, clipboard.textInput);
    });
  }

}

import * as React from "react";

// @ts-ignore
import * as mxGraphJs from "mxgraph-js";

// import {
//   _extractGraphModelFromEvent,
//   _pasteText,
// } from "../utils/Copy";
import {
  ClipboardContext, IClipboardContext,
} from "../context/ClipboardContext";
import {
  MxGraphContext
} from "../context/MxGraphContext";
import { IMxActions } from "../types/action";
import { IMxGraph } from "../types/mxGraph";

const {
  mxClient,
  mxUtils,
  mxEvent,
  mxGraphModel,
  mxGeometry,
  mxPoint,
  mxTransient,
  mxObjectIdentity,
} = mxGraphJs;

window.mxGeometry = mxGeometry;
window.mxGraphModel = mxGraphModel;
window.mxPoint = mxPoint;

interface IState {
  graph?: IMxGraph;
}

export class MxGraph extends React.PureComponent<{}, IState> {
  public static contextType = ClipboardContext;
  private mouseX: number;
  private mouseY: number;
  private action: IMxActions | {};

  constructor(props: {}) {
    super(props);
    this.state = {
      graph: undefined,
    };
    this.mouseX = 0;
    this.mouseY = 0;
    this.action = {};
  }

  public setGraph = (graph: IMxGraph) => {
    if (this.state.graph) {
      return;
    }
    this.addCopyEvent(graph);
    // tslint:disable-next-line: deprecation
    this.action = this.initAction(graph, this.context);

    this.setState({
      graph,
    });
  }

  // tslint:disable-next-line: max-func-body-length
  public addCopyEvent = (graph: IMxGraph) => { // , textInput: HTMLTextAreaElement, copy: ICopy) => {
    // tslint:disable-next-line: deprecation
    const { copy, textInput } = this.context;
    copy.gs = graph.gridSize;
    this.initTextInput(textInput);

    graph.container.onmousemove = (evt) => {
      this.mouseX = evt.offsetX;
      this.mouseY = evt.offsetY;
    };

    mxEvent.addListener(document, "keydown", (evt: KeyboardEvent) => {
      const source = mxEvent.getSource(evt);
      if (graph.isEnabled() && !graph.isMouseDown && !graph.isEditing() && source.nodeName !== "INPUT") {
        // tslint:disable-next-line: deprecation
        if (evt.keyCode === 224 /* FF */ || (!mxClient.IS_MAC && evt.keyCode === 17 /* Control */) || (mxClient.IS_MAC && evt.keyCode === 91 /* Meta */)) {
          // tslint:disable-next-line: deprecation
          this.context.beforeUsingClipboard(graph, copy, textInput);
        }
      }
    });

    mxEvent.addListener(document, "keyup", (evt: KeyboardEvent) => {
      // tslint:disable-next-line: deprecation
      if (copy.restoreFocus && (evt.keyCode === 224 || evt.keyCode === 17 || evt.keyCode === 91)) {
        // tslint:disable-next-line: deprecation
        this.context.afterUsingClipboard(graph, copy, textInput);
      }
    });

    mxEvent.addListener(textInput, "copy", mxUtils.bind(this, (_evt: ClipboardEvent) => {
      // tslint:disable-next-line: deprecation
      this.context.copyFunc(graph, copy, textInput);
    }));

    mxEvent.addListener(textInput, "cut", mxUtils.bind(this, (_evt: ClipboardEvent) => {
      // tslint:disable-next-line: deprecation
      this.context.cutFunc(graph, copy, textInput);
    }));

    mxEvent.addListener(textInput, "paste", (evt: ClipboardEvent) => {
      // tslint:disable-next-line: deprecation
      this.context.pasteFunc(evt, graph, copy, textInput, this.mouseX, this.mouseY);
    });

  }

  public componentWillMount(): void {
    if (!mxClient.isBrowserSupported()) {
      mxUtils.error("Browser is not supported!", 200, false);
    }
  }

  public render(): React.ReactNode {

    return (
      <div className="graph">
        <MxGraphContext.Provider
          value={{
            graph: this.state.graph,
            setGraph: this.setGraph,
            action: this.action,
          }}
        >
            {this.props.children}
        </MxGraphContext.Provider>
      </div>
    );
  }

  private readonly initTextInput = (textInput: HTMLTextAreaElement) => {
    mxUtils.setOpacity(textInput, 0);
    textInput.style.width = "1px";
    textInput.style.height = "1px";
    textInput.value = " ";
  }

  private readonly initAction = (graph: IMxGraph, clipboard: IClipboardContext): IMxActions => {
    return {
      copy: {
        func: () => {
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
            console.log("Error! could not copy text", err);
          });
        },
      },
      cut: {
        func: () => {
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
            console.log("Error! could not copy text", err);
          });
        },
      },
      paste: {
        func: () => {
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
        },
      },

    };

  }
}

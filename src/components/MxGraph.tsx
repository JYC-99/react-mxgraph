import * as React from "react";

// @ts-ignore
import * as mxGraphJs from "mxgraph-js";

import {
  ClipboardContext, IClipboardContext,
} from "../context/ClipboardContext";
import {
  MxGraphContext
} from "../context/MxGraphContext";
import { init } from "../settings/init";
import { IMxActions } from "../types/action";
import { IMxEventObject, IMxGraph, IMxUndoManager } from "../types/mxGraph";

const {
  mxClient,
  mxUtils,
  mxEvent,
  mxGraphModel,
  mxGeometry,
  mxPoint,
  mxTransient,
  mxObjectIdentity,
  mxUndoManager,
  mxGraph,
  mxKeyHandler,
  mxConstants,
} = mxGraphJs;

window.mxGeometry = mxGeometry;
window.mxGraphModel = mxGraphModel;
window.mxPoint = mxPoint;

interface IState {
  graph?: IMxGraph;
}

export class MxGraph extends React.PureComponent<{}, IState> {
  public static contextType = ClipboardContext;
  private undoManager: IMxUndoManager;
  private mouseX: number;
  private mouseY: number;
  private action: IMxActions;

  constructor(props: {}) {
    super(props);
    this.state = {
      graph: undefined,
    };
    this.mouseX = 0;
    this.mouseY = 0;
  }

  public setGraph = (graph: IMxGraph) => {
    if (this.state.graph) {
      return;
    }
    init(graph);
    // tslint:disable-next-line: deprecation
    this.action = this.initAction(graph, this.context);

    this.undoManager = new mxUndoManager();
    this.addUndoEvent(graph);
    this.addCopyEvent(graph);
    this.setKeyHandler(graph);
    this.setMouseEvent(graph);
    this.setState({
      graph,
    });
  }

  public addUndoEvent = (graph: IMxGraph) => {
    const listener = (_sender, evt: IMxEventObject) => {
      this.undoManager.undoableEditHappened(evt.getProperty("edit"));
    };
    graph.getModel()
      .addListener(mxEvent.UNDO, listener);
    graph.getView()
      .addListener(mxEvent.UNDO, listener);
  }
  // tslint:disable-next-line: max-func-body-length
  public addCopyEvent = (graph: IMxGraph) => { // , textInput: HTMLTextAreaElement, copy: ICopy) => {
    // tslint:disable-next-line: deprecation
    const { copy, textInput } = this.context;
    copy.gs = graph.gridSize;
    this.initTextInput(textInput);

    // For jest
    // tslint:disable-next-line: strict-type-predicates
    if (graph.container !== undefined) {
      mxEvent.addListener(graph.container, "mousemove", mxUtils.bind(this, (evt: MouseEvent) => {
        this.mouseX = evt.offsetX;
        this.mouseY = evt.offsetY;
      }));
    }

    // tslint:disable-next-line: cyclomatic-complexity
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

  private readonly setKeyHandler = (graph: IMxGraph): void => {
    const keyHandler = new mxKeyHandler(graph);
    keyHandler.bindControlKey(90, (evt) => {
      this.action.undo.func();
    });
    keyHandler.bindKey(8, (evt) => {
      this.action.deleteCell.func();
    });
  }

  private readonly setMouseEvent = (graph: IMxGraph): void => {
    function updateStyle(state, hover): void {
      state.style.strokeColor = (hover) ? "#1976d2" : state.style.strokeColor;
      state.style.strokeWidth = 1;
      state.style.shadow = (hover) ? 0 : state.style.shadow;
      // state.style[mxConstants.STYLE_FONTSTYLE] = (hover) ? mxConstants.FONT_BOLD : "0";
    }
    graph.addMouseListener(
      {
        currentState: null,
        previousStyle: null,
        mouseDown(_sender, me): void {
          if (this.currentState) {
            this.dragLeave(me.getEvent(), this.currentState);
            this.currentState = null;
          }
        },
        mouseMove(_sender, me): void {
          if (this.currentState && me.getState() === this.currentState) {
            return;
          }
          let tmp = graph.view.getState(me.getCell());

          // Ignores everything but vertices
          const model = graph.getModel();
          if (graph.isMouseDown || (tmp && !model.isVertex(tmp.cell) && !model.isEdge(tmp.cell))) {
            tmp = null;
          }
          if (tmp !== this.currentState) {
            if (this.currentState) {
              this.dragLeave(me.getEvent(), this.currentState);
            }

            this.currentState = tmp;

            if (this.currentState) {
              this.dragEnter(me.getEvent(), this.currentState);
            }
          }
        },
        // tslint:disable-next-line: no-empty
        mouseUp(_sender, _me): void { },
        dragEnter(_evt, state): void {
          if (state) {
            this.previousStyle = state.style;
            state.style = mxUtils.clone(state.style);
            updateStyle(state, true);
            state.shape.apply(state);
            state.shape.redraw();

            if (state.text) {
              state.text.apply(state);
              state.text.redraw();
            }
          }
        },
        dragLeave(_evt, state): void {
          if (state) {
            state.style = this.previousStyle;
            updateStyle(state, false);
            if (state.shape) {
              state.shape.apply(state);
              state.shape.redraw();
              if (state.text) {
                state.text.apply(state);
                state.text.redraw();
              }
            }
          }
        }
      });

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
                console.log("Successfully copied to clipboard", result);
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
                console.log("Successfully copied to clipboard", result);
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
        getFunc(destX?, destY?): () => void {
          return () => {
            navigator.clipboard.readText()
              .then(
                // tslint:disable-next-line: promise-function-async
                (result) => {
                  // tslint:disable-next-line: no-console
                  console.log("Successfully retrieved text from clipboard", result);
                  clipboard.textInput.focus(); // no listener
                  // tslint:disable-next-line: deprecation
                  clipboard.pasteFuncForMenu(result, graph, clipboard.copy, clipboard.textInput, destX, destY);
                  return Promise.resolve(result);
                }
              )
              .catch(
                (err) => {
                  throw new Error("Error! read text from clipboard");
                });
          };
        },
      },
      undo: {
        func: () => {
          this.undoManager.undo();
        },
      },
      redo: {
        func: () => {
          this.undoManager.redo();
        },
      },
      zoomIn: {
        func: () => {
          graph.zoomIn();
        },
      },
      zoomOut: {
        func: () => {
          graph.zoomOut();
        },
      },
      deleteCell: {
        func: () => {
          graph.removeCells();
        },
      },
      fit: {
        func: () => {
          graph.fit();
        }
      },

    };

  }
}

import * as React from "react";

// @ts-ignore
import * as mxGraphJs from "mxgraph-js";

// import {
//   _extractGraphModelFromEvent,
//   _pasteText,
// } from "../utils/Copy";
import {
  ClipboardContext,
} from "../context/ClipboardContext";
import {
  MxGraphContext
} from "../context/MxGraphContext";
import { ImxCell, IMxGraph } from "../types/mxGraph";

const {
  mxClient,
  mxUtils,
  mxEvent,
  mxClipboard,
  mxGraphModel,
  mxCodec,
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

interface ICopy {
  gs: number;
  dx: number;
  dy: number;
  lastPaste: string | null;
  restoreFocus: boolean;
}

export class MxGraph extends React.PureComponent<{}, IState> {
  public static contextType = ClipboardContext;
  private readonly copy: ICopy;
  private readonly textInput = document.createElement("textarea");
  private mouseX: number;
  private mouseY: number;

  constructor(props: {}) {
    super(props);
    this.state = {
      graph: undefined,
    };
    this.mouseX = 0;
    this.mouseY = 0;
    this.copy = {gs: 0, dx: 0, dy: 0, lastPaste: null, restoreFocus: false};
    this.initTextInput(this.textInput);
  }

  public setGraph = (graph: IMxGraph) => {
    if (this.state.graph) {
      return;
    }
    this.addCopyEvent(graph);

    this.setState({
      graph,
    });
  }

  // tslint:disable-next-line: max-func-body-length
  public addCopyEvent = (graph: IMxGraph) => { // , textInput: HTMLTextAreaElement, copy: ICopy) => {

    const { copy, textInput } = this.context;
    copy.gs = graph.gridSize;
    this.initTextInput(textInput);

    mxEvent.addListener(document, "keydown", (evt) => {
      const source = mxEvent.getSource(evt);
      if (graph.isEnabled() && !graph.isMouseDown && !graph.isEditing() && source.nodeName !== "INPUT") {
        if (!copy.restoreFocus) {
          textInput.style.position = "absolute";
          textInput.style.left = `${(graph.container.scrollLeft + 10)}px`;
          textInput.style.top = `${(graph.container.scrollTop + 10)}px`;
          graph.container.appendChild(textInput);
          copy.restoreFocus = true;
          textInput.focus();
          textInput.select();
        }
      }
    });

    mxEvent.addListener(document, "keyup", (evt) => {
      if (copy.restoreFocus && (evt.keyCode === 224 || evt.keyCode === 17 || evt.keyCode === 91)) {
        copy.restoreFocus = false;
        if (!graph.isEditing()) { graph.container.focus(); }
        if (textInput.parentNode) { textInput.parentNode.removeChild(textInput); }
      }
    });

    mxEvent.addListener(textInput, "copy", mxUtils.bind(this, (evt) => {
      console.log("copy", evt);
      this.context.copyFunc(graph, copy, textInput);
    }));

    mxEvent.addListener(textInput, "cut", mxUtils.bind(this, (evt) => {
      console.log("cut");
      this.context.cutFunc(graph, copy, textInput);
    }));

    mxEvent.addListener(textInput, "paste", (evt) => {
      console.log("paste");
      this.context.pasteFunc(evt, graph, copy, textInput, this.mouseX, this.mouseY);
    });

  }

  public componentWillMount(): void {
    if (!mxClient.isBrowserSupported()) {
      mxUtils.error("Browser is not supported!", 200, false);
    }
  }

  public handleMouseMove = (event: React.MouseEvent) => {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
  }

  public render(): React.ReactNode {
    console.log("render");
    return (
      <div className="graph" onMouseMove={this.handleMouseMove}>
        <MxGraphContext.Provider
          value={{
            graph: this.state.graph,
            setGraph: this.setGraph
          }}
        >
            {this.props.children}
        </MxGraphContext.Provider>
      </div>
    );
  }

  public componentDidMount(): void {
    console.log("did mount", this.state.graph);
  }

  private readonly initTextInput = (textInput: HTMLTextAreaElement) => {
    mxUtils.setOpacity(textInput, 0);
    textInput.style.width = "1px";
    textInput.style.height = "1px";
    textInput.value = " ";
  }

}

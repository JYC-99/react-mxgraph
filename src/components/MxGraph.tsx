import * as React from "react";

// @ts-ignore
import * as mxGraphJs from "mxgraph-js";

import {
  MxGraphContext
} from "../context/MxGraphContext";
import { IMxGraph, ImxCell } from "../types/mxGraph";
import { clone } from '@babel/types';

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
  private readonly copy: ICopy;
  private readonly textInput = document.createElement("textarea");

  constructor(props: {}) {
    super(props);
    this.state = {
      graph: undefined,
    };
    this.copy = {gs: 0, dx: 0, dy: 0, lastPaste: null, restoreFocus: false};
    this.initTextInput(this.textInput);
  }

  public setGraph = (graph: IMxGraph) => {
    console.log("setGraph");
    if (this.state.graph) {
      return;
    }
    console.log("addcopy");
    this.addCopyEvent(graph, this.textInput, this.copy);

    this.setState({
      graph,
    });
  }

  public addCopyEvent = (graph: IMxGraph, textInput: HTMLTextAreaElement, copy: ICopy) => {
    // const{ gs, dx, dy, lastPaste, restoreFocus } = copy;
    copy.gs = graph.gridSize;

    mxClipboard.cellsToString = (cells: ImxCell[]) => {
      const codec = new mxCodec();
      const model = new mxGraphModel();
      const parent = model.getChildAt(model.getRoot(), 0);

      for (const cell of cells) { model.add(parent, cell); }

      return mxUtils.getXml(codec.encode(model));
    };

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

    const copyCells = (graph, cells) => {
      if (cells.length > 0) {
        const clones = graph.cloneCells(cells);

        for (let i = 0; i < clones.length; i += 1) {
          const state = graph.view.getState(cells[i]);
          if (state !== null) {
            const geo = graph.getCellGeometry(clones[i]);
            if (geo !== null && geo.relative) {
              geo.relative = false;
              geo.x = state.x / state.view.scale - state.view.translate.x;
              geo.y = state.y / state.view.scale - state.view.translate.y;
            }
          }
        }
        textInput.value = mxClipboard.cellsToString(clones);
      }
      textInput.select();
      copy.lastPaste = textInput.value;
    };

    mxEvent.addListener(textInput, "copy", mxUtils.bind(this, (evt) => {
      if (graph.isEnabled() && !graph.isSelectionEmpty()) {
        copyCells(graph, mxUtils.sortCells(graph.model.getTopmostCells(graph.getSelectionCells())));
        copy.dx = 0;
        copy.dy = 0;
      }
    }));

    mxEvent.addListener(textInput, "cut", mxUtils.bind(this, (evt) => {
      if (graph.isEnabled() && !graph.isSelectionEmpty()) {
        copyCells(graph, graph.removeCells());
        copy.dx = -copy.gs;
        copy.dy = -copy.gs;
      }
    }));

    mxEvent.addListener(textInput, "paste", (evt) => {
      textInput.value = " ";
      if (graph.isEnabled()) {
        const xml = this._extractGraphModelFromEvent(evt);
        // console.log(xml);
        if (xml !== null && xml.length > 0) { this._pasteText(graph, xml, copy); }
        else {
          window.setTimeout(mxUtils.bind(window, () => {
            this._pasteText(graph, textInput.value, copy);
          }), 0);
        }
      }
      // console.log(textInput);
      textInput.select();
    });

  }

  public componentWillMount(): void {
    if (!mxClient.isBrowserSupported()) {
      mxUtils.error("Browser is not supported!", 200, false);
    }
  }

  public render(): React.ReactNode {
    console.log("render");
    return (
      <div>
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

  private readonly _importXml = (graph: IMxGraph, xml, copy) => {
    copy.dx = (copy.dx !== null) ? copy.dx : 0;
    copy.dy = (copy.dy !== null) ? copy.dy : 0;
    let cells: ImxCell[] = [];

    try {
      const doc = mxUtils.parseXml(xml);
      const node = doc.documentElement;

      if (node !== null) {
        const model = new mxGraphModel();
        const codec = new mxCodec(node.ownerDocument);
        codec.decode(node, model);

        const childCount = model.getChildCount(model.getRoot());
        const targetChildCount = graph.model.getChildCount(graph.model.getRoot());

        // Merges existing layers and adds new layers
        graph.model.beginUpdate();
        try {
          for (let i = 0; i < childCount; i += 1) {
            let parent = model.getChildAt(model.getRoot(), i);
            // Adds cells to existing layers if not locked
            if (targetChildCount > i) {
              // Inserts into active layer if only one layer is being pasted
              const target = (childCount === 1) ? graph.getDefaultParent() : graph.model.getChildAt(graph.model.getRoot(), i);

              if (!graph.isCellLocked(target)) {
                const children = model.getChildren(parent);
                console.log("children & target", children, target);
                const cell = graph.importCells(children, 5, 5, target);
                if (cell) {
                  cells = cells.concat(cell);
                }
              }
            }
            else {
              // Delta is non cascading, needs separate move for layers
              parent = graph.importCells([parent], 0, 0, graph.model.getRoot())[0];
              const children = graph.model.getChildren(parent);
              graph.moveCells(children, copy.dx, copy.dy);
              cells = cells.concat(children);
            }
          }
          console.log("cells", cells);
        }
        finally {
          graph.model.endUpdate();
        }
      }
    }
    catch (e) {
      // alert(e);
      throw e;
    }
    return cells;
  }

  private readonly _pasteText = (graph: IMxGraph, text, copy) => {
    const xml = mxUtils.trim(text);
    const x = graph.container.scrollLeft / graph.view.scale - graph.view.translate.x;
    const y = graph.container.scrollTop / graph.view.scale - graph.view.translate.y;
    if (xml.length > 0) {
      if (copy.lastPaste !== xml) {
        copy.lastPaste = xml;
        copy.dx = 0;
        copy.dy = 0;
      }
      else {
        copy.dx += copy.gs;
        copy.dy += copy.gs;
      }
      // Standard paste via control-v
      if (xml.substring(0, 14) === "<mxGraphModel>") {
        graph.setSelectionCells(this._importXml(graph, xml, copy));
        // console.log("in", this._importXml(graph, xml, copy));
        graph.scrollCellToVisible(graph.getSelectionCells());
      }
    }
  }

  private readonly _extractGraphModelFromEvent = (evt) => {
    let data = null;
    if (evt !== null) {
      const provider = (evt.dataTransfer) ? evt.dataTransfer : evt.clipboardData;

      if (provider !== null) {
        if (document.ducumentMode === 10 || document.documentMode === 11) { data = provider.getData("Text"); }
        else {
          data = (mxUtils.indexOf(provider.types, "text/html") >= 0) ? provider.getData("text/html") : null;
          if (mxUtils.indexOf(provider.types, "text/plain" && (data === null || data.length === 0))) {
            data = provider.getData("text/plain");
          }
        }
      }

    }

    return data;
  }

}

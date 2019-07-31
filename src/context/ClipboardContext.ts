// @ts-ignore
import * as mxGraphJs from "mxgraph-js";
import * as React from "react";
import {  ImxCell, IMxGraph } from "../types/mxGraph";
const {
  mxUtils,
  mxEvent,
  mxClipboard,
  mxGraphModel,
  mxCodec,
} = mxGraphJs;

mxClipboard.cellsToString = (cells) => {
  const codec = new mxCodec();
  const model = new mxGraphModel();
  const parent = model.getChildAt(model.getRoot(), 0);

  for (const cell of cells) { model.add(parent, cell); }

  return mxUtils.getXml(codec.encode(model));
};

interface ICopy {
  gs: number;
  dx: number;
  dy: number;
  lastPaste: string | null;
  restoreFocus: boolean;
}

export interface IClipboardContext {
  copy: ICopy;
  textInput: HTMLTextAreaElement;
  copyFunc(graph: IMxGraph, copy: ICopy, textInput: HTMLTextAreaElement): void;
  copyFuncForMenu(graph: IMxGraph, copy: ICopy, textInput: HTMLTextAreaElement): void;
  cutFunc(graph: IMxGraph, copy: ICopy, textInput: HTMLTextAreaElement): void;
  pasteFunc(evt: ClipboardEvent, graph: IMxGraph, copy: ICopy, textInput: HTMLTextAreaElement, mouseX: number, mouseY: number): void;
  pasteFuncForMenu(result: XMLDocument, graph: IMxGraph, copy: ICopy, textInput: HTMLTextAreaElement, mouseX: number, mouseY: number): void;
  beforeUsingClipboard(graph: IMxGraph, copy: ICopy, textInput: HTMLTextAreaElement): void;
  afterUsingClipboard(graph: IMxGraph, copy: ICopy, textInput: HTMLTextAreaElement): void;
}

const copyCells = (graph: IMxGraph, cells: ImxCell[], copy: ICopy, textInput: HTMLTextAreaElement) => {
  if (cells.length > 0) {
    const clones = graph.cloneCells(cells);

    for (let i = 0; i < clones.length; i += 1) {
      const state = graph.view.getState(cells[i]);
      // tslint:disable-next-line: strict-type-predicates  triple-equals
      if (state != null) { // must use !=
        const geo = graph.getCellGeometry(clones[i]);
        // tslint:disable-next-line: strict-type-predicates  triple-equals
        if (geo != null && geo.relative) { // must use !=
          geo.relative = false;
          geo.x = state.x / state.view.scale - state.view.translate.x;
          geo.y = state.y / state.view.scale - state.view.translate.y;
        }
      }
    }
    textInput.value = mxClipboard.cellsToString(clones); // mxCell => xml
  }
  textInput.select();
  copy.lastPaste = textInput.value;
};
// tslint:disable-next-line: cyclomatic-complexity
const _importXml = (graph: IMxGraph, xml, copy, mouseX, mouseY) => {
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
              const cell = graph.importCells(children,
                mouseX - children[0].geometry.x - children[0].geometry.width / 2,
                mouseY - children[0].geometry.y - children[0].geometry.height / 2,
                target);
              if (cell) {
                cells = cells.concat(cell);
              }
            }
          }
          else {
            // Delta is non cascading, needs separate move for layers
            parent = graph.importCells([parent], 0, 0, graph.model.getRoot())[0];
            if (parent) {
              const children = graph.model.getChildren(parent);
              graph.moveCells(children,
                mouseX - children[0].geometry.x - children[0].geometry.width / 2,
                mouseY - children[0].geometry.y - children[0].geometry.height / 2);
              cells = cells.concat(children);
            }
          }
        }
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
};

// tslint:disable-next-line: cyclomatic-complexity
const _pasteText = (graph: IMxGraph, text, copy, mouseX, mouseY) => {
  const xml = mxUtils.trim(text);
  // console.log("text", text);
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
      const cells = _importXml(graph, xml, copy, mouseX, mouseY);
      graph.setSelectionCells(cells);
      graph.scrollCellToVisible(graph.getSelectionCells());
    }
  }
};
const _extractGraphModelFromEvent = (evt: ClipboardEvent) => {
  let data = null;

  // tslint:disable-next-line: triple-equals strict-type-predicates
  if (evt != null) {
    const provider = (evt.dataTransfer) ? evt.dataTransfer : evt.clipboardData;
    // console.log("...", evt);
    if (provider !== null) {
      if (document.ducumentMode === 10 || document.documentMode === 11) { data = provider.getData("Text"); }
      else {
        data = (mxUtils.indexOf(provider.types, "text/html") >= 0) ? provider.getData("text/html") : null;
        // tslint:disable-next-line: binary-expression-operand-order
        if (mxUtils.indexOf(provider.types, "text/plain" && (data === null || data.length === 0))) {
          data = provider.getData("text/plain");
        }
      }
    }

  }
  return data;
};

export const ClipboardContext = React.createContext<IClipboardContext>({
  copy: {gs: 0, dx: 0, dy: 0, lastPaste: null, restoreFocus: false},
  textInput: document.createElement("textarea"),
  copyFunc: (graph, copy, textInput) => {
    if (graph.isEnabled() && !graph.isSelectionEmpty()) {
      copyCells(graph, mxUtils.sortCells(graph.model.getTopmostCells(graph.getSelectionCells())), copy, textInput);
      // tslint:disable-next-line: no-console
      console.log(textInput.value);
      copy.dx = 0;
      copy.dy = 0;
    }
  },
  copyFuncForMenu: (graph, copy, textInput) => {
    if (graph.isEnabled() && !graph.isSelectionEmpty()) {
      copyCells(graph, mxUtils.sortCells(graph.model.getTopmostCells(graph.getSelectionCells())), copy, textInput);
      // tslint:disable-next-line: no-console
      console.log(textInput.value);
      copy.dx = 0;
      copy.dy = 0;
    }
  },
  cutFunc: (graph, copy, textInput) => {
    if (graph.isEnabled() && !graph.isSelectionEmpty()) {
      copyCells(graph, graph.removeCells(), copy, textInput);
      copy.dx = -copy.gs;
      copy.dy = -copy.gs;
    }
  },
  pasteFunc: (evt, graph, copy, textInput, mouseX, mouseY) => {
    textInput.value = " ";
    if (graph.isEnabled()) {
      const xml = _extractGraphModelFromEvent(evt);
      // tslint:disable-next-line: no-console
      console.log(xml);
      if (xml !== null && xml.length > 0) {
        _pasteText(graph, xml, copy, mouseX, mouseY);
      }
      else {
        window.setTimeout(mxUtils.bind(window, () => {
          _pasteText(graph, textInput.value, copy, mouseX, mouseY);
        }), 0);
      }
    }
    textInput.select();
  },
  pasteFuncForMenu: (result, graph, copy, textInput, mouseX, mouseY) => {
    textInput.value = " ";
    if (graph.isEnabled()) {
      const xml = result;
      // tslint:disable-next-line: strict-type-predicates
      if (xml !== null && xml.length > 0) {
        _pasteText(graph, xml, copy, mouseX, mouseY);
      }
      else {
        window.setTimeout(mxUtils.bind(window, () => {
          _pasteText(graph, textInput.value, copy, mouseX, mouseY);
        }), 0);
      }
    }
    textInput.select();
  },
  beforeUsingClipboard: (graph, copy, textInput) => {
    if (!copy.restoreFocus) {
      textInput.style.position = "absolute";
      textInput.style.left = `${(graph.container.scrollLeft + 10)}px`;
      textInput.style.top = `${(graph.container.scrollTop + 10)}px`;
      graph.container.appendChild(textInput);

      copy.restoreFocus = true;
      textInput.focus();
      textInput.select();
    }
  },
  afterUsingClipboard: (graph, copy, textInput) => {
    if (copy.restoreFocus) {
      copy.restoreFocus = false;
      if (!graph.isEditing()) { graph.container.focus(); }
      if (textInput.parentNode) { textInput.parentNode.removeChild(textInput); }
    }
  },
});

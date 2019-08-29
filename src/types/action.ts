import { IClipboardContext, } from "../context/ClipboardContext";
import { IMxGraph, IMxUndoManager } from "./mxGraph";

export interface IMxAction {
  label?: string;
  shortcut?: string;
  func(): void;
}

export interface IMxActions {
  copy?: IMxAction;
  cut?: IMxAction;
  paste: {
    getFunc(destX?: number, destY?: number): () => void;
  };
  redo?: IMxAction;
  undo: IMxAction;
  zoomIn: IMxAction;
  zoomOut: IMxAction;
  deleteCell: IMxAction;
  fit: IMxAction;
  toFront: IMxAction;
  toBack: IMxAction;
}

export const actionType = [
  "copy",
  "cut",
  "paste",
  "redo",
  "undo",
  "zoomIn",
  "zoomOut",
  "deleteCell",
  "fit",
  "toFront",
  "toBack",
];

// tslint:disable-next-line: max-func-body-length
export function initAction(graph: IMxGraph, clipboard: IClipboardContext, undoManager: IMxUndoManager): IMxActions {
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
      getFunc(destX?: number, destY?: number): () => void {
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
        undoManager.undo();
      },
    },
    redo: {
      func: () => {
        undoManager.redo();
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
    toFront: {
      func: () => {
        graph.orderCells(false);
      },
    },
    toBack: {
      func: () => {
        graph.orderCells(true);
      },
    },

  };
}

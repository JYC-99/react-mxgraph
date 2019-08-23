import { IClipboardContext, } from "../context/ClipboardContext";
import { IMxGraph, IMxUndoManager } from "./mxGraph";

export interface IMxAction {
  label?: string;
  shortcuts?: string[];
  func(trigger?: object): void;
}

export interface IMxActions {
  copy: IMxAction;
  cut: IMxAction;
  pasteHere: IMxAction;
  paste: IMxAction;
  redo: IMxAction;
  undo: IMxAction;
  zoomIn: IMxAction;
  zoomOut: IMxAction;
  deleteCell: IMxAction;
  fit: IMxAction;
  toFront: IMxAction;
  toBack: IMxAction;
  actual: IMxAction;
}

export const actionType = [
  "copy",
  "cut",
  "pasteHere",
  "paste",
  "redo",
  "undo",
  "zoomIn",
  "zoomOut",
  "deleteCell",
  "fit",
  "toFront",
  "toBack",
  "actual",
];
// tslint:disable-next-line: max-func-body-length
export function initActions(graph: IMxGraph, clipboard: IClipboardContext, undoManager: IMxUndoManager): IMxActions {
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
      shortcuts: ["ctrl + c"]
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
      shortcuts: ["ctrl + x"]
    },
    pasteHere: {
      func: (trigger: {x: number; y: number}) => {
        navigator.clipboard.readText()
        .then(
          // tslint:disable-next-line: promise-function-async
          (result) => {
            // tslint:disable-next-line: no-console
            console.log("Successfully retrieved text from clipboard", result);
            clipboard.textInput.focus(); // no listener
            // tslint:disable-next-line: deprecation
            clipboard.pasteFuncForMenu(result, graph, clipboard.copy, clipboard.textInput, trigger.x, trigger.y);
            return Promise.resolve(result);
          }
        )
        .catch(
          (err) => {
            throw new Error("Error! read text from clipboard");
          });
      },
      shortcuts: ["ctrl + v"]
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
            clipboard.pasteFuncForMenu(result, graph, clipboard.copy, clipboard.textInput);
            return Promise.resolve(result);
          }
        )
        .catch(
          (err) => {
            throw new Error("Error! read text from clipboard");
          });
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
        console.log(graph.container.clientWidth, graph.container.clientHeight);
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
    actual: {
      func: () => {
        graph.actual();
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

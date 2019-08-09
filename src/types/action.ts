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
  undo?: IMxAction;
  zoomIn: IMxAction;
  zoomOut: IMxAction;
  deleteCell: IMxAction;
  fit: IMxAction;
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
];

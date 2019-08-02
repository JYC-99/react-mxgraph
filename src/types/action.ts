export interface IMxAction {
  label?: string;
  shortcut?: string;
  func(): void;
}

export interface IMxActions {
  copy?: IMxAction;
  cut?: IMxAction;
  paste?: IMxAction;
  redo?: IMxAction;
  undo?: IMxAction;
}

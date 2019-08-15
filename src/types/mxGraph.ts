// tslint:disable-next-line: no-empty-interface
export interface IEdge {

}

// tslint:disable-next-line: no-empty-interface
export interface IVertex {

}

// tslint:disable-next-line: no-empty-interface
export interface IParent {

}

export interface ImxCell {
  vertex: boolean;
  edge: boolean;
  source?: ImxCell;
  target?: ImxCell;
  parent?: ImxCell;
  geometry: IGeometry;
  mxObjectId: string;
  id: string;
  style: string;
  edges: ImxCell[];
  value: string;
}

export interface IMxMenu {
  triggerX: number;
  triggerY: number;
  // cspell: disable-next-line
  addItem(text: string, sth: null, func: (() => void) | null, submenu?: HTMLTableRowElement): HTMLTableRowElement ;
  addSeparator(): void;
}

// tslint:disable-next-line: no-empty-interface
export interface IMxUndoableEdit {

}
// tslint:disable-next-line: no-empty-interface
export interface IMxConnectionConstraint {

}

export interface IMxUndoManager {
  undo(): void;
  redo(): void;
  undoableEditHappened(edit: IMxUndoableEdit): void;
}

export interface IMxEventObject {
  name: string;
  properties: {
    edit: {
      source: IGraphModel;
      changes: [];
    };
  };
  getProperty(property: string): IMxUndoableEdit;
}

export interface IGraphModel {
  cells: ImxCell[];
  beginUpdate(): void;
  endUpdate(): void;
  getTopmostCells(cells: ImxCell[]): ImxCell[];
  getCell(id: string): ImxCell;
  getRoot(): ImxCell;
  getChildCount(root: ImxCell): number;
  getChildren(cell: ImxCell): ImxCell;
  getValue(cell: ImxCell): string | null;
  addListener(action: string, listener: (sender: IGraphModel, evt: IMxEventObject) => void): void;
  isVertex(cell: ImxCell): boolean;
  isEdge(cell: ImxCell): boolean;
  setValue(cell: ImxCell, value: string): void;
}

interface IGeometry {
  x: number;
  y: number;
  width: number;
  height: number;
  relative: boolean;
}

interface IView {
  scale: number;
  translate: {
    x: number;
    y: number;
  };
  getState(cell: ImxCell): IMxState | null;
  addListener(action: string, listener: (sender: IGraphModel, evt: IMxEventObject) => void): void;
}

export interface IMxState {
  x: number;
  y: number;
  view: IView;
}

interface IMxSelectionModel {
  cells: ImxCell[];
  graph: IMxGraph;
}

export interface IStylesheet {
  createDefaultVertexStyle(): IStylesheet;
  putCellStyle(customName: string, customStyle: IStylesheet): void;
  getCellStyle(name: string): IStylesheet;
}

export interface IMxGraph {
  popupMenuHandler: {
    autoExpand: boolean;
    factoryMethod(menu: IMxMenu, cell: ImxCell | null, evt: () => {}): void;
  };
  container: HTMLDivElement;
  view: IView;
  // cspell: disable-next-line
  autoscroll: boolean;
  isMouseDown: boolean;
  model: IGraphModel;
  gridSize: number;
  getModel(): IGraphModel;
  getView(): IView;
  getDefaultParent(): ImxCell;
  getCellGeometry(cell: ImxCell): IGeometry;
  getStylesheet(): IStylesheet;
  getSelectionCells(): ImxCell[];
  getSelectionCell(): ImxCell;
  getSelectionModel(): IMxSelectionModel;
  insertVertex(parent: ImxCell, id?: string | null, value?: string, x?: number, y?: number, width?: number, height?: number, style?: string, relative?: string): IVertex;
  insertEdge(parent: ImxCell, id?: string | null, value?: string, source?: IVertex, target?: IVertex): IEdge;
  importCells(cells: ImxCell[], x: number, y: number, target: ImxCell): ImxCell[] | null;
  scrollCellToVisible(cells: ImxCell[]): void;
  setSelectionCells(cells: ImxCell[]): void;
  setHtmlLabels(bl: boolean): void;
  isEnabled(): boolean;
  isEditing(): boolean;
  isSelectionEmpty(): boolean;
  isCellLocked(target: ImxCell): boolean;
  removeCells(cells?: ImxCell[]): ImxCell[];
  resizeCell(cell: ImxCell, bounds: {x: number; y: number; width: number; height: number}, recurse?: boolean): void;
  moveCells(cell: ImxCell, dx: number, dy: number): void;
  cloneCells(cells: ImxCell[]): ImxCell[];
  zoomIn(): void;
  zoomOut(): void;
}

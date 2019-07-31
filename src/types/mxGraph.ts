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
}

export interface IMenu {
  // cspell: disable-next-line
  addItem(text: string, sth: null, func: (() => void) | null, submenu?: HTMLTableRowElement): HTMLTableRowElement ;
  addSeparator(): void;
}

export interface IGraphModel {
  beginUpdate(): void;
  endUpdate(): void;
  getTopmostCells(cells: ImxCell[]): ImxCell[];
  getRoot(): any;
  getChildCount(root: any): number;
  getChildren(cell: ImxCell): ImxCell;
}

interface IGeometry {
  x: number;
  y: number;
  relative: boolean;
}

interface IView {
  scale: number;
  translate: {
    x: number;
    y: number;
  };
  getState(cell: ImxCell): IMxState | null;
}

export interface IMxState {
  x: number;
  y: number;
  view: IView;
}

export interface IMxGraph {
  popupMenuHandler: {
    autoExpand: boolean;
    factoryMethod(menu: IMenu, cell: ImxCell | null, evt: () => {}): void;
  };
  container: HTMLDivElement;
  view: IView;
  // cspell: disable-next-line
  autoscroll: boolean;
  isMouseDown: boolean;
  model: IGraphModel;
  gridSize: number;
  getModel(): IGraphModel;
  getDefaultParent(): IParent;
  getCellGeometry(cell: ImxCell): IGeometry;
  getSelectionCells(): ImxCell[];
  insertVertex(parent: IParent, id?: string | null, value?: string, x?: number, y?: number, width?: number, height?: number, style?: string, relative?: string): IVertex;
  insertEdge(parent: IParent, id?: string | null, value?: string, source?: IVertex, target?: IVertex): IEdge;
  importCells(cells: ImxCell[], x: number, y: number, target: ImxCell): ImxCell[] | null;
  scrollCellToVisible(cell: ImxCell): void;
  setSelectionCells(cells: ImxCell[]): void;
  isEnabled(): boolean;
  isEditing(): boolean;
  isSelectionEmpty(): boolean;
  isCellLocked(target: any): boolean;
  removeCells(): ImxCell[];
  moveCells(cell: ImxCell, dx: number, dy: number): void;
}

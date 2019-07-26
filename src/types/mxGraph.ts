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
}

export interface IMxGraph {
  popupMenuHandler: {
    autoExpand: boolean;
    factoryMethod(menu: IMenu, cell: ImxCell | null, evt: () => {}): void;
  };
  container: HTMLDivElement;
  // cspell: disable-next-line
  autoscroll: boolean;
  getModel(): IGraphModel;
  getDefaultParent(): IParent;
  insertVertex(parent: IParent, id?: string | null, value?: string, x?: number, y?: number, width?: number, height?: number, style?: string, relative?: string): IVertex;
  insertEdge(parent: IParent, id?: string | null, value?: string, source?: IVertex, target?: IVertex): IEdge;
  importCells(cells: ImxCell[], x: number, y: number, target: ImxCell): ImxCell[] | null;
  scrollCellToVisible(cell: ImxCell): void;
  setSelectionCells(cells: ImxCell[]): void;
}

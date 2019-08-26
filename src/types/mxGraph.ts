import {
  IConfig,
  IMxPoint,
  IMxRectangle,
  IMxShape,
  IMxText,
} from "./shapes";
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
  children: ImxCell[];
  absolutePoints: IMxPoint[];
  setConnectable(isConnectable: boolean): void;
  getStyle(): string;
  getChildCount(): number;
  setStyle(style: string): void;
  removeFromTerminal(isSource: boolean): void; // removes the edge from its source or target terminal
  getTerminal(isSource: boolean): ImxCell; // for edges
  setAbsoluteTerminalPoint(point: IMxPoint, isSource: boolean): void;
}

export interface IMxMenu {
  triggerX: number;
  triggerY: number;
  // cspell: disable-next-line
  addItem(text: string, sth: null, func: (() => void) | null, submenu?: HTMLTableRowElement): HTMLTableRowElement;
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
  getTerminal(edge: ImxCell, isSource: boolean): ImxCell; // returns the source or target mxCell of the given edge depending on the value of the boolean parameter
  setTerminal(edge: ImxCell, terminal: ImxCell, isSourse: boolean): void; // to current transaction
  setTerminals(edge: ImxCell, source: ImxCell, target: ImxCell): void; // in a single transaction
  setVisible(cell: ImxCell, visible: boolean): void; // to current transaction
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
  offset?: number; // for edges.
  sourcePoint: IMxPoint; // the source mxPoint of the edge
  targetPoint: IMxPoint; // the target mxPoint of the edge
  points?: IMxPoint[]; // array of mxPoints which specifies the control points along the edge
  getTerminalPoint(isSource: boolean): IMxPoint;
  setTerminalPoint(point: IMxPoint, isSource: boolean): void;
}

interface IGraphView {
  scale: number;
  translate: {
    x: number;
    y: number;
  };
  getState(cell: ImxCell): IMxState | null;
  getTerminalPort(state: IMxState, terminal: ImxCell, isSource: boolean): IMxState;
  addListener(action: string, listener: (sender: IGraphModel, evt: IMxEventObject) => void): void;
  updateFixedTerminalPoint(edge: ImxCell, terminal: ImxCell, isSource: boolean, constraint?: IMxPoint[]): void;
  getPerimeterFunction(terminal: ImxCell): () => void;
  getRoutingCenterX(terminal: ImxCell): number;
  getRoutingCenterY(terminal: ImxCell): number;
}

export interface IMxState {
  x: number;
  y: number;
  view: IGraphView;
  shape: IMxShape; // all kinds of shapes including custom shape
  terminalDistance: number; // for edges
  segments: number[];
  style: ICellStyle;
  cell: ImxCell;
  cellBounds: IMxRectangle;
  text: IMxText;
  getVisibleTerminal(isSource: boolean): ImxCell;
  getVisibleTerminalState(isSource: boolean): IMxState;
  setVisibleTerminalState(terminalState: IMxState, isSource: boolean): void;
}

interface IMxSelectionModel {
  cells: ImxCell[];
  graph: IMxGraph;
  setCell(cell: ImxCell): void;
  setCells(cells: ImxCell[]): void;
  addCell(cell: ImxCell): void;
  addCells(cells: ImxCell[]): void;
  removeCell(cell: ImxCell): void;
  removeCells(cells: ImxCell[]): void;
  selectRegion(rect: IMxRectangle, evt: any): void;
}

export interface IStylesheet {
  createDefaultVertexStyle(): IStylesheet;
  putCellStyle(customName: string, customStyle: IStylesheet): void;
  /*
   * name - String of the form [(stylename|key=value);] that represents the style.
   * defaultStyle - Default style to be returned if no style can be found.
   */
  getCellStyle(name: string, defaultStyle?: IStylesheet): IStylesheet;
}

interface ICellStyle extends IConfig {
  shape: string;
  perimeter: string;
  points: Array<[number, number]>;
}

// tslint:disable-next-line: no-empty-interface
interface IMxToolTip {

}

// tslint:disable-next-line: no-empty-interface
interface IMxImage {

}

export interface IMxMouseEvent {
  graphX: number;
  graphY: number;
  state: IMxState;
  getGraphX(): number;
  getGraphY(): number;
  getCell(): ImxCell;
  getEvent(): PointerEvent;
  getState(): IMxState;
}

export interface IKeyHandler {
  bindKey(keycode: number, func: () => void): void;
  bindShiftKey(keycode: number, func: () => void): void;
  bindControlKey(keycode: number, func: () => void): void;
  bindControlShiftKey(keycode: number, func: () => void): void;
}

export interface IMxGraph {
  popupMenuHandler: {
    autoExpand: boolean;
    factoryMethod(menu: IMxMenu, cell: ImxCell | null, evt: () => {}): void;
  };
  container: HTMLDivElement;
  connectionHandler: {
    connectImage: IMxImage;
    graph: IMxGraph;
    isConnectableCell(cell: ImxCell): boolean;
    createEdgeState(me: IMxMouseEvent): IMxState;
  };
  view: IGraphView;
  // cspell: disable-next-line
  autoscroll: boolean;
  isMouseDown: boolean;
  model: IGraphModel;
  gridSize: number;
  disconnectOnMove: boolean;
  foldingEnabled: boolean;
  cellsResizable: boolean;
  extendParents: boolean;
  defaultEdgeStyle: object;
  currentEdgeStyle: object;
  keyHandler: IKeyHandler;
  addMouseListener(listener: {
    currentState: null | IMxState;
    mouseDown(sender: IMxGraph, me: IMxMouseEvent): void;
    mouseMove(sender: IMxGraph, me: IMxMouseEvent): void;
    mouseUp(sender: IMxGraph, me: IMxMouseEvent): void;
  }): void;
  createCurrentEdgeStyle(): string;
  convertValueToString(terminal: ImxCell): string;
  createEdge(parent: ImxCell | null, id: string | null, label: HTMLElement | null, source: ImxCell | null, target: ImxCell | null, style?: string): ImxCell;
  getModel(): IGraphModel;
  getView(): IGraphView;
  getDefaultParent(): ImxCell;
  getCellGeometry(cell: ImxCell): IGeometry;
  getCellStyle(cell: ImxCell): ICellStyle;
  getLabel(cell: ImxCell): string;
  getStylesheet(): IStylesheet;
  getSelectionCells(): ImxCell[];
  getSelectionCell(): ImxCell;
  getSelectionModel(): IMxSelectionModel;
  getTooltipForCell(cell: ImxCell): IMxToolTip;
  getGraphBounds(): void;
  insertVertex(parent: ImxCell, id?: string | null, value?: string, x?: number, y?: number, width?: number, height?: number, style?: string, isRelative?: boolean): ImxCell;
  insertEdge(parent: ImxCell, id?: string | null, value?: string, source?: ImxCell, target?: ImxCell): ImxCell;
  importCells(cells: ImxCell[], x: number, y: number, target: ImxCell): ImxCell[] | null;
  scrollCellToVisible(cells: ImxCell[]): void;
  setSelectionCells(cells: ImxCell[]): void;
  setSelectionCell(cells: ImxCell[]): void;
  setTooltips(bl: boolean): void;
  setCellsResizable(bl: boolean): void;
  setConnectable(bl: boolean): void;
  setAllowDanglingEdges(bl: boolean): void;
  setDisconnectOnMove(bl: boolean): void;
  selectCell(isNext: boolean, isParent?: boolean, isChild?: boolean): void; //
  selectAll(parent: ImxCell, descendants: ImxCell[]): void; // select all children of the given parent cell
  selectCells(vertices: ImxCell[], edges: ImxCell[], parent: ImxCell): void;
  selectPreviousCell(): void;
  selectParentCell(): void;
  selectChildCell(): void;
  setHtmlLabels(bl: boolean): void;
  setEnabled(bl: boolean): void;
  stopEditing(bl: boolean): void;
  isEnabled(): boolean;
  isEditing(): boolean;
  isSelectionEmpty(): boolean;
  isCellLocked(target: ImxCell): boolean;
  isCellFoldable(cell: ImxCell): boolean;
  isCellCollapsed(cell: ImxCell): boolean;
  removeCells(cells?: ImxCell[]): ImxCell[];
  resizeCell(cell: ImxCell, bounds: { x: number; y: number; width: number; height: number }, recurse?: boolean): void;
  moveCells(cell: ImxCell, dx: number, dy: number): void;
  cloneCells(cells: ImxCell[]): ImxCell[];
  // drill down
  isPort(cell: ImxCell): boolean;
  getTerminalForPort(portCell: ImxCell, isSource: boolean): ImxCell;
  zoomIn(): void;
  zoomOut(): void;
  fit(): void;
  zoomActual(): void;
  orderCells(isToBack: boolean): void;
}

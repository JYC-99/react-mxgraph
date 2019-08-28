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

export interface IBasicCell {
  vertex: boolean;
  edge: boolean;
  parent?: IMxCell;
  geometry: IGeometry;
  mxObjectId: string;
  id: string;
  style: string;
  value: string;
  children: IMxCell[];
  absolutePoints: IMxPoint[];
  setConnectable(isConnectable: boolean): void;
  getStyle(): string;
  getChildCount(): number;
  setStyle(style: string): void;
}

export interface IEdge extends IBasicCell{
  source: IMxCell;
  target: IMxCell;
  removeFromTerminal(isSource: boolean): void; // removes the edge from its source or target terminal
  getTerminal(isSource: boolean): IMxCell;
  setAbsoluteTerminalPoint(point: IMxPoint, isSource: boolean): void;
}

export interface INode extends IBasicCell {
  edges: IEdge[];
}

export type IMxCell = IEdge | INode;

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
  cells: IMxCell[];
  beginUpdate(): void;
  endUpdate(): void;
  getTopmostCells(cells: IMxCell[]): IMxCell[];
  getCell(id: string): IMxCell;
  getRoot(): IMxCell;
  getChildCount(root: IMxCell): number;
  getChildren(cell: IMxCell): IMxCell;
  getChildAt(cell: IMxCell, index: number): IMxCell;
  getValue(cell: IMxCell): string | null;
  getGeometry(cell: IMxCell): IGeometry;
  getTerminal(edge: IMxCell, isSource: boolean): IMxCell; // returns the source or target mxCell of the given edge depending on the value of the boolean parameter
  setTerminal(edge: IMxCell, terminal: IMxCell, isSourse: boolean): void; // to current transaction
  setTerminals(edge: IMxCell, source: IMxCell, target: IMxCell): void; // in a single transaction
  setVisible(cell: IMxCell, visible: boolean): void; // to current transaction
  addListener(action: string, listener: (_sender: IGraphModel, evt: IMxEventObject) => void): void;
  isVertex(cell: IMxCell): boolean;
  isEdge(cell: IMxCell): boolean;
  setValue(cell: IMxCell, value: string): void;
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
  graph: IMxGraph;
  translate: {
    x: number;
    y: number;
  };
  getState(cell: IMxCell): IMxState | null;
  getTerminalPort(state: IMxState, terminal: IMxCell, isSource: boolean): IMxState;
  addListener(action: string, listener: (sender: IGraphModel, evt: IMxEventObject) => void): void;
  updateFixedTerminalPoint(edge: IEdge, terminal: INode, isSource: boolean, constraint?: IMxPoint[]): void;
  getPerimeterFunction(terminal: IMxCell): () => void;
  getRoutingCenterX(terminal: IMxCell): number;
  getRoutingCenterY(terminal: IMxCell): number;
}

export interface IMxState {
  x: number;
  y: number;
  view: IGraphView;
  shape: IMxShape; // all kinds of shapes including custom shape
  terminalDistance: number; // for edges
  segments: number[];
  style: ICellStyle;
  cell: IMxCell;
  cellBounds: IMxRectangle;
  text: IMxText;
  getVisibleTerminal(isSource: boolean): IMxCell;
  getVisibleTerminalState(isSource: boolean): IMxState;
  setVisibleTerminalState(terminalState: IMxState, isSource: boolean): void;
}

interface IMxSelectionModel {
  cells: IMxCell[];
  graph: IMxGraph;
  setCell(cell: IMxCell): void;
  setCells(cells: IMxCell[]): void;
  addCell(cell: IMxCell): void;
  addCells(cells: IMxCell[]): void;
  removeCell(cell: IMxCell): void;
  removeCells(cells: IMxCell[]): void;
  selectRegion(rect: IMxRectangle, evt: IMxEventObject): void;
  addListener(name: string, func: (sender: IMxSelectionModel, event: IMxEventObject) => void): void;
}

export interface IStyle extends IConfig {
  edgeStyle: string;
  fontStyle: string;
}

export interface IStylesheet{

  createDefaultVertexStyle(): IStylesheet;
  putCellStyle(customName: string, customStyle: IStylesheet): void;
  /*
   * name - String of the form [(stylename|key=value);] that represents the style.
   * defaultStyle - Default style to be returned if no style can be found.
   */
  getCellStyle(name: string, defaultStyle?: IStylesheet): IStylesheet;
  getDefaultEdgeStyle(): IStyle;
  getDefaultVertexStyle(): IStyle;
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
  getCell(): IMxCell;
  getEvent(): PointerEvent;
  getState(): IMxState;
}

export interface IKeyHandler {
  bindKey(keycode: number, func: () => void): void;
  bindShiftKey(keycode: number, func: () => void): void;
  bindControlKey(keycode: number, func: () => void): void;
  bindControlShiftKey(keycode: number, func: () => void): void;
}

// tslint:disable-next-line: no-empty-interface
export interface IMxRubberband{

}
// tslint:disable-next-line: no-empty-interface
export interface IMxConstraintHandler{
  isStateIgnored(state: IMxState, isSource: boolean): boolean;
}

export interface IMxGraph {
  popupMenuHandler: {
    autoExpand: boolean;
    factoryMethod(menu: IMxMenu, cell: IMxCell | null, evt: () => {}): void;
  };
  container: HTMLDivElement;
  connectionHandler: {
    connectImage: IMxImage;
    graph: IMxGraph;
    constraintHandler: IMxConstraintHandler;
    isConnectableCell(cell: IMxCell): boolean;
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
  panDx: number;
  panDy: number;
  autoScroll: number;
  autoExtend: boolean;
  addMouseListener(listener: {
    currentState: null | IMxState;
    mouseDown(sender: IMxGraph, me: IMxMouseEvent): void;
    mouseMove(sender: IMxGraph, me: IMxMouseEvent): void;
    mouseUp(sender: IMxGraph, me: IMxMouseEvent): void;
  }): void;
  createCurrentEdgeStyle(): string;
  convertValueToString(terminal: IMxCell): string;
  createEdge(parent: IMxCell | null, id: string | null, label: HTMLElement | null, source: IMxCell | null, target: IMxCell | null, style?: string): IMxCell;
  getModel(): IGraphModel;
  getView(): IGraphView;
  getDefaultParent(): IMxCell;
  getCellGeometry(cell: IMxCell): IGeometry;
  getCellStyle(cell: IMxCell): ICellStyle;
  getLabel(cell: IMxCell): string;
  getStylesheet(): IStylesheet;
  getSelectionCells(): IMxCell[];
  getSelectionCell(): IMxCell;
  getSelectionModel(): IMxSelectionModel;
  getTooltipForCell(cell: IMxCell): IMxToolTip;
  getGraphBounds(): void;
  insertVertex(parent: IMxCell, id?: string | null, value?: string, x?: number, y?: number, width?: number, height?: number, style?: string, isRelative?: boolean): IMxCell;
  insertEdge(parent: IMxCell, id?: string | null, value?: string, source?: IMxCell, target?: IMxCell): IMxCell;
  importCells(cells: IMxCell[], x: number, y: number, target: IMxCell): IMxCell[];
  scrollCellToVisible(cells: IMxCell[]): void;
  setSelectionCells(cells: IMxCell[]): void;
  setSelectionCell(cells: IMxCell[]): void;
  setTooltips(bl: boolean): void;
  setCellsResizable(bl: boolean): void;
  setCellStyles(name: string, style: string, cell: IMxCell[]): void;
  setConnectable(bl: boolean): void;
  setAllowDanglingEdges(bl: boolean): void;
  setDisconnectOnMove(bl: boolean): void;
  selectCell(isNext: boolean, isParent?: boolean, isChild?: boolean): void; //
  selectAll(parent: IMxCell, descendants: IMxCell[]): void; // select all children of the given parent cell
  selectCells(vertices: IMxCell[], edges: IMxCell[], parent: IMxCell): void;
  selectPreviousCell(): void;
  selectParentCell(): void;
  selectChildCell(): void;
  setHtmlLabels(bl: boolean): void;
  setEnabled(bl: boolean): void;
  stopEditing(bl: boolean): void;
  snap(value: number): number;
  isEnabled(): boolean;
  isEditing(): boolean;
  isSelectionEmpty(): boolean;
  isCellLocked(target: IMxCell): boolean;
  isCellFoldable(cell: IMxCell): boolean;
  isCellCollapsed(cell: IMxCell): boolean;
  isCellSelected(cell: IMxCell): boolean;
  isCellMovable(cell: IMxCell): boolean;
  isCellsMovable(): boolean;
  removeCells(cells?: IMxCell[]): IMxCell[];
  isDropEnabled(): boolean;
  isGridEnabledEvent(evt: MouseEvent): boolean;
  resizeCell(cell: IMxCell, bounds: { x: number; y: number; width: number; height: number }, recurse?: boolean): void;
  moveCells(cell: IMxCell, dx: number, dy: number): void;
  cloneCells(cells: IMxCell[]): IMxCell[];
  // drill down
  isPort(cell: IMxCell): boolean;
  getTerminalForPort(portCell: IMxCell, isSource: boolean): IMxCell;
  zoomIn(): void;
  zoomOut(): void;
  fit(): void;
  zoomActual(): void;
  orderCells(isToBack: boolean): void;
  scrollPointToVisible(x: number, y: number, isAutoExtend: boolean): void;
}

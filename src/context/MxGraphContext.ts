import * as React from "react";
<<<<<<< HEAD
import { IMxGraph } from "../types/mxGraph";

export interface IMxGraphContext {
  graph?: IMxGraph;
  setGraph(graph: IMxGraph): void;
=======

// tslint:disable-next-line: no-empty-interface
interface IEdge {

}

// tslint:disable-next-line: no-empty-interface
export interface IVertex {

}

// tslint:disable-next-line: no-empty-interface
interface IParent {

}

export interface ImxCell {
  vertex: boolean;
  edge: boolean;
  geometry: {
    x: number;
    y: number;
  };
}

interface IMenu {
  // cspell: disable-next-line
  addItem(text: string, sth: null, func: (() => void) | null, submenu?: HTMLTableRowElement): HTMLTableRowElement ;
  addSeparator(): void;
}

interface IGraphModel {
  beginUpdate(): void;
  endUpdate(): void;
  cloneCell(vertex: IVertex): ImxCell;
}

export interface IMxGraph {
  popupMenuHandler: {
    autoExpand: boolean;
    factoryMethod(menu: IMenu, cell: ImxCell | null, evt: () => {}): void;
  };
  graphHandler: {
    guidesEnabled: boolean;
  };
  container: HTMLDivElement;
  // cspell: disable-next-line
  autoscroll: boolean;
  getModel(): IGraphModel;
  getDefaultParent(): IParent;
  getPointForEvent(evt: PointerEvent): {x: number; y: number};
  insertVertex(parent: IParent, id?: string | null, value?: string, x?: number, y?: number, width?: number, height?: number, style?: string, relative?: string): IVertex;
  insertEdge(parent: IParent, id?: string | null, value?: string, source?: IVertex, target?: IVertex): IEdge;
  // tslint:disable-next-line: no-any
  importCells(cells: ImxCell[], x: number, y: number, target: any): ImxCell[] | null;
  scrollCellToVisible(cell: ImxCell): void;
  setSelectionCells(cells: ImxCell[]): void;
  stopEditing(bl: boolean): void;
}

export interface IMxGraphContext {
  // container: HTMLDivElement | null;
  graph: IMxGraph | undefined;
>>>>>>> add item panel
}

export const MxGraphContext = React.createContext<IMxGraphContext>({
  graph: undefined,
  // tslint:disable-next-line: no-empty
  setGraph: () => {},
});

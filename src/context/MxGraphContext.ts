import * as React from "react";

// tslint:disable-next-line: no-empty-interface
interface IEdge {

}

// tslint:disable-next-line: no-empty-interface
interface IVertex {

}

// tslint:disable-next-line: no-empty-interface
interface IParent {

}

interface ImxCell {
  vertex: boolean;
  edge: boolean;
}

interface IMenu {
  // cspell: disable-next-line
  addItem(text: string, sth: null, func: (() => void) | null, submenu?: HTMLTableRowElement): HTMLTableRowElement ;
  addSeparator(): void;
}

interface IGraphModel {
  beginUpdate(): void;
  endUpdate(): void;
}

export interface IMxGraphContext {
  // container: HTMLDivElement | null;
  graph: {
    popupMenuHandler: {
      autoExpand: boolean;
      factoryMethod(menu: IMenu, cell: ImxCell | null, evt: () => {}): void;
    };
    container: HTMLDivElement;
    getModel(): IGraphModel;
    getDefaultParent(): IParent;
    insertVertex(parent: IParent, id?: string | null, value?: string, x?: number, y?: number, width?: number, height?: number, style?: string, relative?: string): IVertex;
    insertEdge(parent: IParent, id?: string | null, value?: string, source?: IVertex, target?: IVertex): IEdge;
  } | undefined;
}

export const MxGraphContext = React.createContext<IMxGraphContext>({
  graph: undefined,
  // container: null,
});

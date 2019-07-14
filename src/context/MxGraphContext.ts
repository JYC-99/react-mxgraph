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

interface IGraphModel {
  beginUpdate(): void;
  endUpdate(): void;
}

interface IMxGraphContext {
  graph?: {
    getModel(): IGraphModel;
    getDefaultParent(): IParent;
    insertVertex(parent: IParent, id?: string | null, value?: string, x?: number, y?: number, width?: number, height?: number, style?: string, relative?: string): IVertex;
    insertEdge(parent: IParent, id?: string | null, value?: string, source?: IVertex, target?: IVertex): IEdge;
  };
}

export const MxGraphContext = React.createContext<IMxGraphContext>({
  graph: undefined,
});

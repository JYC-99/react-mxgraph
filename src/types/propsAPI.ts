import {
  IMxCell,
  IMxGraph,
} from "./mxGraph";

import { ICanvasData } from "./flow";

// export interface IModel {
//   size?: [number, number];
//   label?: string;
//   color?: string;
//   source?: string; // cell id
//   target?: string; // cell id
//   id?: string;
//   shape?: string;
//   edge?: boolean;
// }

export interface IBasicModel {
  size: [number, number];
  label?: string;
  color?: string;
  id: string;
  shape: string;
  edge: boolean;
}

export interface INodeModel extends IBasicModel{
  x: number;
  y: number;
  id: string;
}

export interface IEdgeModel extends IBasicModel {
  source: string; // cell id
  target: string; // cell id
  id: string;
}

export type ICellModel = INodeModel | IEdgeModel;

// export type NonNullable<T> = T extends null | undefined ? never : T;

// export type NonNullablePropertyKeys<T> = {
//   [P in keyof T]: null extends T[P] ? never : P
// }[keyof T]

export type IModelEditor = Partial<INodeModel & IEdgeModel>;

export function isEdgeModel(cell: ICellModel): cell is IEdgeModel {
  return (cell as IEdgeModel).edge;
}

export interface IPropsAPI {
  graph: IMxGraph;
  executeCommand(command: string): void;
  find(id: string): IMxCell;
  getSelected(): IMxCell[];
  read(data: ICanvasData): void;
  save(): object;
  getCellModel(cell: IMxCell): ICellModel;
  add(model: ICellModel): void;
  update(cell: IMxCell, model: IModelEditor): void;
  remove(cell: IMxCell): void;
}

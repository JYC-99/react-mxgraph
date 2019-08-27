import {
  ImxCell,
  IMxGraph,
} from "./mxGraph";

import { ICanvasData } from "./flow";

export interface IModel {
  x: number;
  y: number;
  size: [number, number];
  label: string;
  color: string;
  source: string; // cell id
  target: string; // cell id
  id: string;
  shape: string;
  edge: boolean;
}

export interface IPropsAPI {
  graph: IMxGraph;
  executeCommand(command: string): void;
  find(id: string): ImxCell;
  getSelected(): ImxCell[];
  read(data: ICanvasData): void;
  save(): object;
  getCellModel(cell: ImxCell): IModel;
  add(name: "node" | "edge", model: IModel): void;
  update(cell: ImxCell, model: IModel): void;
  remove(cell: ImxCell): void;
}

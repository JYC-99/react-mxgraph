import * as React from "react";
import { ImxCell } from "../types/mxGraph";

export interface IPanelContext {
  cells?: ImxCell[];
  name: string;
}

export const PanelContext = React.createContext<IPanelContext>({
  cells: [],
  name: "",
});

export interface ISpecialPanelContext {
  enabled: boolean;
  cells: ImxCell[];
}

export const SpecialPanelContext = React.createContext<ISpecialPanelContext>({
  enabled: false,
  cells: [],
});

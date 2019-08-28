import * as React from "react";
import { IMxCell } from "../types/mxGraph";

export interface IPanelContext {
  cells?: IMxCell[];
  name: string;
}

export const PanelContext = React.createContext<IPanelContext>({
  cells: [],
  name: "",
});

export interface ISpecialPanelContext {
  enabled: boolean;
  cells: IMxCell[];
}

export const SpecialPanelContext = React.createContext<ISpecialPanelContext>({
  enabled: false,
  cells: [],
});

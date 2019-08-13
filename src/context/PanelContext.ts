import * as React from "react";
import { ImxCell } from "../types/mxGraph";

export interface IPanelContext {
  cells: ImxCell[];
  name: string;
}

export const PanelContext = React.createContext<IPanelContext>({
  cells: [],
  name: "",
});

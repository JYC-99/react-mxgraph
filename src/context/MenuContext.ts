
import * as React from "react";
import { IMenu } from "../types/menu";

export interface IMenuContext {
  setMenu(name: string, menu: IMenu[]): void;
}

export const MenuContext = React.createContext<IMenuContext>({
  // tslint:disable-next-line: no-empty
  setMenu: () => {},
});

export interface IMenuItemContext {
  addItem(name: string, text: string): void;
}

export const MenuItemContext = React.createContext<IMenuItemContext>({
  // tslint:disable-next-line: no-empty
  addItem: () => {},
});

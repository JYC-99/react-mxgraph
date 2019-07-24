
import * as React from "react";

export interface IMenuArg {
  menuItemType: string;
  text?: string;
  sth?: null;
  id?: number;
  parent?: number;
  // cspell: disable-next-line
  submenu?: HTMLTableRowElement;
  func?(): void | null;
}

export interface IMenuContext {
  addMenuItem(name: string, item: IMenuArg[]): void;
}

export const MenuContext = React.createContext<IMenuContext>({
  // tslint:disable-next-line: no-empty
  addMenuItem: () => {},
});

export interface IMenuItemContext {
  addItem(item: IMenuArg): void;
}

export const MenuItemContext = React.createContext<IMenuItemContext>({
  // tslint:disable-next-line: no-empty
  addItem: () => {},
});

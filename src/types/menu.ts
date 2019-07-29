export interface IMenu {
  menuItemType: string;
  text?: string;
  sth?: null;
  id?: number;
  parent?: number;
  // cspell: disable-next-line
  submenu?: HTMLTableRowElement;
  func?(): void | null;
}

export interface IMenus {
  vertex: IMenu[];
  edge: IMenu[];
  canvas: IMenu[];
}

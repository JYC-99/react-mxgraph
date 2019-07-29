import * as React from "react";

import {
  IMenuContext,
  MenuContext,
} from "../context/MenuContext";

import {
  IMenu,
} from "../types/menu";

import {
  createMenu,
} from "./CreateMenu";

export class Menu extends React.PureComponent<{name: string}> {
  public menu: IMenu[];
  constructor(props: {name: string}) {
    super(props);
    this.menu = [
      {
        menuItemType: "item",
        text: `this is a sub menu for ${props.name}` ,
        // tslint:disable-next-line: ban
        func(): void { alert("item 1"); },
      },
      {
        menuItemType: "separator",
      },
    ];
  }

  public render(): React.ReactNode {
    return (
      <MenuContext.Consumer>{(context: IMenuContext) => {
        const { setMenu } = context;
        setMenu(this.props.name, this.menu);
        return null;
      }}
      </MenuContext.Consumer>
    );
  }
}

export const VertexMenu = createMenu(Menu, "vertex");
export const EdgeMenu = createMenu(Menu, "edge");
export const CanvasMenu = createMenu(Menu, "canvas");

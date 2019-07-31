import * as React from "react";

import {
  IMenuContext,
  MenuContext,
  MenuItemContext,
} from "../context/MenuContext";

import {
  createMenu,
} from "./CreateMenu";

export class Menu extends React.PureComponent<{name: string}> {
  public menu: Array<{
    menuItemType: string;
    text?: string;
  }>;
  constructor(props: {name: string}) {
    super(props);
    this.menu = [];
  }

  public render(): React.ReactNode {

    console.log("render");
    return (
      <MenuItemContext.Provider value={{addItem: this.addItem}}>
        {this.props.children}
        <MenuContext.Consumer>{(context: IMenuContext) => {
          const { setMenu } = context;
          setMenu(this.props.name, this.menu);
          return null;
        }}
        </MenuContext.Consumer>
      </MenuItemContext.Provider>
    );
  }

  private readonly addItem = (name: string, text: string): void => {
    console.log(text);
    this.menu = this.menu.concat({menuItemType: name, text });
    console.log(this.menu);
  }
}

export const VertexMenu = createMenu(Menu, "vertex");
export const EdgeMenu = createMenu(Menu, "edge");
export const CanvasMenu = createMenu(Menu, "canvas");

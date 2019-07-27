import * as React from "react";

import {
  IMenuArg,
  MenuContext,
  IMenuContext,
} from "../context/MenuContext";

import {
  createMenu,
} from "./CreateMenu"

export class Menu extends React.PureComponent {
  constructor(props:{}) {
    super(props);
    this.item = [
      {
        menuItemType: "item",
        text: "this is a sub menu for "+props.name ,
        func(): void { alert("item 1"); },
      },
      {
        menuItemType: "separator",
      },
    ];
    console.log("props", props, props.name, this.item[0].text);
  }

  public render() {
    return (
      <MenuContext.Consumer>{(context: IMenuContext)=> {
        const { setItem } = context;
        setItem(this.props.name, this.item);
      }}
      </MenuContext.Consumer>
    );
  }
}

export const VertexMenu = createMenu(Menu, "vertex");
export const EdgeMenu = createMenu(Menu, "edge");
export const CanvasMenu = createMenu(Menu, "canvas");

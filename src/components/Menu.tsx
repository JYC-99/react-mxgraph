import * as React from "react";

import {
  IMenuContext,
  MenuContext,
  MenuItemContext,
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
        text: `this is a sub menu for ${props.name} to copy` ,
        // tslint:disable-next-line: ban
        func(): void {
          console.log("item exec copy");
          const str = document.execCommand("copy");
          console.log(str);
        },
      },
      {
        menuItemType: "separator",
      },
      {
        menuItemType: "paste",
        text: `this is a sub menu for ${props.name} to paste` ,
        // tslint:disable-next-line: ban
        func(): void {
          navigator.clipboard.readText().then(
            result => {
              console.log("Successfully retrieved text from clipboard", result)
              return Promise.resolve(result);
            }
          )
          .catch(
            err => {
              console.log("Error! read text from clipbaord", err)
          });
        },
      },
    ];
  }

  public render(): React.ReactNode {

    console.log("render");
    return (
      <MenuItemContext.Provider value={{addItem: this.addItem}}>
        <MenuContext.Consumer>{(context: IMenuContext) => {
          const { setMenu } = context;
          setMenu(this.props.name, this.menu);
          return null;
        }}
        </MenuContext.Consumer>
      </MenuItemContext.Provider>
    );
  }

  private readonly addItem = (text: string, func: () => void): void => {
    this.menu.concat({menuItemType: "item", text, func});
  }
}

export const VertexMenu = createMenu(Menu, "vertex");
export const EdgeMenu = createMenu(Menu, "edge");
export const CanvasMenu = createMenu(Menu, "canvas");

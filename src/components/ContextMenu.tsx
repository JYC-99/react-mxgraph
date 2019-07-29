// @ts-ignore
import * as mxGraphJs from "mxgraph-js";
import * as React from "react";

const {
  mxEvent,
} = mxGraphJs;

import {
  IMxGraphContext,
  MxGraphContext,
} from "../context/MxGraphContext";

import {
  MenuContext,
} from "../context/MenuContext";

import {
  IMenu,
  IMenus,
} from "../types/menu";

export class ContextMenu extends React.PureComponent {
  public menus: IMenus;

  constructor(props: {}) {
    super(props);
    this.menus =  {
      vertex: [],
      edge: [],
      canvas: []
    };
  }

  public render(): React.ReactNode {
    return (
      <MenuContext.Provider value={{setMenu: this.setMenu}}>
        {this.props.children}
        <MxGraphContext.Consumer>{(value: IMxGraphContext) => {
          const {
            graph,
          } = value;

          mxEvent.disableContextMenu(document.body);

          if (graph) {
            graph.popupMenuHandler.autoExpand = true;
            graph.popupMenuHandler.factoryMethod = (menu, cell, _evt) => {
              let name = "item";
              if (cell === null) {
                name = "canvas";
              }
              else if (cell.vertex) {
                name = "vertex";
              }
              else if (cell.edge) {
                name = "edge";
              }
              const currentMenu: IMenu[] = this.menus[name];
              if (currentMenu.length !== 0) {
                currentMenu.map((item) => {
                  const text = item.text ? item.text : "default";
                  // tslint:disable-next-line: prefer-switch
                  if (item.menuItemType === "item") {
                    // tslint:disable-next-line: no-unbound-method no-empty
                    const func = item.func ? item.func : () => {}; // not this
                    menu.addItem(text, null, func);
                  } else if (item.menuItemType === "separator") {
                    menu.addSeparator();
                  } else {
                    throw new Error("Unknown menu item type");
                  }
                });
              } else {
                throw new Error("Init menu failed");
              }
            };
          }
          return null;
        }}
        </MxGraphContext.Consumer>
      </MenuContext.Provider>
    );
  }

  private readonly setMenu = (name: string, menu: IMenu[]): void => {
    Object.assign(this.menus[name], menu);
  }
}

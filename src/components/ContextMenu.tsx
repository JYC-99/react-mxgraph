// @ts-ignore
import * as mxGraphJs from "mxgraph-js";
import * as React from "react";

import {
  mxEvent,
  mxUtils,
<<<<<<< HEAD
} from "../mxgraph";
=======
} = mxGraphJs;
>>>>>>> d58ba78728f17d45b6be1d0f5a481c8c5fdbe82f

import {
  IMxGraphContext,
  MxGraphContext,
} from "../context/MxGraphContext";

import {
  MenuContext,
} from "../context/MenuContext";

import {
  ClipboardContext,
} from "../context/ClipboardContext";

import {
  IMenu,
  IMenus,
} from "../types/menu";

import {
  IMxCell,
} from "../types/mxGraph";

export class ContextMenu extends React.PureComponent {
  public static contextType = ClipboardContext;
  public menus: IMenus;

  constructor(props: {}) {
    super(props);
    this.menus = {
      vertex: [],
      edge: [],
      canvas: []
    };
  }

  public render(): React.ReactNode {

    return (
      <MenuContext.Provider value={{ setMenu: this.setMenu }}>
        {this.props.children}
        <MxGraphContext.Consumer>{(value: IMxGraphContext) => {
          const {
            graph,
            actions,
          } = value;

          mxEvent.disableContextMenu(document.body);

          if (graph && actions) {
            graph.popupMenuHandler.autoExpand = true;
            graph.popupMenuHandler.factoryMethod = (menu, cell, _evt) => {
              const currentMenu: IMenu[] = this._getMenuFromCell(cell);
              if (currentMenu.length !== 0) {

                // tslint:disable-next-line: cyclomatic-complexity
                currentMenu.forEach((item) => {
                  const text = item.text ? item.text : "default";
                  const command = item.menuItemType;
                  // tslint:disable-next-line: prefer-switch
                  if (command === "separator") {
                    menu.addSeparator();
                  } else {
                    if (!actions.hasOwnProperty(command)) {
                      throw new Error("not be initialized in action");
                    }
                    const menuItem = menu.addItem(text, null, () => {
                      actions[command].func({x: menu.triggerX, y: menu.triggerY});
                    });
                    const td = (menuItem.firstChild && menuItem.firstChild.nextSibling && menuItem.firstChild.nextSibling) ? menuItem.firstChild.nextSibling.nextSibling : null;
                    const span = document.createElement("span");
                    span.style.color = "gray";
                    const shortCutText = actions[command].shortcuts ? actions[command].shortcuts[0] : "";
                    mxUtils.write(span, shortCutText);
                    if (td) { td.appendChild(span); }
                    // tslint:disable-next-line: prefer-switch
                    // if (item.menuItemType === "copy" || item.menuItemType === "cut") {
                    //   this.addListener(menuItem, graph, copy, textInput);
                    // }
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

  private readonly _getMenuFromCell = (cell: IMxCell | null) => {
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
    return this.menus[name];
  }

  private readonly setMenu = (name: string, menu: IMenu[]): void => {
    Object.assign(this.menus[name], menu);
  }

}

// @ts-ignore
import * as mxGraphJs from "mxgraph-js";
import * as React from "react";

const {
  mxEvent,
  mxUtils,
  mxPopupMenuHandler,
} = mxGraphJs;

import {
  IMxGraphContext,
  MxGraphContext,
} from "../context/MxGraphContext";

import {
  MenuContext,
} from "../context/MenuContext";

import {
  ClipboardContext,
  IClipboardContext,
} from "../context/ClipboardContext";

import {
  IMenu,
  IMenus,
} from "../types/menu";

import {
  ImxCell,
  IMxGraph,
  IMxMenu,
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
    // tslint:disable-next-line: deprecation
    const { copy, textInput } = this.context;

    return (
      <MenuContext.Provider value={{ setMenu: this.setMenu }}>
        {this.props.children}
        <MxGraphContext.Consumer>{(value: IMxGraphContext) => {
          const {
            graph,
            action,
          } = value;

          mxEvent.disableContextMenu(document.body);

          if (graph && action) {
            graph.popupMenuHandler.autoExpand = true;
            graph.popupMenuHandler.factoryMethod = (menu, cell, _evt) => {
              const currentMenu: IMenu[] = this._getMenuFromCell(cell);
              if (currentMenu.length !== 0) {

                // tslint:disable-next-line: cyclomatic-complexity
                currentMenu.map((item) => {
                  const text = item.text ? item.text : "default";
                  // tslint:disable-next-line: prefer-switch
                  if (item.menuItemType === "separator") {
                    menu.addSeparator();
                  } else {
                    if (!action.hasOwnProperty(item.menuItemType)) {
                      throw new Error("not be initialized in action");
                    }
                    const func = item.menuItemType === "paste" ?
                      action.paste.getFunc(menu.triggerX, menu.triggerY) :
                      action[item.menuItemType].func;
                    const menuItem = menu.addItem(text, null, func);
                    const td = menuItem.firstChild.nextSibling.nextSibling;
                    const span = document.createElement("span");
                    span.style.color = "gray";
                    const shortCutText = item.menuItemType === "paste" ? "Ctrl+V" :
                    item.menuItemType === "copy" ? "Ctrl+C" :
                    item.menuItemType === "cut" ? "Ctrl+X" :
                    item.menuItemType === "undo" ? "Ctrl+Z" : "";
                    mxUtils.write(span, shortCutText);
                    td.appendChild(span);
                    // tslint:disable-next-line: prefer-switch
                    if (item.menuItemType === "copy" || item.menuItemType === "cut") {
                      this.addListener(menuItem, graph, copy, textInput);
                    }
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
  private readonly addListener = (targetMenuItem: HTMLTableRowElement, graph: IMxGraph, copy: ICopy, textInput: HTMLTextAreaElement): void => {
    mxEvent.addListener(targetMenuItem, "pointerdown", (evt: PointerEvent) => {
      // tslint:disable-next-line: deprecation
      const source = mxEvent.getSource(evt);
      if (graph.isEnabled() && !graph.isEditing() && source.nodeName !== "INPUT") {
        // tslint:disable-next-line: deprecation
        this.context.beforeUsingClipboard(graph, copy, textInput);
      }
    });
    mxEvent.addListener(targetMenuItem, "pointerup", (_evt: PointerEvent) => {
      // tslint:disable-next-line: deprecation
      this.context.afterUsingClipboard(graph, copy, textInput);
    });
  }

  private readonly _getMenuFromCell = (cell: ImxCell | null) => {
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

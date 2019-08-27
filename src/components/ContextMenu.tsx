// @ts-ignore
import * as mxGraphJs from "mxgraph-js";
import * as React from "react";

const {
  mxEvent,
  mxUtils,
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
} from "../context/ClipboardContext";

import {
  IMenu,
  IMenus,
} from "../types/menu";

import {
  ImxCell,
  IMxGraph,
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
                  const type = item.menuItemType;
                  // tslint:disable-next-line: prefer-switch
                  if (type === "separator") {
                    menu.addSeparator();
                  } else {
                    if (!actions.hasOwnProperty(type)) {
                      throw new Error("not be initialized in action");
                    }
                    const menuItem = menu.addItem(text, null, () => {
                      actions[type].func({x: menu.triggerX, y: menu.triggerY});
                    });
                    const td = menuItem.firstChild.nextSibling.nextSibling;
                    const span = document.createElement("span");
                    span.style.color = "gray";
                    const shortCutText = actions[type].shortcuts ? actions[type].shortcuts[0] : "";
                    mxUtils.write(span, shortCutText);
                    td.appendChild(span);
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

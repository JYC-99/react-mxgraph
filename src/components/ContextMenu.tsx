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

export class ContextMenu extends React.PureComponent {
  public static contextType = ClipboardContext;
  public menus: IMenus;
  public menuHTMLItems: HTMLTableRowElement[];

  constructor(props: {}) {
    super(props);
    this.menus =  {
      vertex: [],
      edge: [],
      canvas: []
    };
    this.menuHTMLItems = [];
  }
  // tslint:disable-next-line: max-func-body-length
  public render(): React.ReactNode {
    const { copy, textInput } = this.context;
    console.log("render");
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
                // tslint:disable-next-line: cyclomatic-complexity
                currentMenu.map((item) => {
                  const text = item.text ? item.text : "default";
                  // tslint:disable-next-line: prefer-switch
                  if (item.menuItemType === "item" || item.menuItemType === "paste" || item.menuItemType === "copy" || item.menuItemType === "cut") {
                    // tslint:disable-next-line: no-unbound-method no-empty
                    let func = item.func ? item.func : () => {}; // not this

                    if (item.menuItemType === "paste") {
                      console.log("paste.....");
                      func = () => {
                        navigator.clipboard.readText().then(
                          result => {
                            console.log("Successfully retrieved text from clipboard", result);
                            textInput.focus();
                            this.context.pasteFuncForMenu(result, graph, copy, textInput, menu.triggerX, menu.triggerY);

                            return Promise.resolve(result);
                          }
                        )
                        .catch(
                          err => {
                            console.log("Error! read text from clipbaord", err)
                          });
                      };
                    } else if (item.menuItemType === "copy") {
                      func = () => {
                        console.log("copy");
                        document.execCommand("copy");
                      };
                    } else if (item.menuItemType === "cut") {
                      func = () => {
                        console.log("cut");
                        document.execCommand("cut");
                      }
                    }
                    const menuItem = menu.addItem(text, null, func);
                    // this.menuHTMLItems.concat(menuItem);
                    console.log(menuItem, menu);
                    this.addListener(menuItem, graph, copy, textInput);

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
  private readonly addListener = (targetMenuItem, graph, copy, textInput): void => {
    mxEvent.addListener(targetMenuItem, "pointerdown", (evt) => {
      console.log("pointerdown", evt);
      this.context.beforeClip(evt, graph, copy, textInput);
    });
    mxEvent.addListener(targetMenuItem, "pointerup", (_evt) => {
      console.log("pointerup");
      if (copy.restoreFocus) {
        copy.restoreFocus = false;
        if (!graph.isEditing()) { graph.container.focus(); }
        if (textInput.parentNode) { textInput.parentNode.removeChild(textInput); }
      }
    });
  }

  private readonly setMenu = (name: string, menu: IMenu[]): void => {
    Object.assign(this.menus[name], menu);
  }

}
